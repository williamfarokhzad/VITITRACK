# Server setup

Keep values in the hosting project's environment settings, marked as secrets where appropriate. Do not paste keys into chats, client code, screenshots or GitHub. Deploy again after changing the hosted environment.

| Name | Value to provide | Secret |
| --- | --- | --- |
| AMD_API_KEY | Your team's redeemed `rc-…` key | Yes |
| AMD_BASE_URL | `https://developer.amd.com.cn/radeon/api/v1` | No |
| AMD_MODEL | `Gemma-4-31B-IT`, after checking `/models` | No |
| GOOGLE_AI_API_KEY | Your Google AI Studio key | Yes |
| GOOGLE_AI_MODEL | `gemini-3.5-flash-lite`, or a compatible model available to your project | No |
| EVOLUS_API_KEY | Event workspace key | Yes |
| EVOLUS_APPLICATION_ID | Workspace application ID | Yes |
| EVOLUS_AGENT_ID | Knowledge agent ID | Yes |
| EVOLUS_WORKFLOW_ID | Report preparation workflow ID | Yes |
| CLINICIAN_EMAILS | Independently verified professional email addresses, separated by commas | Yes |

The endpoint and model names are configured on the hosted site. No provider API keys have been installed. The PDF explains that each registered team member must redeem before the team key becomes visible at `https://notebooks.amd.com/tokenfactory`.

AMD use is intentionally limited to fixed fictional inputs because the event API terms exclude sensitive health data. Do not remove this boundary when adding keys. The current catalog is checked before inference; no other model is substituted silently.

In Evolus, configure an educational agent with an approved source library and instructions to cite original sources, describe uncertainty and avoid diagnosis or prescriptions. Match the workflow's input schema to `{text: string, language: "en" | "it"}`. Its only output should be a draft for human review. Do not add automatic clinical decisions, treatment changes or email dispatch. This workspace setup still needs to be done and verified.

To verify a connection, sign in to the hosted app, select the provider and send a fictional test question. Check the returned provider/model label and the provider dashboard. For AMD, use a sample prompt or the fixed demo report. Check a non-identifying test photo with Google only after approving its transfer. Verify Evolus agent chat and the approved workflow separately.

For real patient sharing, test with two separate authorised accounts and a non-identifying test record. Confirm the doctor can read only the granted record and that revocation blocks records, photos and messages. This two-account integration test has not been completed.

The app does not claim medical validation or partner-prize eligibility. The Evolus partner brief may require a dedicated AMD vLLM deployment in addition to these API adapters; check the current event requirements before submission.
