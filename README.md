# WIFA VitiTrack

I started VitiTrack after living with vitiligo myself. When I compared photos of my hands, I sometimes found it hard to tell whether my skin had changed or whether the light was different.

The app gives people a place to keep their photos, write down their care and prepare a report for their dermatologist. I built this prototype during the AMD Developer Hackathon: ACT III in Milan, on 17 and 18 October 2026.

William Farokhzad, [WIFA Robotics](https://wifarobotics.com/)

[Try the app](https://wifa-vititrack.williamfar.chatgpt.site)

[Hackathon details](https://lablab.ai/ai-hackathons/amd-developer-hackathon-act-iii)

## An imagined journey

![Ten fictional stages, from concern to a smile](public/story/fictional-journey-10-steps.webp)

This sequence was generated with AI for the project artwork. It imagines gradual repigmentation and a change in expression. It is not a patient's treatment history, a result produced by VitiTrack or a promise of recovery.

## Using the app

You can explore the demo without an account. Choose English or Italian with the EN / IT switch. English is the default.

Open “Volti e percorsi” to browse the example profiles. Select “Analizza mani” to open a hand photo in the editor. Outline the area you want to follow, then review the proposed white patches. You can also draw the patches yourself.

If a ruler is visible in the photo, you can use it to estimate dimensions. It needs to be in the same plane as the skin being measured. Add your observation to the diary, record the care you have followed and prepare a report to discuss with your doctor.

The app has patient, doctor and public research views. Switching between them changes the demo interface; access to saved medical records is checked separately on the server.

On an iPhone, open the app in Safari, tap Share and choose Add to Home Screen. An Apple Developer account is not needed to demonstrate it this way. The app needs an internet connection.

## Photos and measurements

The ten example people are fictional. Their face and hand images were generated with AI, and their names and countries were assigned for the demo. The starting charts and public statistics are also invented. They do not show a real patient's progress or prove that a treatment works.

The editor runs in the browser. It resizes the image, converts it to JPEG and looks for bright areas with little colour inside the region you selected. You need to check the result. The area calculation handles overlapping patches and clips them to your selected region. Ruler calibration adds approximate physical dimensions.

These measurements are experimental. Lighting, skin tone, camera settings, hand position and skin curvature can affect them. They are not a diagnosis or a validated score such as VASI. No clinical trial or accuracy study has been carried out for this prototype.

## AMD, Google AI and Evolus

Each service has a different job. The app shows which credentials are configured; this is separate from a successful live connection.

| Service | Job in this prototype |
| --- | --- |
| AMD Token Factory / Google Gemma | Fixed fictional examples and a sample visit draft. The server checks the current model catalog before inference. |
| Google AI / Gemini Flash-Lite | Conversational support, photo-quality feedback and summaries of retrieved paper abstracts. |
| Evolus | A configured knowledge agent and an explicitly approved report preparation workflow. |

The event's Token Factory guide lists `https://developer.amd.com.cn/radeon/api/v1` and `Gemma-4-31B-IT`. Its terms prohibit sensitive health data. For that reason, AMD receives only server-owned fictional report data or a small set of fixed sample questions. It never receives uploaded photos, real diary entries or free-text personal messages. Google Gemma is a model running on AMD; Google AI is a separate API.

The research page requests recent papers from Europe PMC, sorted by publication date, and shows the retrieval time. Results are cached for up to one hour. Abstract summaries use Google AI and link back to the retrieved source. The curated reading list is kept separately. If retrieval fails, the app displays the error and a PubMed link rather than presenting older results as a live feed.

Live calls to the three AI providers have not yet been verified: the API keys and Evolus workspace IDs are still missing. The uploaded AMD guide contains documentation, not an actual team key. The research service could not be reached from the development preview; its hosted retrieval still needs verification.

See [server setup](docs/SERVER_SETUP.md), [the submission notes](docs/HACKATHON.md) and [the architecture notes](docs/ARCHITECTURE.md).

## Doctor and patient access

In Profile / Settings, use `Doctor` with password `Doctor`, or `Patient` with password `Patient`. These are public demo shortcuts, not clinical authentication. The doctor demo has a patient list and a separate workspace. Demo messages stay in the same browser session, so you can switch roles and show both sides without contacting anyone.

Real records and messages require hosted ChatGPT sign-in. A real doctor must also be on the independently verified server allowlist and have the patient's current sharing grant. Revoking the grant blocks further access. Human messages refresh every 12 seconds while the page is visible; no artificial online status or automatic doctor reply is shown. The AI assistant is always identified as AI.

## Running locally

Use Node.js 24 and pnpm 11.25.0. You can install pnpm with `npm install --global pnpm@11.25.0`.

Clone the repository:

```bash
git clone https://github.com/williamfarokhzad/VITITRACK.git
cd VITITRACK
pnpm install --frozen-lockfile
pnpm run dev:portable
```

If you downloaded the source ZIP, extract it and run the same commands from the VITITRACK folder, starting with `pnpm install --frozen-lockfile`.

Open http://localhost:5173. The example gallery, photo editor and local reports work without API keys.

Local development includes a mock account, `seedy@sites.test`, restricted to loopback access. To try saving records with that account, initialize the local database first:

```bash
pnpm run build:portable
pnpm run db:local
pnpm run dev:portable
```

Run `db:local` after each database migration. It applies the migration files in order and remembers completed migrations. Use test data for local development.

## Running with Docker

```bash
docker compose up --build
```

Open http://localhost:8080. You can also build and run it directly:

```bash
docker build -t vititrack .
docker run --rm -p 127.0.0.1:8080:8080 vititrack
```

The container runs the built app in Wrangler's local Cloudflare emulator. It supports the anonymous demo. Saved records, clinician sharing and authenticated AI requests depend on the hosted sign-in and storage setup. The container discards incoming identity headers because it has no trusted sign-in gateway.

Docker was not available in the development environment, so the image itself has not been tested. The underlying app build and emulator checks passed. Details are in [the validation notes](docs/VALIDATION.md).

## Server configuration

The live app uses ChatGPT Sites for sign-in, D1 for records and R2 for photos. A patient can grant access to one clinician from a verified server-side allowlist and revoke it later. The complete flow with two real accounts still needs testing.

Use `.env.example` as a reference and keep actual values in your server's secret settings or an ignored local environment file.

| Variable | Purpose |
| --- | --- |
| `AMD_API_KEY` | Key for the approved AMD endpoint |
| `AMD_BASE_URL` | OpenAI-compatible base URL, including `/v1` |
| `AMD_MODEL` | Exact Gemma model ID available on that endpoint |
| `GOOGLE_AI_API_KEY` | Google AI Studio API key |
| `GOOGLE_AI_MODEL` | Multimodal model; default `gemini-3.5-flash-lite` |
| `EVOLUS_API_KEY` | Evolus API key |
| `EVOLUS_APPLICATION_ID` | Event workspace application ID |
| `EVOLUS_AGENT_ID` | Configured agent ID |
| `EVOLUS_WORKFLOW_ID` | Report workflow ID |
| `CLINICIAN_EMAILS` | Comma-separated list of independently verified clinician emails |

`/api/assistant` handles bounded, consented conversations with the selected service. `/api/image-review` sends an explicitly approved resized JPEG to Google for lighting, focus and framing feedback. Geometric measurement stays local and human-reviewed. `/api/report` uses fixed fictional data with AMD. `/api/evolus` accepts explicitly approved workflow text; check the `{text, language}` input against the schema in your workspace first. The event workspace and its agent/library/workflow have not been created by this code.

AI requests require sign-in, have size and timeout limits, and share a per-user allowance of 30 requests per hour. Provider-level and team-level quotas still apply. A rate-limit error asks the user to wait; the app does not silently switch providers or repeat paid requests.

`/api/integrations` shows whether settings are present. It does not confirm that a service has responded successfully.

If you host the app outside Sites, you will need a verified authentication gateway and your own storage configuration. Do not accept user-supplied `oai-authenticated-user-*` headers as proof of identity. Never commit API keys.

## Development checks

```bash
pnpm test
pnpm run typecheck
pnpm run build:portable
```

The main interface is in `app/viti-app.tsx`. Server routes are in `app/api/`. The measurement code and tests are in `lib/geometry.mjs` and `tests/geometry.test.mjs`. Database definitions are in `db/` and `drizzle/`, and the example images are in `public/demo-people/`.

## Before use with patients

VitiTrack is a prototype for documenting observations and preparing conversations with a doctor. It does not prescribe care or compare treatments for effectiveness. A clinical release would need validation across skin tones, reviewed consent and privacy information, retention and deletion controls, and a security review.

No doctor or event partner is presented as endorsing the project. Any clinical collaboration will be named only with that person's consent.

## License

The project code is released under the [MIT license](LICENSE), copyright 2026 William Farokhzad / WIFA Robotics. Upstream notices are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Linked articles and any separately obtained model weights keep their own licenses. This repository does not include Gemma weights.

## Short video

The ten fictional portraits are also available as a [14.5-second MP4](public/story/fictional-journey-10-steps.mp4), with soft transitions. The demo home page and gallery show it alongside the complete image. Both include a disclosure that the sequence is fictional and does not show treatment results.

## Phone diary and stabilized video

The home screen now follows the supplied mobile design with four diary tabs, latest photo, monthly calendar, timeline and visit preparation. The mint and lavender layout works as a responsive web app and can be added to an iPhone Home Screen. The 14.4-second portrait sequence uses eye-region registration and scale normalization to keep the face centered. Artwork captions have been removed from the cover and contact sheet; the story remains described as a fictional simulation beside the video.
