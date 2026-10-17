import { runtime, user } from './server';
const definitions = { amd: ['AMD_API_KEY', 'AMD_BASE_URL', 'AMD_MODEL'], google: ['GOOGLE_AI_API_KEY', 'GOOGLE_AI_MODEL'], evolus: ['EVOLUS_API_KEY', 'EVOLUS_APPLICATION_ID', 'EVOLUS_AGENT_ID', 'EVOLUS_WORKFLOW_ID'] } as const;
export type Provider = keyof typeof definitions;
export const providers = Object.keys(definitions) as Provider[];
export async function integrationAdmin() { const u = await user(); const allowed = String(runtime().INTEGRATION_ADMIN_EMAILS || '').split(',').map((x: string) => x.trim().toLowerCase()); if (!allowed.includes(u.email.toLowerCase()))
    throw new Error('FORBIDDEN'); return u; }
function bytes(value: string) { return Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)); }
function encode(value: Uint8Array) { return btoa(String.fromCharCode(...value)); }
async function cryptoKey() { const raw = bytes(String(runtime().CREDENTIAL_ENCRYPTION_KEY || '')); if (raw.length !== 32)
    throw new Error('ENCRYPTION'); return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']); }
export async function encryptSettings(provider: string, data: Record<string, string>) { const iv = crypto.getRandomValues(new Uint8Array(12)), cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: new TextEncoder().encode('vititrack:' + provider) }, await cryptoKey(), new TextEncoder().encode(JSON.stringify(data))); return JSON.stringify({ v: 1, iv: encode(iv), cipher: encode(new Uint8Array(cipher)) }); }
export async function decryptSettings(provider: string, value: string) { const data = JSON.parse(value); if (data.v !== 1)
    throw new Error('ENCRYPTION'); const clear = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(data.iv), additionalData: new TextEncoder().encode('vititrack:' + provider) }, await cryptoKey(), bytes(data.cipher)); return JSON.parse(new TextDecoder().decode(clear)) as Record<string, string>; }
export async function providerEnv() { const e = runtime(), merged = { ...e }; const rows = await e.DB.prepare('SELECT id,encrypted FROM provider_settings').all(); for (const r of rows.results) {
    if (!providers.includes(r.id))
        continue;
    Object.assign(merged, await decryptSettings(r.id, r.encrypted));
} return merged; }
export function allowedFields(provider: Provider) { return definitions[provider] as readonly string[]; }
export function safeFields(provider: Provider, e: Record<string, any>) { return Object.fromEntries(definitions[provider].filter(x => !x.endsWith('_API_KEY')).map(x => [x, String(e[x] || '')])); }
export function sameOrigin(req: Request, requireJson = true) { const origin = req.headers.get('origin'); if (origin && origin !== new URL(req.url).origin)
    throw new Error('FORBIDDEN'); if (requireJson && !req.headers.get('content-type')?.startsWith('application/json'))
    throw new Error('FORBIDDEN'); }
