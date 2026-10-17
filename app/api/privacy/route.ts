import { runtime, user } from '../../../lib/server';
import { body, aiError, ApiError } from '../../../lib/ai';
import { POLICY_VERSION, healthConsent } from '../../../lib/privacy';
import { sameOrigin } from '../../../lib/provider-settings';
export async function GET(req: Request) { try {
    const u = await user(), e = runtime();
    const row = await e.DB.prepare('SELECT data,updated FROM privacy_choices WHERE owner=?').bind(u.userId).first();
    if (new URL(req.url).searchParams.get('export') === '1') {
        const [profile, records, shares, messages] = await Promise.all([e.DB.prepare('SELECT data FROM profiles WHERE owner=?').bind(u.userId).first(), e.DB.prepare('SELECT id,data,created FROM records WHERE owner=? ORDER BY created').bind(u.userId).all(), e.DB.prepare('SELECT doctor FROM shares WHERE owner=?').bind(u.userId).first(), e.DB.prepare('SELECT id,sender,body,created FROM messages WHERE owner=? ORDER BY created').bind(u.userId).all()]);
        const photos = [];
        let cursor: string | undefined;
        do {
            const page = await e.BUCKET.list({ prefix: u.userId + '/', cursor, limit: 1000 });
            photos.push(...page.objects.map((o: any) => ({ key: o.key, download: '/api/photo?key=' + encodeURIComponent(o.key) })));
            cursor = page.truncated ? page.cursor : undefined;
        } while (cursor && photos.length < 10000);
        return Response.json({ exportedAt: new Date().toISOString(), account: { userId: u.userId, email: u.email, displayName: u.fullName || '' }, profile: profile ? JSON.parse(profile.data) : {}, records: records.results.map((r: any) => ({ id: r.id, ...JSON.parse(r.data), created: r.created })), sharing: shares || null, messages: messages.results, privacy: row ? JSON.parse(row.data) : null, photos, photosComplete: !cursor, note: 'Photo links require your signed-in session. Download them separately; this JSON does not embed image files.' }, { headers: { 'Content-Disposition': 'attachment; filename="VitiTrack-my-data.json"', 'Cache-Control': 'private, no-store' } });
    }
    return Response.json({ version: POLICY_VERSION, choices: row ? JSON.parse(row.data) : { health: false, adult: false }, consented: await healthConsent(u.userId), updatedAt: row?.updated || null }, { headers: { 'Cache-Control': 'private, no-store' } });
}
catch (e) {
    return aiError(e);
} }
export async function POST(req: Request) { try {
    const u = await user();
    sameOrigin(req);
    const b = await body(req, 3000);
    if (b.health === true && (b.adult !== true || b.version !== POLICY_VERSION))
        throw new ApiError('Confirm that you are 18 or older and have read the current privacy notice.');
    const data = { health: b.health === true, adult: b.adult === true, version: POLICY_VERSION, locale: b.language === 'it' ? 'it' : 'en', recordedAt: new Date().toISOString() };
    const e = runtime();
    await e.DB.prepare('INSERT INTO privacy_choices(owner,data,updated) VALUES(?,?,?) ON CONFLICT(owner) DO UPDATE SET data=excluded.data,updated=excluded.updated').bind(u.userId, JSON.stringify(data), data.recordedAt).run();
    if (!data.health)
        await e.DB.prepare('DELETE FROM shares WHERE owner=?').bind(u.userId).run();
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
catch (e: any) {
    return e.message === 'FORBIDDEN' ? Response.json({ error: 'Request not permitted.' }, { status: 403 }) : aiError(e);
} }
export async function DELETE(req: Request) { try {
    const u = await user();
    sameOrigin(req);
    const b = await body(req, 1000);
    if (b.confirm !== 'DELETE')
        throw new ApiError('Type DELETE to confirm erasure.');
    const e = runtime();
    let pages = 0;
    while (true) {
        const page = await e.BUCKET.list({ prefix: u.userId + '/', limit: 1000 });
        if (!page.objects.length)
            break;
        await e.BUCKET.delete(page.objects.map((o: any) => o.key));
        if (++pages >= 20)
            throw new ApiError('Photo deletion is partially complete. Repeat the request to finish.', 409);
    }
    await e.DB.batch(['records', 'profiles', 'shares', 'messages', 'privacy_choices'].map(table => e.DB.prepare('DELETE FROM ' + table + ' WHERE owner=?').bind(u.userId)));
    const prefix = u.userId + ':';
    await e.DB.prepare('DELETE FROM ai_usage WHERE substr(id,1,?)=?').bind(prefix.length, prefix).run();
    return Response.json({ ok: true, deleted: true }, { headers: { 'Cache-Control': 'no-store' } });
}
catch (e: any) {
    return e.message === 'FORBIDDEN' ? Response.json({ error: 'Request not permitted.' }, { status: 403 }) : aiError(e);
} }
