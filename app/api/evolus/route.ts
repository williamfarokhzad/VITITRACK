import { budget, body, language, remote, aiError } from '../../../lib/ai';
import { user, runtime, failure } from '../../../lib/server';
export async function POST(req: Request) { try {
    await user();
    const e = runtime();
    const b = await body(req);
    if (!e.EVOLUS_API_KEY || !e.EVOLUS_APPLICATION_ID)
        return Response.json({ error: 'Evolus non collegato: configura il workspace evento, API key e application ID.' }, { status: 503 });
    const text = String(b.text || '').slice(0, 12000);
    if (!text.trim())
        return Response.json({ error: 'Scrivi una domanda o un riepilogo da inviare.' }, { status: 400 });
    await budget();
    const headers = { 'Content-Type': 'application/json', 'X-ApiKey': e.EVOLUS_API_KEY, 'X-Application-Id': e.EVOLUS_APPLICATION_ID };
    if (b.action === 'workflow') {
        if (!b.approved || !e.EVOLUS_WORKFLOW_ID)
            return Response.json({ error: 'Serve un workflow configurato e l’approvazione esplicita del testo.' }, { status: 400 });
        const result = await remote('https://api.evolus.ai/api/v1/workflows/' + encodeURIComponent(e.EVOLUS_WORKFLOW_ID) + '/execute', { method: 'POST', headers, body: JSON.stringify({ text, language: language(b.language) }) });
        return Response.json({ result });
    }
    return Response.json({ error: 'Use the assistant endpoint for conversations.' }, { status: 400 });
}
catch (e) {
    return aiError(e);
} }
