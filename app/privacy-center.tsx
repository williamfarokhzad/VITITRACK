'use client';
import { useEffect, useState } from 'react';
import { ShieldCheck, Download, Trash2, Check } from 'lucide-react';
import { useLocale } from './locale';
export default function PrivacyCenter({ demo, signedIn, onNavigate, onDeleted }: {
    demo: boolean;
    signedIn: boolean;
    onNavigate: (s: string) => void;
    onDeleted: () => void;
}) {
    const { l, locale, t } = useLocale(), [health, setHealth] = useState(false), [adult, setAdult] = useState(false), [version, setVersion] = useState('2026-10-17'), [busy, setBusy] = useState(''), [notice, setNotice] = useState(''), [error, setError] = useState(false), [confirm, setConfirm] = useState('');
    useEffect(() => { if (!signedIn || demo)
        return; fetch('/api/privacy').then(r => r.json()).then((d: any) => { setHealth(!!d.consented); setAdult(!!d.choices?.adult); if (d.version)
        setVersion(d.version); }).catch(() => { }); }, [signedIn, demo]);
    async function action(method: 'POST' | 'DELETE') { setBusy(method); setNotice(''); setError(false); try {
        if (!signedIn || demo)
            throw new Error(l('Open your signed-in personal record to manage saved data.', 'Apri la tua cartella personale autenticata per gestire i dati salvati.'));
        const r = await fetch('/api/privacy', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(method === 'POST' ? { health, adult, version, language: locale } : { confirm }) }), d = await r.json() as any;
        if (!r.ok)
            throw new Error(d.error || 'Request failed');
        setNotice(method === 'DELETE' ? l('Your stored record, photos, sharing and care messages were deleted.', 'Cartella salvata, foto, condivisioni e messaggi di cura sono stati eliminati.') : health ? l('Your explicit consent has been recorded.', 'Il consenso esplicito è stato registrato.') : l('Consent withdrawn. Doctor sharing was revoked; new health-data storage is blocked. You can still export or delete your existing data.', 'Consenso ritirato. La condivisione con il medico è revocata e i nuovi salvataggi sanitari sono bloccati. Puoi ancora esportare o eliminare i dati esistenti.'));
        if (method === 'DELETE') {
            setHealth(false);
            setAdult(false);
            setConfirm('');
            onDeleted();
        }
    }
    catch (e: any) {
        setError(true);
        setNotice(t(e.message));
    }
    finally {
        setBusy('');
    } }
    return <section className="card privacy-center" id="privacy-controls"><div className="section-title"><div><span className="pill mint"><ShieldCheck size={13}/>GDPR · {l('DATA CONTROLS', 'CONTROLLO DATI')}</span><h2>{l('Your data. Your choices.', 'I tuoi dati. Le tue scelte.')}</h2></div></div><div className="legal-links"><button onClick={() => onNavigate('privacy')}>{l('Privacy Policy', 'Informativa privacy')} ↗</button><button onClick={() => onNavigate('terms')}>{l('Terms of Use', 'Condizioni d’uso')} ↗</button></div><p>{l('The public demo works without health-data consent. Personal storage is optional. For this prototype, use non-identifying test material.', 'La demo pubblica funziona senza consenso sanitario. Il salvataggio personale è facoltativo. Per questo prototipo usa materiale di prova non identificativo.')}</p><label className="check-row"><input type="checkbox" checked={adult} onChange={e => setAdult(e.target.checked)}/>{l('I am 18 or older and have read the current Privacy Policy.', 'Ho almeno 18 anni e ho letto l’informativa privacy attuale.')}</label><label className="check-row"><input type="checkbox" checked={health} onChange={e => setHealth(e.target.checked)}/>{l('I explicitly consent to VitiTrack storing my health-related diary, photos, annotations and care messages for the purposes explained in the Privacy Policy. I can withdraw this consent here at any time.', 'Acconsento esplicitamente al salvataggio da parte di VitiTrack del diario sanitario, delle foto, annotazioni e messaggi di cura per le finalità descritte nell’informativa. Posso ritirare questo consenso qui in qualsiasi momento.')}</label><button className="primary" disabled={!!busy || (health && !adult) || demo || !signedIn} onClick={() => action('POST')}><Check size={16}/>{l('Save my choices', 'Salva le mie scelte')}</button>{demo && <p className="muted">{l('Demo controls only. Switch to your personal record above to record consent.', 'Solo controlli dimostrativi. Passa alla tua cartella personale sopra per registrare il consenso.')}</p>}<div className="privacy-export"><h3>{l('Access and export', 'Accesso ed esportazione')}</h3><p>{l('Download your profile, diary, sharing, messages and consent as JSON. The export includes protected links to download your photos separately.', 'Scarica profilo, diario, condivisioni, messaggi e consenso in JSON. L’esportazione include link protetti per scaricare separatamente le foto.')}</p>{signedIn && !demo ? <a className="outline" href="/api/privacy?export=1" download><Download size={16}/>{l('Export my data', 'Esporta i miei dati')}</a> : <button className="outline" disabled><Download size={16}/>{l('Sign in to export saved data', 'Accedi per esportare i dati salvati')}</button>}</div><details className="privacy-erasure"><summary><Trash2 size={16}/>{l('Delete my saved data', 'Elimina i miei dati salvati')}</summary><p>{l('This permanently deletes your record, stored photos, care messages and sharing grants from the app. It does not delete your ChatGPT account or copies already downloaded by others. Hosting backups and provider logs follow their own retention rules.', 'Elimina definitivamente cartella, foto salvate, messaggi e autorizzazioni dall’app. Non elimina l’account ChatGPT né copie già scaricate da altri. Backup dell’hosting e log dei servizi seguono le rispettive regole di conservazione.')}</p><label>{l('Type DELETE to confirm', 'Scrivi DELETE per confermare')}<input value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="off"/></label><button className="outline danger" disabled={confirm !== 'DELETE' || !!busy || demo || !signedIn} onClick={() => action('DELETE')}>{l('Delete my saved data permanently', 'Elimina definitivamente i miei dati')}</button></details><button className="text-button" onClick={() => { sessionStorage.removeItem('vt-demo-messages'); setNotice(l('Demo messages on this device cleared.', 'Messaggi demo su questo dispositivo cancellati.')); setError(false); }}>{l('Clear demo messages on this device', 'Cancella i messaggi demo su questo dispositivo')}</button>{notice && <p role="status" className={error ? 'workspace-error' : 'provider-success'}>{notice}</p>}</section>;
}
