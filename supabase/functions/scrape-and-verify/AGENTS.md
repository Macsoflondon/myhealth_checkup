# Link verification

- Accept requests with HTTP 202 and retain verification with EdgeRuntime.waitUntil; stop new checks at 330 seconds and always finalise completed/partial logs. Why: foreground timeouts previously abandoned coverage and run state.
- Order discovery by null-first verification time and stable ID, retaining that order in each unchanged provider pool. Why: unvisited links must receive priority on subsequent runs.
- Verify allowlisted own-domain Shopify product handles using one complete paginated live catalogue per store; normalise both sides with the shared handle helper and leave incomplete feeds unchanged. Why: page requests are blocked, partial feeds cannot prove absence and Unicode encoding must not produce false alerts.