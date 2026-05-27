import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { Loader2, CheckCircle2, AlertCircle, Clock, Shield, Scale } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/sections/PageBanner";
import SupportSLA from "@/components/compliance/SupportSLA";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

const CATEGORIES = [
  { value: "complaint", label: "Complaint about a listing or experience" },
  { value: "ranking_dispute", label: "Dispute about ranking or comparison" },
  { value: "data_protection", label: "Data protection / privacy request" },
  { value: "accessibility", label: "Accessibility issue" },
  { value: "feedback", label: "General feedback or suggestion" },
  { value: "other", label: "Other" },
] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(254),
  category: z.enum([
    "complaint",
    "ranking_dispute",
    "data_protection",
    "accessibility",
    "feedback",
    "other",
  ]),
  providerName: z.string().trim().max(160).optional().or(z.literal("")),
  orderRef: z.string().trim().max(64).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Please provide at least 20 characters")
    .max(5000, "Please keep under 5000 characters"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must consent for us to respond" }),
  }),
});

type FormState = {
  name: string;
  email: string;
  category: string;
  providerName: string;
  orderRef: string;
  message: string;
  consent: boolean;
  hp: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  category: "",
  providerName: "",
  orderRef: "",
  message: "",
  consent: false,
  hp: "",
};

const ComplaintsPage: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrs[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrs);
      return;
    }

    setStatus("sending");
    try {
      const { data, error } = await supabase.functions.invoke("submit-complaint", {
        body: { ...parsed.data, hp: form.hp },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setReference(data?.reference ?? null);
      setStatus("ok");
      setForm(initialState);
    } catch (err) {
      logger.error("[complaints] submit failed", err);
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Feedback & Complaints | myhealth checkup</title>
        <meta
          name="description"
          content="Submit feedback, a complaint, or a regulatory dispute to myhealth checkup. Published response SLAs aligned to CMA, DMCC 2024, ASA and ICO guidance."
        />
        <link rel="canonical" href="https://www.myhealthcheckup.co.uk/complaints" />
      </Helmet>
      <Header />
      <main className="flex-grow bg-white">
        <PageBanner
          title="Feedback & Complaints"
          subtitle="Tell us what we got wrong, what we got right, or raise a formal dispute. Every submission is logged, acknowledged, and answered within our published SLA."
        />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* ============ Form ============ */}
            <Card>
              <CardHeader>
                <CardTitle>Submit your message</CardTitle>
              </CardHeader>
              <CardContent>
                {status === "ok" ? (
                  <div className="flex flex-col items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-green-900">
                      Thanks — we've received your submission
                    </h3>
                    <p className="text-sm text-green-900/80">
                      Your reference is{" "}
                      <span className="font-mono font-semibold">{reference}</span>.
                      We've sent an acknowledgement to your email and will respond
                      within our published SLA.
                    </p>
                    <Button variant="outline" onClick={() => setStatus("idle")}>
                      Submit another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* Honeypot */}
                    <input
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="hidden"
                      value={form.hp}
                      onChange={(e) => update("hp", e.target.value)}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Your name *</Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          maxLength={120}
                          autoComplete="name"
                          required
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive mt-1">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          maxLength={254}
                          autoComplete="email"
                          required
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Type of submission *</Label>
                      <Select
                        value={form.category}
                        onValueChange={(v) => update("category", v)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Choose a category…" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-xs text-destructive mt-1">{errors.category}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="providerName">Provider (optional)</Label>
                        <Input
                          id="providerName"
                          value={form.providerName}
                          onChange={(e) => update("providerName", e.target.value)}
                          maxLength={160}
                          placeholder="e.g. Medichecks"
                        />
                      </div>
                      <div>
                        <Label htmlFor="orderRef">Order reference (optional)</Label>
                        <Input
                          id="orderRef"
                          value={form.orderRef}
                          onChange={(e) => update("orderRef", e.target.value)}
                          maxLength={64}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Your message *</Label>
                      <Textarea
                        id="message"
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        rows={6}
                        maxLength={5000}
                        required
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>
                          {errors.message ? (
                            <span className="text-destructive">{errors.message}</span>
                          ) : (
                            "Please include any relevant dates, links, or order details."
                          )}
                        </span>
                        <span>{form.message.length}/5000</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="consent"
                        checked={form.consent}
                        onCheckedChange={(v) => update("consent", v === true)}
                      />
                      <Label htmlFor="consent" className="text-sm leading-snug font-normal">
                        I consent to MYHEALTHCHECKUP LTD processing the information
                        above for the sole purpose of responding to my submission, in
                        line with the UK GDPR and the Data Protection Act 2018.
                      </Label>
                    </div>
                    {errors.consent && (
                      <p className="text-xs text-destructive">{errors.consent}</p>
                    )}

                    {serverError && (
                      <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{serverError}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full sm:w-auto"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* ============ SLA sidebar ============ */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="w-4 h-4 text-primary" />
                    Our response SLA
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div>
                    <p className="font-semibold">Acknowledgement</p>
                    <p className="text-muted-foreground">
                      Within <strong>2 business days</strong>.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Full response</p>
                    <p className="text-muted-foreground">
                      Within <strong>10 business days</strong> for standard matters.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Data protection requests</p>
                    <p className="text-muted-foreground">
                      Up to <strong>30 calendar days</strong> (UK GDPR Art. 12).
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Scale className="w-4 h-4 text-primary" />
                    If you're still unhappy
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>You can escalate to:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <a
                        href="https://www.gov.uk/government/organisations/competition-and-markets-authority"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary"
                      >
                        Competition and Markets Authority (CMA)
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.asa.org.uk/make-a-complaint.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary"
                      >
                        Advertising Standards Authority (ASA)
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://ico.org.uk/make-a-complaint/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary"
                      >
                        Information Commissioner's Office (ICO)
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="w-4 h-4 text-primary" />
                    Direct contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Compliance:</strong>{" "}
                    <a className="underline" href="mailto:support@myhealthcheckup.co.uk">
                      support@myhealthcheckup.co.uk
                    </a>
                  </p>
                  <p>
                    <strong>Legal:</strong>{" "}
                    <a className="underline" href="mailto:support@myhealthcheckup.co.uk">
                      support@myhealthcheckup.co.uk
                    </a>
                  </p>
                  <p>
                    MYHEALTHCHECKUP LTD · Company No. 16589056 · Clapham, SW London, UK
                  </p>
                </CardContent>
              </Card>

              <SupportSLA variant="complaints" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComplaintsPage;
