# Security and privacy checklist

This application processes health-related questions. Treat user messages as potentially sensitive.

- [ ] Keep model/provider API keys in Supabase Edge Function secrets; never expose them in frontend `VITE_*` variables.
- [ ] Review the `healthcare-chat` function's authentication configuration. If `verify_jwt = false` is intentional for public access, add appropriate abuse controls, rate limits, request-size limits, and server-side validation.
- [ ] Ensure Supabase Row Level Security policies are enabled and tested for any tables used by the application.
- [ ] Do not log full user prompts or generated answers if they may contain personal health information.
- [ ] Add rate limiting and provider timeout/error handling to reduce abuse and cost spikes.
- [ ] Keep the medical disclaimer visible and do not present chatbot output as diagnosis or a treatment plan.
- [ ] Document data retention, third-party AI processing, and privacy practices before inviting real users.
- [ ] Rotate any credentials that were accidentally committed; removing a value from the current file does not revoke it or remove it from Git history.
