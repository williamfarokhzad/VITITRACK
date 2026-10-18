import { runtime } from '../../../lib/server';
import { integrationAdmin, providerEnv, providers, safeFields, allowedFields, encryptSettings, sameOrigin, type Provider } from '../../../lib/provider-settings';
import { body, complete, budget, aiError, ApiError, language } from '../../../lib/ai';
export async function GET() { try {
    await integrationAdmin();
    const e = await providerEnv(), rows = await runtime().DB.prepare('SELECT id,updated_at,tested_at,test_status,test_detail FROM provider_settings').all();
    return Response.json({ canManage: true, providers: providers.map(id => ({ id, hasKey: !!e[allowedFields(id)[0]], fields: safeFields(id, e), ...rows.results.find((r: any) => r.id === id) })) }, { headers: { 'Cache-Control': 'private, no-store' } });
}
catch (e: any) {
    return Response.json({ canManage: false, error: e.message === 'AUTH' ? 'Sign in with the project owner account.' : 'Only the project administrator can manage API keys.' }, { status: e.message === 'AUTH' ? 401 : 403, headers: { 'Cache-Control': 'no-store' } });
} }
export async function POST(req: Request) {
    try {
        const u = await integrationAdmin();
        sameOrigin(req);
        const b = await body(req, 12000), provider = String(b.provider) as Provider;
        if (!providers.includes(provider))
            throw new ApiError('Unknown provider.');
        const e = runtime();
        if (b.action === 'test') {
            try {
                await budget();
            }
            catch (err: any) {
                if (err instanceof ApiError)
                    throw err;
                throw new ApiError('The app could not check its AI usage limit. Its hosted database needs attention; the provider was not called.', 503);
            }
            const start = Date.now();
            try {
                const d = await complete(provider, [{ role: 'user', content: 'This is a fictional connectivity check. Reply with one brief greeting. No patient data is involved.' }], language(b.language), undefined, 64);
                const result = { ok: true, provider: d.provider, model: d.model, elapsedMs: Date.now() - start, testedAt: new Date().toISOString() };
                await e.DB.prepare('UPDATE provider_settings SET tested_at=?,test_status=?,test_detail=? WHERE id=?').bind(result.testedAt, 'success', d.model, provider).run();
                return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
            }
            catch (err: any) {
                const detail = err instanceof ApiError ? err.message : 'Unexpected server error during the provider check.';
                try {
                    await e.DB.prepare('UPDATE provider_settings SET tested_at=?,test_status=?,test_detail=? WHERE id=?').bind(new Date().toISOString(), 'failed', detail.slice(0, 240), provider).run();
                }
                catch { /* Preserve the provider error if recording the diagnostic also fails. */ }
                throw err;
            }
        }
        if (b.action !== 'save')
            throw new ApiError('Unknown action.');
        const previous = await providerEnv(), data: Record<string, string> = {};
        for (const field of allowedFields(provider)) {
            let value = String(b.fields?.[field] || '').trim();
            if (value.length > 4096)
                throw new ApiError('Configuration value is too long.');
            if (field.endsWith('_API_KEY') && !value)
                value = String(previous[field] || '');
            data[field] = value;
        }
        if (!data[allowedFields(provider)[0]])
            throw new ApiError('Enter an API key.');
        if (provider === 'amd') {
            let url: URL;
            try {
                url = new URL(data.AMD_BASE_URL);
            }
            catch {
                throw new ApiError('Enter a valid AMD HTTPS endpoint.');
            }
            if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || /^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|\[)/i.test(url.hostname) || !url.pathname.replace(/\/$/, '').endsWith('/v1'))
                throw new ApiError('Use a public HTTPS model endpoint ending in /v1.');
            if (!data.AMD_MODEL)
                throw new ApiError('Enter the exact AMD model ID.');
            data.AMD_BASE_URL = url.toString().replace(/\/$/, '');
        }
        if (provider === 'google' && !/^[\w.-]+$/.test(data.GOOGLE_AI_MODEL))
            throw new ApiError('Enter a valid Google model ID.');
        if (provider === 'evolus' && (!data.EVOLUS_APPLICATION_ID || !data.EVOLUS_AGENT_ID))
            throw new ApiError('Enter the Evolus application and agent IDs.');
        await e.DB.prepare('INSERT INTO provider_settings(id,encrypted,updated_by,updated_at) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET encrypted=excluded.encrypted,updated_by=excluded.updated_by,updated_at=excluded.updated_at,tested_at=NULL,test_status=NULL,test_detail=NULL').bind(provider, await encryptSettings(provider, data), u.userId, new Date().toISOString()).run();
        return Response.json({ ok: true, hasKey: true }, { headers: { 'Cache-Control': 'no-store' } });
    }
    catch (e: any) {
        if (e.message === 'FORBIDDEN')
            return Response.json({ error: 'Only the project administrator can manage API keys.' }, { status: 403 });
        return aiError(e);
    }
}
