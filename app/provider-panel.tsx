'use client';
import { useEffect, useState } from 'react';
import { KeyRound, Play, Save, ShieldCheck, RefreshCw } from 'lucide-react';
import { useLocale } from './locale';
const fields: Record<string, string[]> = { amd: ['AMD_API_KEY', 'AMD_BASE_URL', 'AMD_MODEL'], google: ['GOOGLE_AI_API_KEY', 'GOOGLE_AI_MODEL'], evolus: ['EVOLUS_API_KEY', 'EVOLUS_APPLICATION_ID', 'EVOLUS_AGENT_ID', 'EVOLUS_WORKFLOW_ID'] };
const defaults: Record<string, string> = { AMD_BASE_URL: 'https://developer.amd.com.cn/radeon/api/v1', AMD_MODEL: 'Gemma-4-31B-IT', GOOGLE_AI_MODEL: 'gemini-3.5-flash-lite' };
const names: Record<string, string> = { amd: 'AMD / Gemma', google: 'Google AI', evolus: 'Evolus' };
export default function ProviderPanel({ onUpdated }: {
    onUpdated: () => void;
}) {
    const { l, locale, t } = useLocale(), [access, setAccess] = useState<'loading' | 'owner' | 'signin' | 'denied'>('loading'), [provider, setProvider] = useState('amd'), [values, setValues] = useState<Record<string, string>>({ ...defaults }), [saved, setSaved] = useState<any[]>([]), [busy, setBusy] = useState(''), [result, setResult] = useState(''), [failed, setFailed] = useState(false);
    async function refresh() { try {
        const r = await fetch('/api/provider-settings'), d = await r.json() as any;
        if (r.status === 401) {
            setAccess('signin');
            return;
        }
        if (!r.ok) {
            setAccess('denied');
            return;
        }
        setSaved(d.providers);
        setValues(x => { const next = { ...x }; for (const p of d.providers)
            Object.assign(next, p.fields); for (const key of Object.values(fields).flat().filter(x => x.endsWith('_API_KEY')))
            next[key] = ''; return next; });
        setAccess('owner');
    }
    catch {
        setAccess('denied');
    } }
    useEffect(() => { refresh(); }, []);
    async function act(action: string) { setBusy(action); setResult(''); setFailed(false); try {
        if (action === 'save' && window.location.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(window.location.hostname))
            throw new Error(l('Enter API keys only on the HTTPS hosted app.', 'Inserisci le chiavi API solo nell’app pubblicata in HTTPS.'));
        const r = await fetch('/api/provider-settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, provider, language: locale, ...(action === 'save' ? { fields: Object.fromEntries(fields[provider].map(k => [k, values[k] || ''])) } : {}) }) }), d = await r.json() as any;
        if (!r.ok)
            throw new Error(d.error || l('Request failed.', 'Richiesta non riuscita.'));
        setResult(action === 'save' ? l('Saved securely. The key is hidden and will not be returned.', 'Salvato in modo sicuro. La chiave è nascosta e non viene restituita.') : l('Connection successful', 'Connessione riuscita') + ' · ' + d.provider + ' · ' + d.model + ' · ' + (d.elapsedMs / 1000).toFixed(1) + 's');
        if (action === 'save')
            setValues(x => ({ ...x, [fields[provider][0]]: '' }));
        await refresh();
        onUpdated();
    }
    catch (e: any) {
        setFailed(true);
        setResult(t(e.message));
    }
    finally {
        setBusy('');
    } }
    const current = saved.find(p => p.id === provider);
    return <section className="card provider-panel"><div className="section-title"><div><span className="pill lavender"><KeyRound size={13}/>{l('PROJECT API SETTINGS', 'API DEL PROGETTO')}</span><h2>{l('Connect. Test. Ready.', 'Collega. Verifica. Pronto.')}</h2></div><ShieldCheck size={23}/></div><p>{l('Only the signed-in project administrator can save or test the project keys. Doctor / Doctor opens a demo, with no access to these credentials.', 'Solo l’amministratore del progetto autenticato può salvare o verificare le chiavi. Doctor / Doctor apre una demo senza accesso alle credenziali.')}</p>{access === 'loading' ? <p role="status">{l('Checking access…', 'Verifica accesso…')}</p> : access !== 'owner' ? <div className="provider-locked"><p>{access === 'signin' ? l('Sign in with the project owner account to open this panel.', 'Accedi con l’account del proprietario per aprire il pannello.') : l('Your account is not enabled to manage project API keys.', 'Il tuo account non è abilitato a gestire le chiavi del progetto.')}</p><a className="outline" href="/signin-with-chatgpt?return_to=%2F" target="_top">{l('Sign in as project owner', 'Accedi come proprietario')}</a></div> : <><div className="segmented provider-tabs">{Object.keys(fields).map(id => <button key={id} className={provider === id ? 'selected' : ''} onClick={() => { setValues(x => { const next = { ...x }; for (const key of Object.values(fields).map(a => a[0]))
        next[key] = ''; return next; }); setProvider(id); setResult(''); }}>{names[id]}</button>)}</div><p className="muted">{current?.hasKey ? l('A key is saved. Leave the password field blank to keep it.', 'Una chiave è salvata. Lascia vuoto il campo password per mantenerla.') : l('No key saved yet.', 'Nessuna chiave ancora salvata.')}</p><form onSubmit={e => { e.preventDefault(); act('save'); }} autoComplete="off">{fields[provider].map(key => <label key={key}>{key.replaceAll('_', ' ')}{key === 'EVOLUS_WORKFLOW_ID' && <small> · {l('optional', 'facoltativo')}</small>}<input type={key.endsWith('_API_KEY') ? 'password' : 'text'} autoComplete="off" spellCheck={false} value={values[key] || ''} placeholder={key.endsWith('_API_KEY') ? (current?.hasKey ? '••••••••' : l('Paste key here', 'Incolla qui la chiave')) : defaults[key] || ''} onChange={e => setValues(x => ({ ...x, [key]: e.target.value }))}/></label>)}<div className="button-row"><button className="primary" disabled={!!busy}><Save size={16}/>{busy === 'save' ? l('Saving…', 'Salvataggio…') : l('Save securely', 'Salva in modo sicuro')}</button><button type="button" className="outline" disabled={!!busy || !current?.hasKey} onClick={() => act('test')}><Play size={16}/>{busy === 'test' ? l('Testing…', 'Verifica…') : l('Test saved connection', 'Verifica connessione salvata')}</button></div></form>{current?.tested_at && <p className="muted">{l('Last test: ', 'Ultimo test: ')}{new Date(current.tested_at).toLocaleString(locale === 'it' ? 'it-IT' : 'en-GB')} · {current.test_status === 'success' ? l('Passed', 'Riuscito') : l('Failed', 'Non riuscito')}</p>}<p className="muted">{l('A test sends a short fictional greeting and may use provider quota. Evolus tests the agent connection; it does not execute the workflow.', 'La verifica invia un breve saluto fittizio e può usare la quota del servizio. Per Evolus viene verificato l’agente, senza eseguire il workflow.')}</p></>}{result && <p className={failed ? 'workspace-error' : 'provider-success'} role="status">{result}</p>}</section>;
}
