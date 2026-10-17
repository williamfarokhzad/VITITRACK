'use client';
import { useEffect, useState, useRef } from 'react';
import { MessageCircle, Send, Stethoscope, Sparkles, BookOpen, RefreshCw, Check, LogIn } from 'lucide-react';
import { LanguageSwitch, useLocale } from './locale';
async function api(path: string, data?: any) { const r = await fetch('/api/' + path, { method: data ? 'POST' : 'GET', headers: data ? { 'Content-Type': 'application/json' } : undefined, body: data ? JSON.stringify(data) : undefined }); const d = await r.json() as any; if (!r.ok)
    throw new Error(d.error || 'Request failed.'); return d; }
export function DemoAccess({ onLogin }: {
    onLogin: (role: string) => void;
}) { const { l } = useLocale(), [username, setUser] = useState(''), [password, setPassword] = useState(''), [error, setError] = useState(''); return <section className="card demo-access"><span className="pill lavender">{l('DEMO ACCESS', 'ACCESSO DEMO')}</span><h2>{l('Try both sides of care.', 'Prova entrambi i punti di vista.')}</h2><p>{l('Use Doctor / Doctor or Patient / Patient. These shared logins open fictional demonstration profiles only.', 'Usa Doctor / Doctor oppure Patient / Patient. Questi accessi condivisi aprono solo profili dimostrativi fittizi.')}</p><form onSubmit={e => { e.preventDefault(); if ((username === 'Doctor' && password === 'Doctor') || (username === 'Patient' && password === 'Patient')) {
    onLogin(username.toLowerCase());
    setError('');
    setPassword('');
}
else
    setError(l('Check the demo username and password.', 'Controlla nome utente e password demo.')); }}><label>{l('Username', 'Nome utente')}<input autoComplete="off" value={username} onChange={e => setUser(e.target.value)}/></label><label>Password<input type="password" autoComplete="off" value={password} onChange={e => setPassword(e.target.value)}/></label><button className="primary"><LogIn size={16}/>{l('Open demo', 'Apri demo')}</button>{error && <p role="alert">{error}</p>}</form></section>; }
