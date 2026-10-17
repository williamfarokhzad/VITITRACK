# Hackathon submission notes

VitiTrack was built for the Health and Wellbeing track at the [AMD Developer Hackathon: ACT III](https://lablab.ai/ai-hackathons/amd-developer-hackathon-act-iii). I am participating in person in Milan as William Farokhzad / WIFA Robotics. The online event runs from 12 to 18 October 2026, with the Italian on-site sessions on 17 and 18 October.

These notes reflect the event page checked on 17 October 2026.

## What is ready

The [live prototype](https://wifa-vititrack.williamfar.chatgpt.site) is available. The public GitHub repository has been created, and the source package includes the code, ten fictional example profiles, an MIT license, local setup instructions and a Docker configuration. The source is published in this repository.

The photo editor requires people to review its results. Visit reports are editable, and the app does not make autonomous diagnoses or prescribe treatments. Software checks and their limits are recorded in [VALIDATION.md](VALIDATION.md).

## What remains

AMD needs to power a working part of the product shown to the judges. The report adapter is ready, but it still needs a successful call through the approved AMD endpoint. Record the exact model ID and keep a redacted example of its output.

For the Google prize, the working integration needs to use Gemma on AMD. For the Evolus track, we still need the event workspace, at least two building blocks and actual API calls from the app. The proposed building blocks are a reference library and a report preparation workflow.

The main event FAQ allows Token Factory. The Evolus track specifically asks for an open model served through our own vLLM endpoint on AMD Developer Cloud. Any exception needs confirmation from the organizers. The presence of integration code does not establish eligibility.

The Docker image also needs a build and run on a machine with Docker. The demo video, pitch slides and final cover still need to be uploaded, with their links added to the lablab submission form. Registration, AMD program membership, Discord, team details and the submission deadline should be checked in the event dashboard.

## Submission text

Project title: WIFA VitiTrack

Short description:

A vitiligo photo journal that helps people keep track of skin observations, record their care and prepare a report for their dermatologist.

Long description:

I have lived with vitiligo myself. Looking at photos of my hands, I sometimes wondered whether my skin was changing or whether the light was different. That experience led me to build VitiTrack.

The app brings photos, observations and a care diary into one place. People can review experimental measurements of the areas they have marked and prepare an editable report for a dermatology appointment. There is also a clinician view for consent-based access and a public view with fictional examples.

The prototype has an English and Italian mobile interface and ten AI-generated example profiles. Its image processing runs in the browser and needs human review. It has not been clinically validated.

The implemented adapters use AMD-hosted Gemma for fixed fictional demos, Google AI for conversation, photo-quality review and abstract summaries, and Evolus for a configured knowledge agent and approved review workflow. Token Factory receives no personal health data. The adapters are implemented, but these external services still need to be configured and tested. VitiTrack does not diagnose vitiligo, prescribe care or claim that a treatment works.

Category: Health and Wellbeing. Describe AMD, Gemma and Evolus as planned integrations until their live use has been verified, then update the description and technology tags to match the demonstration.

## Demonstration

Start with one fictional profile, open its hand photo and mark the area to follow. Review the patch mask, save a demo observation and add a care entry. Finish by opening the report and showing how the patient can edit it before a visit.

Explain that the initial trend chart contains invented values. Show a real AMD/Gemma response and an Evolus execution only after those connections work. Keep API keys and personal data out of recordings, screenshots and logs.

Creating the repository does not submit the project. The final application, repository, video and slide links must be added to the lablab team dashboard before the confirmed deadline.
