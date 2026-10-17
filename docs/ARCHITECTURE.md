# How the app is built

## Photos and annotations

VitiTrack uses React and Vinext. Photos are resized and converted to JPEG before they open in the canvas editor. The user draws a region of interest, and a simple brightness and colour threshold suggests patches inside it. The user can change those patches or draw them manually.

`lib/geometry.mjs` calculates the combined patch area without counting overlaps twice and clips it to the selected region. A ruler photographed in the same plane can provide an approximate scale. This is an experimental measurement tool, not a diagnostic model.

Diary entries and observations feed an editable visit report. The ten public example profiles are fictional, their images were generated with AI, and the starting charts contain invented values. They are not a record of treatment results.

## Records and access

The hosted app receives verified identity information through the ChatGPT Sites gateway. D1 stores profiles, records and sharing grants. R2 stores private photos.

A clinician needs both a server-side allowlist entry and the patient's permission to view that patient's records. Switching the interface to the doctor view does not grant access. The full process with separate patient and clinician accounts still needs testing.

## AI connections

The `/api/report` route reads structured observations and sends them to the configured AMD endpoint using a server-held key. The intended model is Google Gemma. The output is a draft summary for the user to review. Original photos are not sent by this route.

The `/api/evolus` route supports agent chat and workflow execution. The proposed setup combines an approved reference library with a report preparation workflow. The agent would use an open model hosted on AMD.

The workflow should extract dates, observations and questions from the report text, check required fields and return a draft for review. Its actual input schema must be checked in the Evolus workspace. External inference and workflow execution have not yet been verified. There is no automatic delivery to doctors or automatic change to a patient's care.

## Local and hosted versions

The hosted version relies on the Sites identity gateway. The local development server has a loopback-only mock account. The Docker demo has no trusted sign-in gateway, so `VITITRACK_CONTAINER_DEMO=true` removes incoming identity headers and leaves the anonymous demo available.

Hosting elsewhere requires a verified authentication adapter and storage setup. Forwarding identity headers supplied by the browser is not sufficient.

This source package comes from deployed revision `aceae0e3d346d457da3f5e2daefe361cd5bd9404`. The export adds documentation, container packaging and an identity-header guard for the container, and removes the hosting project ID. These changes have not been deployed to the live app.