export function ServiceSettings({ status }: {
    status: any;
}) { const { l } = useLocale(); return <section className="card service-settings"><h2>{l('AI services & language', 'Servizi AI e lingua')}</h2><LanguageSwitch />{[['AMD / Gemma', status.amd, 'Fictional demo & visit draft', 'Demo fittizia e bozza visita'], ['Google AI', status.google, 'Photo quality & paper summaries', 'Qualità foto e sintesi articoli'], ['Evolus', status.evolus, 'Knowledge agent & reviewed workflow', 'Agente informativo e workflow approvato']].map(([name, ready, en, it]) => <div className="service-line" key={String(name)}><div><strong>{name}</strong><small>{l(String(en), String(it))}</small></div><span className={'pill ' + (ready ? 'mint' : 'peach')}>{ready ? l('Configured', 'Configurato') : l('Setup needed', 'Da configurare')}</span></div>)}<p className="muted">{l('Configuration is not a connectivity test. Keys stay on the server. Shared demo logins never grant access to real medical records.', 'La configurazione non è un test di connessione. Le chiavi restano sul server. Gli accessi demo non danno accesso a cartelle reali.')}</p></section>; }
export function DoctorHome({ demo, patients, onSelect, onNavigate }: {
    demo: boolean;
    patients: any[];
    onSelect: (i: number) => void;
    onNavigate: (s: string) => void;
}) { const { l } = useLocale(); const people = demo ? [{ profile: { name: 'Giulia Rossi' }, records: Array(6).fill({}) }, { profile: { name: 'Daniel Okafor' }, records: Array(6).fill({}) }, { profile: { name: 'Anaya Shah' }, records: Array(6).fill({}) }] : patients; return <div className="doctor-home"><div className="doctor-hero"><span className="pill lavender"><Stethoscope size={14}/>{l('DOCTOR WORKSPACE', 'SPAZIO MEDICO')}</span><h1>{l('A clearer view of each journey.', 'Una visione più chiara di ogni percorso.')}</h1><p>{l('Review photos, read patient notes and prepare the next conversation. Clinical decisions stay with you.', 'Rivedi le foto, leggi le note e prepara il prossimo colloquio. Le decisioni cliniche restano tue.')}</p></div><div className="stats-grid"><div className="card"><small>{l('Shared profiles', 'Profili condivisi')}</small><h2>{people.length}</h2></div><div className="card"><small>{l('Records to explore', 'Registrazioni da esplorare')}</small><h2>{people.reduce((n, p) => n + p.records.length, 0)}</h2></div></div><section className="card"><h2>{l('Your patient list', 'I tuoi pazienti')}</h2>{demo && <p className="muted">{l('Fictional profiles and sample counts. No clinical outcomes.', 'Profili fittizi e conteggi di esempio. Nessun risultato clinico.')}</p>}{people.map((p, i) => <button key={p.owner || i} className="doctor-patient" onClick={() => { onSelect(i); onNavigate('timeline'); }}><span className="avatar">{p.profile?.name?.split(' ').map((x: string) => x[0]).join('') || 'VT'}</span><span><strong>{p.profile?.name || l('Patient', 'Paziente')}</strong><small>{p.records.length} {l('diary entries', 'registrazioni')}</small></span><span>→</span></button>)}{!people.length && <p>{l('Patients will appear after they grant access to your enabled email address.', 'I pazienti compariranno dopo aver autorizzato il tuo indirizzo email abilitato.')}</p>}</section><div className="workspace-actions"><button className="primary" onClick={() => onNavigate('chat')}><MessageCircle size={18}/>{l('Open messages', 'Apri messaggi')}</button><button className="outline" onClick={() => onNavigate('research')}><BookOpen size={18}/>{l('Explore research', 'Esplora la ricerca')}</button></div></div>; }
export function ChatWorkspace({ signedIn, demo, role, owner, initialProvider = 'google', initialQuestion = '', initialTab='ai' }: {
    signedIn: boolean;
    demo: boolean;
    role: string;
    owner?: string;
    initialProvider?: string;
    initialQuestion?: string;
initialTab?: 'ai'|'human';
}) {
    const { l, locale, t } = useLocale(), [tab, setTab] = useState(initialTab), [provider, setProvider] = useState(initialProvider), [text, setText] = useState(initialQuestion), [messages, setMessages] = useState<any[]>([]), [human, setHuman] = useState<any[]>([]), [pending, setPending] = useState(false), [error, setError] = useState(''), [consent, setConsent] = useState(false);
    const end = useRef<HTMLDivElement>(null), target = owner ? '?owner=' + encodeURIComponent(owner) : '';
    useEffect(() => { end.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [messages, human, pending]);
    useEffect(() => { setMessages([]); setHuman([]); setError(''); }, [owner, demo, role]);
    async function refresh() { setError(''); if (role === 'doctor' && !demo && !owner) {
        setError(l('Select a patient first.', 'Seleziona prima un paziente.'));
        return;
    } if (demo) {
        setHuman(JSON.parse(sessionStorage.getItem('vt-demo-messages') || '[]'));
        return;
    } try {
        setHuman((await api('messages' + target)).messages);
    }
    catch (e: any) {
        setError(t(e.message));
    } }
    useEffect(() => { if (tab !== 'human')
        return; refresh(); if (demo)
        return; const t = setInterval(() => { if (document.visibilityState === 'visible')
        refresh(); }, 12000); return () => clearInterval(t); }, [tab, owner, demo]);
    async function send(e: React.FormEvent) { e.preventDefault(); if (!text.trim() || pending)
        return; setPending(true); setError(''); const draft = text.trim(); try {
        if (tab === 'human') {
            if (role === 'doctor' && !demo && !owner)
                throw new Error(l('Select a patient first.', 'Seleziona prima un paziente.'));
            if (demo) {
                const rows = [...JSON.parse(sessionStorage.getItem('vt-demo-messages') || '[]'), { id: Date.now().toString(36) + Math.random().toString(36).slice(2), sender: role === 'doctor' ? 'doctor' : 'patient', body: draft, created: new Date().toISOString() }];
                sessionStorage.setItem('vt-demo-messages', JSON.stringify(rows.slice(-100)));
                setHuman(rows);
            }
            else {
                await api('messages' + target, { text: draft });
                await refresh();
            }
            setText('');
        }
        else {
            const history = [...(provider === 'amd' ? [] : messages), { role: 'user', content: draft }];
            const d = await api('assistant', { provider, demo, messages: history.map(({ role, content }) => ({ role, content })), language: locale, consent });
            setMessages([...history, { role: 'assistant', content: d.text, provider: d.provider, model: d.model }]);
            setText('');
        }
    }
    catch (e: any) {
        setError(t(e.message));
    }
    finally {
        setPending(false);
    } }
    return <div className="chat-workspace"><div className="page-heading"><div><p className="eyebrow">{l('A LITTLE SUPPORT, WHEN YOU NEED IT', 'UN AIUTO, QUANDO SERVE')}</p><h1>{l('Let’s talk.', 'Parliamone.')}</h1><p>{l('Your AI assistant and private care conversation, in one place.', 'Il tuo assistente AI e il colloquio privato di cura, in un unico posto.')}</p></div></div><div className="segmented chat-tabs"><button className={tab === 'ai' ? 'selected' : ''} onClick={() => { setTab('ai'); setError(''); }}><Sparkles size={16}/>{l('AI assistant', 'Assistente AI')}</button><button className={tab === 'human' ? 'selected' : ''} onClick={() => { setTab('human'); setError(''); }}><Stethoscope size={16}/>{l('Care messages', 'Messaggi di cura')}</button></div><section className="card chat-card"><div className="chat-toolbar">{tab === 'ai' ? <><label>{l('Service', 'Servizio')}<select value={provider} onChange={e => { setProvider(e.target.value); setMessages([]); setConsent(false); setError(''); }}><option value="amd" disabled={!demo}>AMD · Gemma (demo)</option><option value="google">Google AI · Flash-Lite</option><option value="evolus">Evolus · Knowledge agent</option></select></label><span className="pill mint">{l('AI, not clinical staff', 'AI, non personale clinico')}</span></> : <><div className="care-chat-person"><span className="role-avatar"><img src="/profiles/demo-doctor.webp" alt={l('Illustrative doctor avatar','Avatar illustrativo del medico')}/></span><div><strong>{l('Care conversation','Conversazione di cura')}</strong><small>{l('Illustrative profile · replies depend on availability','Profilo illustrativo · risposte secondo disponibilità')}</small></div></div><span className="pill lavender">{demo ? l('Same-browser demo', 'Demo nello stesso browser') : l('Private shared conversation', 'Conversazione privata condivisa')}</span><button className="text-button" onClick={refresh}><RefreshCw size={15}/>{l('Refresh', 'Aggiorna')}</button></>}</div><div className="chat-messages" aria-live="polite">{(tab === 'ai' ? messages : human).length === 0 && <div className="chat-welcome"><span className="icon-tile mint"><MessageCircle size={28}/></span><h2>{tab === 'ai' ? l('What would help you today?', 'Cosa ti sarebbe utile oggi?') : l('Keep the conversation together.', 'Tieni insieme la conversazione.')}</h2><p>{tab === 'ai' ? l('Ask about taking consistent photos, keeping notes or preparing for your next visit.', 'Chiedi come scattare foto confrontabili, annotare le osservazioni o preparare la visita.') : demo ? l('Send a test message, then switch between the Patient and Doctor demo. Messages stay in this browser session. No real doctor is contacted.', 'Invia un messaggio di prova, poi passa tra le demo Patient e Doctor. I messaggi restano in questa sessione del browser. Nessun medico reale viene contattato.') : l('Messages are visible only to the patient and the currently authorised, enabled doctor. Replies depend on the doctor’s availability. This is not an emergency service.', 'I messaggi sono visibili solo al paziente e al medico attualmente autorizzato e abilitato. Le risposte dipendono dalla disponibilità del medico. Non è un servizio di emergenza.')}</p>{tab === 'ai' && <div className="chat-prompts">{[["How can I take more consistent photos?", "Come posso scattare foto più confrontabili?"], ["Help me prepare questions for my dermatologist.", "Aiutami a preparare le domande per il dermatologo."]].map(([en, it]) => <button key={en} className="outline" onClick={() => setText(l(en, it))}>{l(en, it)}</button>)}</div>}</div>}{(tab === 'ai' ? messages : human).map((m, i) => <div key={m.id || i} className={'chat-bubble ' + ((tab === 'ai' ? m.role === 'user' : m.sender === (role === 'doctor' ? 'doctor' : 'patient')) ? 'mine' : 'theirs')}><small>{tab === 'ai' ? (m.role === 'assistant' ? m.provider : l('You', 'Tu')) : m.sender === 'doctor' ? l('Doctor', 'Medico') : l('Patient', 'Paziente')}</small><p>{m.content || m.body}</p>{m.model && <small>{m.model}</small>}{m.created && <small>{new Date(m.created).toLocaleString(locale === 'it' ? 'it-IT' : 'en-GB')}</small>}</div>)}{pending && <p role="status">{l('Working on it…', 'Un momento…')}</p>}<div ref={end}/></div>{tab === 'ai' && <label className="check-row"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/>{l('I agree to send this conversation to the selected AI provider. I will leave out identifying details.', 'Acconsento a inviare questa conversazione al servizio AI scelto. Eviterò dati identificativi.')}</label>}{!signedIn && (tab === 'ai' || !demo) && <a className="outline" href="/signin-with-chatgpt?return_to=%2F%3Flive%3D1" target="_top">{l('Sign in for online services', 'Accedi per i servizi online')}</a>}{tab === 'ai' && provider === 'amd' && messages.length > 0 && <div className="chat-prompts"><button className="outline" onClick={() => setText(l('How can I take more consistent photos?', 'Come posso scattare foto più confrontabili?'))}>{l('Photo tips', 'Consigli foto')}</button><button className="outline" onClick={() => setText(l('Help me prepare questions for my dermatologist.', 'Aiutami a preparare le domande per il dermatologo.'))}>{l('Visit questions', 'Domande per la visita')}</button></div>}{tab === 'ai' && provider === 'amd' && <p className="muted">{l('Token Factory demo: choose one of the sample questions above. No personal health data is sent to AMD.', 'Demo Token Factory: scegli una delle domande di esempio sopra. Nessun dato sanitario personale viene inviato ad AMD.')}</p>}<form className="chat-compose" onSubmit={send}><textarea maxLength={tab === 'ai' ? 3000 : 2000} rows={2} value={text} onChange={e => setText(e.target.value)} placeholder={l('Write a message…', 'Scrivi un messaggio…')}/><button className="primary" aria-label={l('Send message', 'Invia messaggio')} disabled={pending || !text.trim() || (tab === 'ai' && (!consent || !signedIn)) || (tab === 'human' && !demo && !signedIn)}><Send size={19}/></button></form>{error && <p className="workspace-error" role="alert">{error}</p>}</section></div>;
}
export function PhotoReview({ blob }: {
    blob: Blob | null;
}) { const { l, locale, t } = useLocale(), [consent, setConsent] = useState(false), [busy, setBusy] = useState(false), [text, setText] = useState(''), [error, setError] = useState(''); useEffect(() => { setText(''); setError(''); setConsent(false); }, [blob]); return <section className="photo-ai-review"><h3>Google AI · {l('Photo quality', 'Qualità della foto')}</h3><p>{l('Get feedback on light, focus and framing. The photo stays separate from the geometric measurements.', 'Ricevi indicazioni su luce, messa a fuoco e inquadratura. La foto resta separata dalle misure geometriche.')}</p><label className="check-row"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/>{l('Send a resized copy of this photo to Google AI for a quality review.', 'Invia una copia ridimensionata di questa foto a Google AI per il controllo qualità.')}</label><button className="outline" disabled={!blob || !consent || busy} onClick={async () => { setBusy(true); setText(''); setError(''); try {
    const bitmap = await createImageBitmap(blob!), canvas = document.createElement('canvas'), ratio = Math.min(1, 768 / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.round(bitmap.width * ratio);
    canvas.height = Math.round(bitmap.height * ratio);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const image = canvas.toDataURL('image/jpeg', .8).split(',')[1], d = await api('image-review', { image, consent, language: locale });
    setText(d.text);
}
catch (e: any) {
    setError(t(e.message));
}
finally {
    setBusy(false);
} }}>{busy ? l('Reviewing…', 'Controllo…') : l('Review photo quality', 'Controlla la qualità')}</button>{text && <p className="ai-response">{text}</p>}{error && <p className="workspace-error" role="alert">{error}</p>}</section>; }
export function ResearchFeed() { const { l, locale, t } = useLocale(), [articles, setArticles] = useState<any[]>([]), [date, setDate] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false), [summary, setSummary] = useState<any>({}), [selected, setSelected] = useState(''), [query, setQuery] = useState(''); async function refresh() { setBusy(true); setError(''); try {
    const d = await api('papers');
    setArticles(d.articles);
    setDate(d.retrievedAt);
}
catch (e: any) {
    setError(t(e.message));
}
finally {
    setBusy(false);
} } useEffect(() => { refresh(); }, []); return <section className="research-feed"><div className="section-title"><div><span className="pill mint">Europe PMC</span><h2>{l('Recent vitiligo research', 'Ricerche recenti sulla vitiligine')}</h2></div><button className="outline" disabled={busy} onClick={refresh}><RefreshCw size={16}/>{l('Refresh', 'Aggiorna')}</button></div><p className="muted">{l('Sorted by publication date. Results may include reviews and preprints; publication is not a treatment recommendation. Source titles stay in their original language.', 'Ordinati per data di pubblicazione. I risultati possono includere revisioni e preprint; una pubblicazione non è una raccomandazione terapeutica. I titoli restano nella lingua originale.')}{date && <> {l('Retrieved: ', 'Recuperati: ')}{new Date(date).toLocaleString(locale === 'it' ? 'it-IT' : 'en-GB')} · {l('Cache: up to 1 hour', 'Cache: fino a 1 ora')}</>}</p><input aria-label={l('Search research results', 'Cerca nei risultati')} placeholder={l('Search titles…', 'Cerca nei titoli…')} value={query} onChange={e => setQuery(e.target.value)}/>{error && <p className="workspace-error" role="alert">{error} <a href="https://pubmed.ncbi.nlm.nih.gov/?term=vitiligo&sort=date" target="_blank" rel="noreferrer">PubMed ↗</a></p>}{busy && !articles.length && <p role="status">{l('Finding recent papers…', 'Ricerca degli articoli recenti…')}</p>}<div className="research-results">{articles.filter(p => p.title.toLowerCase().includes(query.toLowerCase())).map(p => <article className="card paper-live" key={p.source + p.id}><small>{p.date} · {p.journal || p.source}</small><h3><a href={p.url} target="_blank" rel="noreferrer">{p.title} ↗</a></h3><p className="muted">{p.authors}</p>{p.retracted ? <strong>{l('Retracted publication', 'Pubblicazione ritirata')}</strong> : <button className="text-button" disabled={!p.hasAbstract || selected !== ''} onClick={async () => { setSelected(p.id); try {
    const d = await api('paper-summary', { id: p.id, source: p.source, language: locale });
    setSummary((x: any) => ({ ...x, [p.source + p.id]: d.text }));
}
catch (e: any) {
    setSummary((x: any) => ({ ...x, [p.source + p.id]: t(e.message) }));
}
finally {
    setSelected('');
} }}>{selected === p.id ? l('Summarising…', 'Sintesi…') : l('Summarise abstract with Google AI', 'Sintetizza l’abstract con Google AI')}</button>}{summary[p.source + p.id] && <div className="ai-response"><small>{l('Abstract only · AI text, check the source', 'Solo abstract · testo AI, verifica la fonte')}</small><p>{summary[p.source + p.id]}</p></div>}</article>)}</div></section>; }
