# Architecture

VitiTrack is a React/TypeScript web app built with Vinext and a Cloudflare Worker. It is responsive and can be added to an iPhone Home Screen. English is the default language; an EN / IT context translates presentation strings and selects the assistant response language. User-entered clinical text is preserved.

D1 stores profiles, journal entries, sharing grants, private care messages and bounded AI usage counters. R2 stores photos. Browser resizing converts images to JPEG, with manual polygons and threshold-based suggestions. Area calculations use clipped polygon unions and an optional coplanar ruler reference. LLMs never supply the numerical measurements.

The hosted sign-in gateway supplies trusted identity. All real record routes check it on the server. Doctor routes additionally check the email allowlist and current patient grant. Shared Doctor / Doctor and Patient / Patient shortcuts change fictional demo views only. The portable container strips gateway identity headers.

AI requests stay server-side. Google AI handles conversational support, consented photo-quality feedback and summaries of retrieved abstracts. Evolus supplies a separately configured educational agent and approved review workflow. AMD Token Factory runs Gemma on fixed fictional inputs only, respecting the event guide's restriction on sensitive health data. Its model catalog is checked before use. No key is returned in service-status responses.

The public papers route retrieves bounded metadata from Europe PMC and caches it for one hour. The authenticated summary route resolves a source ID against those retrieved articles; it does not accept arbitrary URLs or user-provided abstracts. Abstract-only summaries retain the original source link. Errors are shown without claiming fresh results.

AI routes require identity and explicit consent where personal text or a photo is transferred. Requests are bounded to eight chat turns, limited input sizes, short outputs, a 25-second provider timeout and 30 AI operations per user per hour. Responses identify the provider and model. No hidden provider fallback runs.

Human messages are separate from the AI conversation. They are accessible only to the patient and the currently enabled, authorised doctor, with a per-thread send limit and visible-page polling every 12 seconds. Demo messages are held in sessionStorage only. There is no invented doctor presence or automatic human reply.

No provider keys are configured, no live AI calls have been verified, and the two-account sharing flow remains untested. This is an experimental documentation prototype, not a diagnostic service.
