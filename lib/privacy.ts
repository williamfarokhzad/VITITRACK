import { runtime } from './server';
export const POLICY_VERSION = '2026-10-17';
export async function healthConsent(owner: string) { const row = await runtime().DB.prepare('SELECT data FROM privacy_choices WHERE owner=?').bind(owner).first(); if (!row)
    return false; const data = JSON.parse(row.data); return data.health === true && data.version === POLICY_VERSION && data.adult === true; }
export async function requireHealthConsent(owner: string) { if (!await healthConsent(owner))
    throw new Error('CONSENT'); }
