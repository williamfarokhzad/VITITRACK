import {healthConsent} from '../../../lib/privacy';
import { runtime, user, doctors } from '../../../lib/server';
import { body, ApiError, aiError } from '../../../lib/ai';
async function access(req: Request) { const u = await user(), target = new URL(req.url).searchParams.get('owner') || u.userId, e = runtime(); const grant = await e.DB.prepare('SELECT doctor FROM shares WHERE owner=?').bind(target).first(); const isDoctor = target !== u.userId; if (isDoctor && (!doctors().includes(u.email.toLowerCase()) || grant?.doctor !== u.email.toLowerCase()))
    throw new ApiError('Access not permitted.', 403); if(!await healthConsent(target))throw new ApiError('The patient has not given current consent for health-data storage.',403);
    if (!grant || !doctors().includes(String(grant.doctor)))
    throw new ApiError('Connect with an enabled doctor in your profile first.', 409); return { u, target, isDoctor, e, grant }; }
export async function GET(req: Request) { try {
    const { target, e } = await access(req);
    const d = await e.DB.prepare('SELECT id,sender,body,created FROM messages WHERE owner=? ORDER BY created DESC LIMIT 100').bind(target).all();
    return Response.json({ messages: d.results.reverse() });
}
catch (e) {
    return aiError(e);
} }
export async function POST(req: Request) { try {
    const { target, e, isDoctor } = await access(req), b = await body(req, 8000), text = String(b.text || '').trim();
    if (!text || text.length > 2000)
        throw new ApiError('Enter a message of up to 2,000 characters.');
    const recent = await e.DB.prepare('SELECT COUNT(*) AS n FROM messages WHERE owner=? AND created>?').bind(target, new Date(Date.now() - 60000).toISOString()).first();
    if (recent.n >= 12)
        throw new ApiError('Please wait before sending more messages.', 429);
    const id = crypto.randomUUID();
    await e.DB.prepare('INSERT INTO messages (id,owner,sender,body,created) VALUES (?,?,?,?,?)').bind(id, target, isDoctor ? 'doctor' : 'patient', text, new Date().toISOString()).run();
    return Response.json({ ok: true });
}
catch (e) {
    return aiError(e);
} }
