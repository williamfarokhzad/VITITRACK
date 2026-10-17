import {runtime} from '../../../lib/server';
export async function GET(){const e=runtime();return Response.json({amd:!!(e.AMD_API_KEY&&e.AMD_BASE_URL&&e.AMD_MODEL),gemma:!!(e.AMD_MODEL&&/gemma/i.test(e.AMD_MODEL)),evolus:!!(e.EVOLUS_API_KEY&&e.EVOLUS_APPLICATION_ID&&e.EVOLUS_AGENT_ID),workflow:!!(e.EVOLUS_API_KEY&&e.EVOLUS_APPLICATION_ID&&e.EVOLUS_WORKFLOW_ID)});}
