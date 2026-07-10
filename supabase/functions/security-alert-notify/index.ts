// Sends Cyber Essentials operational alerts (cron failures, RLS failures,
// backup-restore failures) to every enabled recipient in security_alert_recipients.
//
// Triggered server-side (by Postgres trigger on cron_run_log) and from the
// backup-restore script. Public endpoint (verify_jwt=false) but rate-limited
// and only accepts a fixed payload shape — no data leakage risk.

import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

interface AlertPayload {
  alert_type: 'cron_failure' | 'rls_failure' | 'backup_restore_failure'
  subject: string
  job_name?: string
  started_at?: string
  finished_at?: string
  duration_ms?: number
  error_message?: string
  evidence_path?: string
  log_row_id?: string
  details?: Record<string, unknown>
  /** When true, render only and return the to/subject/html — no Resend call, no DB write. */
  dry_run?: boolean
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const FROM_ADDRESS = Deno.env.get('ALERT_FROM_ADDRESS') ?? 'alerts@notify.www.myhealthcheckup.co.uk'

function renderHtml(p: AlertPayload): string {
  const rows: [string, string | undefined][] = [
    ['Alert type', p.alert_type],
    ['Job / context', p.job_name],
    ['Started', p.started_at],
    ['Finished', p.finished_at],
    ['Duration (ms)', p.duration_ms?.toString()],
    ['Error', p.error_message],
    ['Evidence pack', p.evidence_path],
    ['Log row id', p.log_row_id],
  ]
  const tbody = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;border:1px solid #eee;font-weight:600">${k}</td><td style="padding:6px 12px;border:1px solid #eee"><code>${escapeHtml(String(v))}</code></td></tr>`)
    .join('')
  const detailsBlock = p.details
    ? `<h3 style="margin-top:24px">Details</h3><pre style="background:#f6f8fa;padding:12px;border-radius:6px;font-size:12px;overflow:auto">${escapeHtml(JSON.stringify(p.details, null, 2))}</pre>`
    : ''
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#111">
    <h2 style="color:#e70d69;margin:0 0 12px">${escapeHtml(p.subject)}</h2>
    <p style="color:#444">Automated Cyber Essentials operational alert. Attach this email to the quarterly evidence pack.</p>
    <table style="border-collapse:collapse;border:1px solid #eee">${tbody}</table>
    ${detailsBlock}
    <p style="color:#888;font-size:12px;margin-top:24px">myhealth checkup — operational monitoring</p>
  </div>`
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // Require service-role bearer auth — internal-only endpoint called by
    // Postgres triggers and CI scripts. Blocks unauthenticated callers from
    // spamming admin inboxes or social-engineering staff via attacker-
    // controlled subject/error_message fields.
    const authHeader = req.headers.get('Authorization') ?? ''
    if (!SERVICE_ROLE_KEY || authHeader !== `Bearer ${SERVICE_ROLE_KEY}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const payload = (await req.json()) as AlertPayload
    if (!payload?.alert_type || !payload?.subject) {
      return new Response(JSON.stringify({ error: 'alert_type and subject required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Dry-run path: render only, do not query DB or call Resend.
    if (payload.dry_run) {
      const html = renderHtml(payload)
      return new Response(JSON.stringify({
        dry_run: true,
        to: ['dry-run@example.test'],
        subject: payload.subject,
        html,
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supa = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    const { data: recipients, error } = await supa
      .from('security_alert_recipients')
      .select('email')
      .eq('enabled', true)
      .contains('alert_types', [payload.alert_type])

    if (error) {
      console.error('recipient lookup failed', error)
      return new Response(JSON.stringify({ error: 'recipient lookup failed' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const to = (recipients ?? []).map((r) => r.email)
    if (to.length === 0) {
      console.warn('no recipients configured for', payload.alert_type)
      return new Response(JSON.stringify({ sent: 0, reason: 'no recipients' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const html = renderHtml(payload)

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `MHC Alerts <${FROM_ADDRESS}>`,
        to,
        subject: payload.subject,
        html,
      }),
    })

    const body = await resp.text()
    if (!resp.ok) {
      console.error('resend failed', resp.status, body)
      return new Response(JSON.stringify({ error: 'send failed', status: resp.status, body }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ sent: to.length, resend: JSON.parse(body) }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('security-alert-notify error', e)
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
