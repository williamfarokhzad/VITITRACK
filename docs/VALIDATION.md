# Checks completed on 17 October 2026

The geometry tests passed for scale, bounding dimensions, overlapping patches, clipping to the selected region, empty inputs and zero-area cases. TypeScript passed with `tsc --noEmit`, and the portable Vinext build completed.

The built Worker ran in the local emulator. The home page and a full example image returned HTTP 200. Requests for saved records returned HTTP 401 both without an account and with forged identity headers.

The gallery includes all ten full images and ten thumbnails. The hosted interface was checked visually on the home page, in the gallery and in the final profile's image viewer. Opening that profile's hand photo in the annotation editor also worked.

Docker was unavailable, so the Docker image itself has not been built or run. The app has not been tested on a real iPhone, and the full patient-to-clinician sharing process with two accounts remains untested. Live AMD/Gemma inference and Evolus workflows also remain unverified.

The included CI workflow runs the geometry tests, TypeScript check and portable build on push. Check the Actions tab for the result of the clean-install check after publication. The local checks reused the dependencies installed for the deployed app; a clean installation should also be verified.

These checks cover software behaviour. They do not establish medical accuracy or treatment effectiveness.

The phone diary was checked in a 390-pixel iframe preview: layout, calendar month navigation and Note/Diario navigation worked. The stabilized MP4 decoded without errors. The cover and storyboard edits were inspected visually. This is browser-based responsive QA, not a physical iPhone test.

## Bilingual and communication update

The EN / IT switch, English calendar, Doctor / Doctor demo login, doctor dashboard and a same-browser doctor-to-patient message were exercised in the browser. The 390-pixel phone diary was inspected visually. A compatibility issue with demo message IDs on an HTTP preview was fixed and retested.

Twelve route contract checks use the actual handlers with isolated identity and provider fixtures. They cover anonymous access, consent, rejection of free-text AMD input, removal of chat history from AMD sample requests, fixed server-owned AMD report data, doctor allowlisting, patient grant checks and revoked access. These are software contract tests, not live provider tests or a clinical validation.

The latest-paper request failed from the development preview. The error state and source link render correctly; hosted retrieval remains unverified. No AMD, Google AI or Evolus inference was run, because the necessary secrets are absent. No real patient data was sent to any provider. The new D1 schema adds messages and usage counters through an appended migration.

## Mobile navigation, key settings and privacy controls

The same five bottom destinations were checked across patient and doctor Home, Photos, Chat, Research and Profile screens. Photo capture, care notes, visit report, gallery, synthetic insights and both legal pages were also checked at a 320-pixel iframe width; no horizontal page overflow was found. Header and profile images follow the selected role. The floating doctor image opens human care messages, not the AI tab. The home story video was played and paused; the media reported a 14.4-second duration and readyState 4.

The public Doctor demo showed the locked API settings panel and no key input or saved credentials. Contract tests exercise AES-GCM encryption and tamper rejection, project-owner authorisation, cross-origin rejection, a bounded synthetic model check, consent version/age requirements, withdrawal, subject-scoped export and erasure. All seven tables were created successfully by applying the three immutable migrations to SQLite. TypeScript and the existing geometry and access tests passed.

No real provider credentials were entered and no live AI test was performed. Actual signed-in owner configuration and the two-account clinical sharing flow remain untested end to end. Responsive browser checks are not a physical iPhone test. The privacy pages describe prototype limits rather than claiming certified or complete GDPR compliance.
