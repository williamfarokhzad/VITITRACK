'use client';
import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Camera, ChartNoAxesCombined, Heart, BookOpen, Users, FileText, Settings, ArrowUpRight, ArrowRight, Plus, Check, ShieldCheck, ChevronRight, Download, X, SlidersHorizontal, Search, Sun, Activity, Hand, Stethoscope, Globe, LogIn, Trash2, Undo2, Sparkles, Info, Menu, Images, ScanFace, ScanLine, Microscope, HeartHandshake, ClipboardCheck, MapPin, Expand } from 'lucide-react';
import { demoCases, type DemoCase } from './demo-cases';
import JourneyStory from './journey-story';
import PocketDiary from './pocket-diary';
import { LocaleProvider, Localized, LanguageSwitch, useLocale } from './locale';
import { ChatWorkspace, PhotoReview, ResearchFeed, DemoAccess, ServiceSettings, DoctorHome } from './ai-workspace';
// @ts-ignore
import { measure, inside } from '../lib/geometry.mjs';
type P = {
    x: number;
    y: number;
};
type RecordEntry = {
    id: string;
    date: string;
    site: string;
    note: string;
    methods: string[];
    metrics: any;
    quality: string;
    caseId?: string;
    photo?: string;
    roi?: P[];
    patches?: P[][];
    scale?: any;
};
const demoRecords: RecordEntry[] = [18.4, 17.1, 16.8, 15.3, 14.2, 12.6].map((v, i) => ({ id: 'demo-' + i, date: `2026-${String(i + 5).padStart(2, '0')}-15`, site: 'Mano destra', note: ['Prima registrazione dimostrativa.', 'Luce naturale e posizione ripetuta.', 'Controllo mensile dimostrativo.', 'Routine registrata.', 'Confronto in attesa di revisione.', 'Nuova registrazione dimostrativa.'][i], methods: ['Fototerapia NB-UVB', 'Terapia topica prescritta'], metrics: { coverage: v, areaCm2: null, patchPixels: v * 240 }, quality: 'Esempio sintetico' }));
const methods = [['Terapia topica prescritta', 'Corticosteroidi o inibitori della calcineurina, se indicati dallo specialista.'], ['Ruxolitinib topico', 'Opzione per pazienti idonei; prescrizione e monitoraggio specialistici.'], ['Fototerapia NB-UVB', 'Trattamento con UVB a banda stretta sotto supervisione medica.'], ['Laser / luce excimer', 'Trattamento mirato di aree selezionate, valutato dal dermatologo.'], ['Terapia sistemica prescritta', 'Solo se indicata e seguita dal medico; non modificare autonomamente.'], ['Procedure chirurgiche', 'Innesti o trapianto cellulare in casi selezionati e stabili.'], ['Fotoprotezione', 'Protezione solare e abbigliamento adatto come supporto alla cura.'], ['Camouflage cosmetico', 'Opzione estetica facoltativa; non misura l’attività della malattia.'], ['Supporto psicologico', 'Sostegno al benessere e alla qualità della vita.'], ['Osservazione / altro', 'Nessuna terapia attiva o percorso da descrivere al proprio medico.']];
const papers = [{ tag: 'CLINICAL RESEARCH', date: '17 AGO 2026', title: 'Ruxolitinib: risultati real-world e qualità di vita', desc: 'Studio multicentrico su 860 pazienti. Leggi disegno, limiti e risultati nella pubblicazione originale.', url: 'https://pubmed.ncbi.nlm.nih.gov/42605165/', type: 'Terapie' }, { tag: 'PATIENT PERSPECTIVES', date: 'MAG 2026', title: 'Il punto di vista dei pazienti dopo 24 settimane', desc: 'Percezione dell’efficacia del trattamento nella vitiligine non segmentale.', url: 'https://pubmed.ncbi.nlm.nih.gov/41491343/', type: 'Qualità di vita' }, { tag: 'DIGITAL ASSESSMENT', date: '04 MAG 2026', title: 'Misurare la depigmentazione con strumenti AI', desc: 'Ricerca sulla segmentazione automatizzata. Questi risultati non validano il nostro prototipo.', url: 'https://pubmed.ncbi.nlm.nih.gov/42081176/', type: 'Imaging' }, { tag: 'PHOTOGRAPHY', date: 'DIC 2020', title: 'Fotografie confrontabili: le raccomandazioni internazionali', desc: 'Indicazioni tecniche per documentare la vitiligine nel tempo.', url: 'https://pubmed.ncbi.nlm.nih.gov/31678332/', type: 'Imaging' }];
const nav = [['home', 'Panoramica', LayoutDashboard], ['capture', 'Nuova foto', Camera], ['timeline', 'Il mio percorso', ChartNoAxesCombined], ['care', 'Diario e cure', HeartHandshake], ['research', 'Ricerca e novità', Microscope], ['gallery', 'Volti e percorsi', Images], ['community', 'Dati condivisi', Users], ['report', 'Report visita', ClipboardCheck], ['chat', 'Chat', HeartHandshake], ['profile', 'La mia cartella', Settings]] as const;
function PersonPhoto({ person, view = 'both', className = '', eager = false }: {
    person: DemoCase;
    view?: 'both' | 'face' | 'hands';
    className?: string;
    eager?: boolean;
}) { return <Localized><div className={'person-photo view-' + view + ' ' + className}><img src={person.image} alt={'Illustrative image: ' + (view === 'face' ? 'volto' : view === 'hands' ? 'mani' : 'volto e mani') + ' del profilo fittizio ' + person.name} loading={eager ? 'eager' : 'lazy'} decoding="async"/></div></Localized>; }
function PersonAvatar({ person, small = false }: {
    person: DemoCase;
    small?: boolean;
}) { return <Localized><span className={'avatar photo-avatar ' + (small ? 'small' : '')}><img src={person.thumb} alt={'Illustrative avatar: ' + person.name}/></span></Localized>; }
function Chart({ records, large = false }: {
    records: RecordEntry[];
    large?: boolean;
}) { const {locale}=useLocale(); const rows = records.filter(r => r.metrics?.coverage != null).sort((a, b) => a.date.localeCompare(b.date)); if (!rows.length)
    return <Localized><div className="empty-chart">Le misure compariranno dopo la prima annotazione.</div></Localized>; const max = Math.max(25, ...rows.map(r => r.metrics.coverage)), points = rows.map((r, i) => `${55 + i / Math.max(1, rows.length - 1) * 570},${185 - r.metrics.coverage / max * 145}`); return <Localized><svg className={'chart ' + (large ? 'large' : '')} viewBox="0 0 680 245" role="img" aria-label="Percentuale sperimentale di area annotata nel tempo"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#65c9b5" stopOpacity=".26"/><stop offset="1" stopColor="#65c9b5" stopOpacity="0"/></linearGradient></defs>{[0, 1, 2, 3].map(i => <g key={i}><line x1="55" x2="635" y1={40 + i * 48} y2={40 + i * 48} stroke="#e8eeeb" strokeDasharray="4 5"/><text x="12" y={44 + i * 48} fill="#8c9c97" fontSize="11">{Math.round(max - i * max / 3)}%</text></g>)}<path d={`M${points.join(' L')} L625 185 L55 185 Z`} fill="url(#fill)"/><polyline points={points.join(' ')} fill="none" stroke="#168f7e" strokeWidth="3" strokeLinejoin="round"/>{rows.map((r, i) => { const [x, y] = points[i].split(','); return <Localized><g key={r.id}><circle cx={x} cy={y} r="5" stroke="#fff" strokeWidth="3" fill="#168f7e"/><text x={x} y="216" textAnchor="middle" fill="#80928b" fontSize="11">{new Date(r.date + 'T12:00:00').toLocaleDateString(locale==='it'?'it-IT':'en-GB', { month: 'short', day: large ? 'numeric' : undefined })}</text></g></Localized>; })}<text x="55" y="240" fill="#8b9c95" fontSize="10">% della regione selezionata · stima sperimentale, non VASI</text></svg></Localized>; }
async function api(path: string, body?: any, method?: string): Promise<any> { const r = await fetch('/api/' + path, { method: method || (body ? 'POST' : 'GET'), headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined }); const d: any = await r.json(); if (!r.ok)
    throw new Error(d.error || 'Operazione non riuscita'); return d; }
function VitiAppContent({ signedIn, displayName }: {
    signedIn: boolean;
    displayName: string;
}) {
    const [page, setPage] = useState('home'), [role, setRole] = useState('patient'), [demo, setDemo] = useState(true), [records, setRecords] = useState<RecordEntry[]>([]), [demoExtra, setDemoExtra] = useState<RecordEntry[]>([]), [profile, setProfile] = useState<any>({ name: displayName, region: 'Italia', diagnosed: false, notes: '' }), [doctor, setDoctor] = useState(false), [patients, setPatients] = useState<any[]>([]), [selectedPatient, setSelectedPatient] = useState(0), [toast, setToast] = useState(''), [busy, setBusy] = useState(false), [report, setReport] = useState(''), [filter, setFilter] = useState('Tutti'), [search, setSearch] = useState(''), [site, setSite] = useState('Mano destra'), [selectedMethods, setSelectedMethods] = useState<string[]>([]), [note, setNote] = useState(''), [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10)), [email, setEmail] = useState(''), [share, setShare] = useState(''), [modal, setModal] = useState(''), [compare, setCompare] = useState(0), [period, setPeriod] = useState('6 mesi'), [integration, setIntegration] = useState<any>({}), [question, setQuestion] = useState(''), [answer, setAnswer] = useState(''), [approved, setApproved] = useState(false), [caseIndex, setCaseIndex] = useState(0), [photoSeed, setPhotoSeed] = useState(''), [lightbox, setLightbox] = useState<DemoCase | null>(null), [showStory, setShowStory] = useState(false);
    const { locale, l, t } = useLocale();
    const [assistantProvider,setAssistantProvider]=useState('google');
const person = demoCases[caseIndex];
    useEffect(() => { api('integrations').then(setIntegration).catch(() => { }); }, []);
    const show = (s: string) => { setToast(t(s)); setTimeout(() => setToast(''), 5500); };
    useEffect(() => { if (signedIn && new URLSearchParams(window.location.search).get('live') === '1')
        setDemo(false); }, [signedIn]);
    useEffect(() => { if (!demo && signedIn) {
        Promise.all([api('profile'), api('records'), api('sharing')]).then(([p, r, s]) => { setProfile(p.profile); setDoctor(p.isDoctor); setRecords(r.records); setShare(s.doctor); if (p.isDoctor)
            api('clinician').then(x => setPatients(x.patients)).catch(e => show(e.message)); }).catch(e => show(e.message));
    } }, [demo, signedIn]);
    const own = demo ? [...demoRecords, ...demoExtra.filter(r => r.caseId === person.id)].sort((a, b) => a.date.localeCompare(b.date)) : records;
    const source = role === 'doctor' && !demo ? (patients[selectedPatient]?.records || []) : own;
    const current = source.filter((r: RecordEntry) => r.site === site).sort((a: RecordEntry, b: RecordEntry) => a.date.localeCompare(b.date));
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - (period === '3 mesi' ? 3 : 6));
    const chartRows = period === 'Tutto' ? current : current.filter((r: RecordEntry) => r.date >= cutoff.toISOString().slice(0, 10));
    const last = current.at(-1), first = current[0];
    const name = demo ? person.name.split(' ')[0] : profile.name?.split(' ')[0] || 'il tuo spazio';
    const change = last && first && last.metrics && first.metrics ? last.metrics.coverage - first.metrics.coverage : null;
    const go = (p: string) => { if(p==='chat'){setAssistantProvider('google');setQuestion('')} setPage(role === 'public' && p === 'home' ? 'community' : p); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const saveRecord = async (e: RecordEntry, blob: Blob) => { setBusy(true); try {
        if (demo) {
            setDemoExtra(x => [...x, { ...e, caseId: person.id, id: 'demo-' + Date.now(), photo: URL.createObjectURL(blob) }]);
            show('Registrazione aggiunta alla sessione demo.');
        }
        else {
            const r = await fetch('/api/photo', { method: 'POST', body: blob });
            const d: any = await r.json();
            if (!r.ok)
                throw new Error(d.error);
            await api('records', { ...e, photo: d.key });
            setRecords((await api('records')).records);
            show('Foto e misure salvate nella tua cartella.');
        }
        go('timeline');
    }
    catch (e: any) {
        show(e.message);
    }
    finally {
        setBusy(false);
    } };
    function reportText() { return [t('WIFA VitiTrack — Riepilogo per visita'), t(demo ? 'DATI SINTETICI DIMOSTRATIVI' : 'Bozza da verificare con il paziente'), l('Area: ', 'Area: ') + t(site), l('Entries: ', 'Registrazioni: ') + current.length, ...current.map((r: RecordEntry) => `${r.date} | ${r.metrics?.coverage != null ? r.metrics.coverage.toFixed(1) + t('% della regione annotata') : t('Senza misura')} | ${t(r.quality)}\n${l('Reported approaches: ', 'Percorsi riferiti: ')}${r.methods.map(t).join(', ') || t('Non specificati')}\n${l('Note: ', 'Nota: ')}${demo ? t(r.note) : r.note || '—'}`), t('Le misure sono sperimentali e non costituiscono diagnosi, VASI o prova di efficacia terapeutica. Comparabilità delle immagini da verificare.'), t('Domande per il medico: Le fotografie sono confrontabili? Quali cambiamenti richiedono valutazione? Quali informazioni registrare prima della prossima visita?')].join('\n\n'); }
    function download() { const b = new Blob([report || reportText()], { type: 'text/plain;charset=utf-8' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'VitiTrack-report.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
    const roleLabel = role === 'doctor' ? 'Area medico' : role === 'public' ? 'Esplora' : 'Spazio paziente';
    return <Localized><div className={"app-shell " + (page === 'home' ? 'pocket-home' : '')}><aside className="sidebar"><a className="brand" href="/" aria-label="VitiTrack home"><span className="brand-mark">v<span>•</span></span><div>VitiTrack<small>by WIFA ROBOTICS</small></div></a><div className="workspace-label">IL TUO SPAZIO, CON CURA</div><nav>{nav.filter(([id]) => (role !== 'public' || ['home', 'research', 'gallery', 'community'].includes(id)) && (role !== 'doctor' || !['capture','care'].includes(id))).map(([id, label, Icon]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => go(id)}><Icon size={19}/>{label}{id === 'capture' && <span className="nav-plus">+</span>}</button>)}</nav><div className="sidebar-bottom"><div className="soft-card"><ShieldCheck size={23}/><strong>La tua storia è tua.</strong><p>Foto private. Condivisione solo con il tuo consenso.</p><button className="text-button" onClick={() => setModal('privacy')}>Come proteggiamo i dati <ArrowUpRight size={14}/></button></div><div className="user">{demo ? <PersonAvatar person={person}/> : <span className="avatar">{(profile.name || 'VT').slice(0, 2).toUpperCase()}</span>}<div><strong>{demo ? person.name : profile.name || 'Il mio profilo'}</strong><small>{demo ? 'Profilo dimostrativo' : 'Cartella personale'}</small></div><Settings size={17} onClick={() => go('profile')}/></div></div></aside><div className="main-wrap"><header className="topbar"><button className="icon-button mobile-menu" aria-label="Menu completo" onClick={() => setModal('menu')}><Menu size={21}/></button><div className="breadcrumb">Il tuo percorso <ChevronRight size={13}/><strong>{roleLabel}</strong></div><div className="top-actions"><LanguageSwitch /><span className="status-dot"/> <span className="prototype">Prototipo di ricerca</span><button className="icon-button" title="Installazione su iPhone" onClick={() => setModal('install')}><Download size={18}/></button>{demo ? <PersonAvatar person={person} small/> : <span className="avatar small">VT</span>}</div></header><div className="modebar"><div className="segmented">{[['patient', 'Paziente'], ['doctor', 'Medico'], ['public', 'Pubblico']].map(([r, l]) => <button key={r} className={role === r ? 'selected' : ''} onClick={() => { setRole(r); setPage(r === 'public' ? 'community' : 'home'); }}>{l}</button>)}</div><button className={'demo-pill ' + (!demo ? 'live' : '')} onClick={() => { if (!demo) {
        setDemo(true);
        setRole('patient');
        setReport('');
    }
    else if (signedIn) {
        setDemo(false);
        setRole('patient');
        setReport('');
    }
    else
        window.location.href = '/signin-with-chatgpt?return_to=%2F%3Flive%3D1'; }}>{demo ? <><span /> Demo · dati sintetici <ArrowRight size={13}/></> : <><ShieldCheck size={13}/> Cartella personale · passa alla demo</>}</button></div><main>
        {role === 'doctor' && !demo && !doctor ? <><div className="page-heading"><div><p className="eyebrow">ACCESSO PROFESSIONALE</p><h1>Uno spazio per i medici.</h1><p>La vista clinica richiede l’abilitazione del professionista e il consenso del paziente.</p></div></div><div className="card empty"><Stethoscope size={40}/><h2>Account medico non abilitato</h2><p>Il prototipo non assegna accessi clinici tramite il selettore di ruolo. Il responsabile deve verificare e abilitare l’email del medico.</p><button className="primary" onClick={() => setDemo(true)}>Esplora la vista medico demo</button></div></> :
            <>
            {page === 'home' && role === 'doctor' && <DoctorHome demo={demo} patients={patients} onSelect={i => { setSelectedPatient(i); if (demo)
                setCaseIndex(i); }} onNavigate={go}/>}
            {page === 'home' && role !== 'doctor' && <><PocketDiary person={person} records={source.map((r:RecordEntry)=>({...r,photo:r.photo?photoUrl(r.photo):undefined}))} demo={demo} onNavigate={go} onImage={() => demo ? setLightbox(person) : go('timeline')} onStory={() => setShowStory(x => !x)}/>{showStory && <JourneyStory />}</>}
            {page === 'capture' && role==='patient' && <><Heading eyebrow="UN MOMENTO PER TE" title="Una nuova registrazione." desc="Luce diffusa, sfondo uniforme, mano distesa. Aggiungi un righello nello stesso piano della pelle."/><div className="capture-layout"><section className="card"><div className="form-grid"><label>Data<input type="date" value={entryDate} max={new Date().toISOString().slice(0, 10)} onChange={e => setEntryDate(e.target.value)}/></label><label>Area<select value={site} onChange={e => setSite(e.target.value)}><option value="Mano destra">Mano destra</option><option value="Mano sinistra">Mano sinistra</option></select></label></div><PhotoEditor seedImage={photoSeed} busy={busy} onSave={(data, blob) => saveRecord({ ...data, id: '', date: entryDate, site, note, methods: selectedMethods }, blob)}/></section><aside><div className="card"><span className="icon-tile peach"><Sun size={22}/></span><h3>Piccoli dettagli, foto migliori.</h3><ol className="steps"><li>Usa luce diffusa, senza flash o filtri.</li><li>Ripeti distanza, orientamento e area inquadrata.</li><li>Evita riflessi, ombre e cosmetici coprenti.</li><li>Per i cm²: includi e calibra un riferimento nello stesso piano.</li></ol><a className="text-button" target="_blank" rel="noreferrer" href="https://pubmed.ncbi.nlm.nih.gov/31678332/">Raccomandazioni fotografiche <ArrowUpRight size={14}/></a></div><div className="card form-side"><h3>Completa il contesto</h3><label>Come è andata?<textarea placeholder="Cambiamenti osservati, dubbi o note per il medico…" value={note} onChange={e => setNote(e.target.value)}/></label><label>Percorsi seguiti</label>{methods.map(([m]) => <label className="check-row" key={m}><input type="checkbox" checked={selectedMethods.includes(m)} onChange={() => setSelectedMethods(x => x.includes(m) ? x.filter(a => a !== m) : [...x, m])}/>{m}</label>)}</div></aside></div></>}
            {page === 'timeline' && <><Heading eyebrow="IL TUO DIARIO VISIVO" title="I cambiamenti, nel tempo." desc="Confronta la stessa regione. Una differenza fotografica non dimostra da sola una risposta al trattamento."/><div className="toolbar"><select aria-label="Area del corpo" value={site} onChange={e => setSite(e.target.value)}><option value="Mano destra">Mano destra</option><option value="Mano sinistra">Mano sinistra</option></select><button className="primary" onClick={() => go('capture')}><Plus size={16}/> Aggiungi</button></div><div className="card"><Chart records={current} large/>{demo && <p className="chart-disclosure">I registri iniziali sono inventati e non hanno fotografie storiche associate. Le foto illustrative sono esempi singoli, non sequenze prima/dopo.</p>}</div>{current.length > 0 && <div className="compare-grid">{[current[Math.min(compare, current.length - 1)], last].map((r: RecordEntry, i) => <section className="card" key={i}><div className="section-title"><h3>{i === 0 ? 'Riferimento' : 'Ultima registrazione'}</h3><span className="pill mint">{r.metrics?.coverage?.toFixed(1) ?? '—'}%</span></div><div className="hand-frame compare">{r.photo ? <img src={photoUrl(r.photo)} alt={'Foto ' + fmt(r.date,locale)}/> : <div className="historical-placeholder"><Camera size={31}/><strong>Registro dimostrativo</strong><span>Nessuna fotografia storica associata</span></div>}</div>{i === 0 ? <select value={Math.min(compare, current.length - 1)} onChange={e => setCompare(Number(e.target.value))}>{current.map((a: RecordEntry, j: number) => <option value={j} key={a.id}>{fmt(a.date,locale)}</option>)}</select> : <p>{fmt(r.date,locale)}</p>}<small>{r.quality} · {r.metrics?.areaCm2 != null ? r.metrics.areaCm2.toFixed(2) + ' cm² stimati' : 'Scala fisica non disponibile'}</small></section>)}</div>}<section className="card"><h2>Tutte le registrazioni</h2>{current.length ? current.map((r: RecordEntry) => <div className="record-row" key={r.id}><div className="record-date"><Camera size={18}/><strong>{fmt(r.date,locale)}</strong></div><div><strong>{r.metrics?.coverage != null ? r.metrics.coverage.toFixed(1) + '%' : 'Solo foto'}</strong><p>{r.note || 'Nessuna nota'}</p></div><span className="pill lavender">{r.quality}</span>{role === 'patient' && <button className="icon-button" aria-label={'Elimina registrazione ' + r.date} onClick={async () => { if (!confirm(t('Eliminare questa registrazione?')))
                return; try {
                if (demo)
                    setDemoExtra(x => x.filter(a => a.id !== r.id));
                else {
                    await api('records?id=' + r.id, undefined, 'DELETE');
                    setRecords((await api('records')).records);
                }
                show(r.id.startsWith('demo-') && !demoExtra.some(x => x.id === r.id) ? 'Gli esempi iniziali restano disponibili nella demo.' : 'Registrazione eliminata.');
            }
            catch (e: any) {
                show(e.message);
            } }}><Trash2 size={16}/></button>}</div>) : <p className="muted">Nessuna registrazione per questa mano.</p>}</section></>}
            {page === 'care' && role==='patient' && <><Heading eyebrow="IL CONTESTO CONTA" title="Il tuo diario di cura." desc="Registra ciò che hai seguito. Le opzioni sono categorie informative, non una prescrizione né una classifica di efficacia."/><div className="notice"><Info size={19}/><span>Farmaci, fototerapia e procedure richiedono valutazione specialistica. Non modificare il percorso sulla base dei grafici.</span></div><div className="method-grid">{methods.map(([m, d], i) => <button className={'card method ' + (selectedMethods.includes(m) ? 'chosen' : '')} key={m} onClick={() => setSelectedMethods(x => x.includes(m) ? x.filter(a => a !== m) : [...x, m])}><span className={'number ' + ['mint', 'peach', 'lavender'][i % 3]}>{String(i + 1).padStart(2, '0')}</span><div><h3>{m}</h3><p>{d}</p></div><span className="checkbox">{selectedMethods.includes(m) && <Check size={14}/>}</span></button>)}</div><section className="card diary"><h2>La tua esperienza di oggi</h2><div className="form-grid"><label>Data<input type="date" value={entryDate} onChange={e => setEntryDate(e.target.value)}/></label><label>Area<select value={site} onChange={e => setSite(e.target.value)}><option value="Mano destra">Mano destra</option><option value="Mano sinistra">Mano sinistra</option></select></label></div><textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Cosa vuoi ricordare o chiedere al dermatologo?"/><button className="primary" disabled={busy} onClick={async () => { if (!note.trim() && !selectedMethods.length) {
                show('Aggiungi una nota o un percorso.');
                return;
            } const r: RecordEntry = { id: 'demo-' + Date.now(), date: entryDate, site, note, methods: selectedMethods, caseId: demo ? person.id : undefined, metrics: null, quality: 'Nota del paziente' }; try {
                if (demo)
                    setDemoExtra(x => [...x, r]);
                else {
                    await api('records', r);
                    setRecords((await api('records')).records);
                }
                show('Nota registrata.');
                setNote('');
            }
            catch (e: any) {
                show(e.message);
            } }}>Salva nel diario <Check size={16}/></button><p className="muted">Fonti: <a href="https://www.aad.org/public/diseases/a-z/vitiligo-treatment" target="_blank" rel="noreferrer">American Academy of Dermatology</a> · <a href="https://www.niams.nih.gov/health-topics/vitiligo/diagnosis-treatment-and-steps-to-take" target="_blank" rel="noreferrer">NIAMS</a></p></section></>}
            {page === 'chat' && role !== 'public' && <ChatWorkspace key={role + String(demo) + selectedPatient} signedIn={signedIn} demo={demo} role={role} initialProvider={assistantProvider} initialQuestion={question} owner={role === 'doctor' && !demo ? patients[selectedPatient]?.owner : undefined}/>}
            {page === 'research' && <><ResearchFeed /><Heading eyebrow="RICERCA & SVILUPPO" title="Conoscere apre possibilità." desc="Una selezione di pubblicazioni, con accesso alle fonti originali. Catalogo verificato il 17 ottobre 2026; non è un feed aggiornato automaticamente."/><div className="toolbar"><div className="searchbox"><Search size={18}/><input placeholder="Cerca un argomento…" value={search} onChange={e => setSearch(e.target.value)}/></div><a className="outline" href="https://pubmed.ncbi.nlm.nih.gov/?term=vitiligo&sort=date" target="_blank" rel="noreferrer">Ultime su PubMed <ArrowUpRight size={16}/></a></div><div className="filters">{['Tutti', 'Terapie', 'Imaging', 'Qualità di vita'].map(x => <button key={x} className={filter === x ? 'selected' : ''} onClick={() => setFilter(x)}>{x}</button>)}</div><div className="article-grid research">{papers.filter(p => (filter === 'Tutti' || p.type === filter) && (p.title + ' ' + p.desc).toLowerCase().includes(search.toLowerCase())).map((p, i) => <Paper key={p.url} p={p} i={i}/>)}</div><section className="card educational-agent"><span className="pill lavender">EVOLUS · KNOWLEDGE LIBRARY</span><h2>Una domanda da portare al medico?</h2><p>L’agente consulta la biblioteca configurata in Evolus. Non inserire dati identificativi o foto. Verifica sempre le fonti originali.</p><textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ad esempio: come rendere le fotografie più confrontabili?"/><button className="primary" disabled={busy || !question.trim()} onClick={() => {setAssistantProvider('evolus');setPage('chat');}}>Consulta la biblioteca <BookOpen size={16}/></button><span className="pill peach">{integration.evolus ? 'Configurazione presente · fonti da verificare' : 'Evolus da collegare'}</span>{answer && <div className="agent-answer">{answer}<small>Risposta generata · verifica fonti e contenuto con il medico.</small></div>}</section><div className="card research-note"><BookOpen size={26}/><div><h3>Una pubblicazione non è una prescrizione.</h3><p>Popolazione studiata, regione del corpo, durata e qualità dello studio contano. Porta i tuoi dubbi al dermatologo.</p></div></div></>}
            {page === 'community' && <><Heading eyebrow="IMPARARE, INSIEME" title="Storie diverse. Dati con contesto." desc="Esplora come potrebbe funzionare una vista di ricerca aggregata. Tutti i numeri di questa pagina sono artificiali."/><div className="notice"><ShieldCheck size={19}/><span>DEMO SINTETICA · Nessun dato reale dei pazienti è pubblicato o aggregato. Nessuna classifica dei trattamenti.</span></div><div className="stats-grid"><Stat label="Profili simulati" value="48" sub="Coorte artificiale per la demo" color="mint" icon={<Users size={21}/>}/><Stat label="Osservazione simulata" value="6 mesi" sub="Stessa durata, percorsi differenti" color="peach" icon={<Activity size={21}/>}/><Stat label="Dati reali pubblicati" value="0" sub="Condivisione pubblica disattivata" color="lavender" icon={<ShieldCheck size={21}/>}/></div><section className="card"><div className="section-title"><h2>Andamenti individuali simulati</h2><span className="pill peach">Non confronta l’efficacia</span></div><svg className="chart large" viewBox="0 0 680 245" aria-label="Quattro percorsi inventati, in direzioni diverse">{[0, 1, 2, 3].map(i => <g key={i}><line x1="55" x2="635" y1={35 + i * 50} y2={35 + i * 50} stroke="#e8eeeb"/><text x="12" y={40 + i * 50} fill="#8c9c97" fontSize="11">{30 - i * 10}%</text></g>)}{[[24, 22, 19, 20, 16, 14], [12, 13, 14, 14, 16, 17], [20, 20, 19, 21, 20, 20], [28, 26, 25, 22, 21, 18]].map((a, i) => <polyline key={i} points={a.map((v, j) => `${55 + j * 116},${185 - v * 5}`).join(' ')} stroke={['#168f7e', '#f2997c', '#a68dc9', '#e0bd6e'][i]} strokeWidth="3" fill="none"/>)}{['Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott'].map((m, i) => <text key={m} x={55 + i * 116} y="215" textAnchor="middle" fill="#80928b" fontSize="12">{m}</text>)}</svg><p className="muted">Area chiara nella regione selezionata (%). Traiettorie inventate, senza attribuzione a terapie.</p></section><section className="card"><h2>Percorsi registrati · esempio di coorte</h2><p className="muted">Categorie sovrapposte: una persona può seguire più percorsi. I conteggi non indicano risultati.</p>{[['Fotoprotezione', 36], ['Terapie topiche prescritte', 29], ['Fototerapia', 18], ['Supporto psicologico', 12]].map(([m, n]) => <div className="cohort-row" key={m}><span>{m}</span><div><i style={{ width: Number(n) / 48 * 100 + '%' }}/></div><strong>n={n}</strong></div>)}</section><div className="card"><h3>Come leggere un confronto futuro</h3><p>Età, area del corpo, fototipo, durata, terapie combinate, misure mancanti e qualità delle immagini possono influenzare i risultati. Servono consenso specifico, protezione dei piccoli gruppi e un protocollo di ricerca prima di analizzare dati reali.</p></div></>}
            {page === 'report' && <><Heading eyebrow="PREPARA IL PROSSIMO INCONTRO" title="La tua storia, in un report." desc="Un riepilogo da leggere, correggere e condividere tu stesso con il dermatologo."/><div className="report-layout"><section className="card"><div className="section-title"><h2>Riepilogo visita</h2><span className="pill lavender">Bozza da verificare</span></div><textarea className="report-editor" value={report || reportText()} onChange={e => setReport(e.target.value)}/><div className="button-row"><button className="primary" onClick={download}><Download size={17}/> Scarica .txt</button><button className="outline" onClick={() => window.print()}>Stampa / PDF</button></div></section><aside><section className="card ai-card"><span className="icon-tile lavender"><Sparkles size={23}/></span><h3>Un aiuto a mettere ordine.</h3><p>AMD demo uses fixed fictional records only. Token Factory does not permit sensitive health data.</p><span className={'pill ' + (integration.amd ? 'mint' : 'peach')}>{integration.amd ? 'AMD collegato' : 'AMD da collegare'} · {integration.gemma ? 'Gemma' : 'Gemma da verificare'}</span><button className="primary" disabled={busy} onClick={async () => { if (role === 'doctor' && !demo) {
                show('La generazione automatica è disponibile nella cartella del paziente.');
                return;
            } setBusy(true); try {
                const r = await api('report', { language: locale, demo,  });
                setReport(r.text);
                show(l('Draft generated with ', 'Bozza generata con ') + r.model);
            }
            catch (e: any) {
                show(e.message);
            }
            finally {
                setBusy(false);
            } }}>{busy ? 'Preparazione…' : 'Prepara con AMD'} <Sparkles size={15}/></button><small>Leggi e verifica sempre il risultato.</small></section><section className="card"><h3>Prima di condividere</h3><p>Controlla date, note e terapie. Le stime delle foto non sono valutazioni cliniche.</p></section><section className="card"><span className="pill lavender">EVOLUS · WORKFLOW</span><h3>Prepara la revisione</h3><p>Invia soltanto il testo approvato al workspace Evolus. Nessuna foto o email viene inviata automaticamente.</p><label className="check-row"><input type="checkbox" checked={approved} onChange={e => setApproved(e.target.checked)}/>Approvo il testo e il suo invio a Evolus per preparare la revisione.</label><button className="outline" disabled={!approved || busy} onClick={async () => { if (demo) {
                show('Simulazione: nessun dato inviato a Evolus.');
                return;
            } setBusy(true); try {
                await api('evolus', { action: 'workflow', text: report || reportText(), approved: true, language: locale });
                show('Workflow avviato nel workspace Evolus.');
            }
            catch (e: any) {
                show(e.message);
            }
            finally {
                setBusy(false);
            } }}>Avvia preparazione</button><p className="muted">{integration.workflow ? 'Configurazione presente · esecuzione da verificare' : 'Workflow da collegare'}</p></section></aside></div></>}
            {page === 'profile' && <><Heading eyebrow="LA TUA CARTELLA" title="Uno spazio personale." desc="Informazioni essenziali, condivisione esplicita e controllo sui tuoi dati."/><DemoAccess onLogin={r => { setDemo(true); setRole(r); setPage('home'); setReport(''); }}/><ServiceSettings status={integration}/><div className="content-grid"><section className="card"><div className="profile-heading">{demo ? <PersonAvatar person={person}/> : <span className="avatar big">{(profile.name || 'VT').slice(0, 2)}</span>}<div><h2>{demo ? person.name : profile.name || 'Completa il profilo'}</h2><p>{demo ? 'VT-DEMO-001 · persona inventata' : 'Cartella legata al tuo accesso ChatGPT'}</p></div></div><label>Nome visualizzato<input value={demo ? person.name : profile.name || ''} disabled={demo} onChange={e => setProfile({ ...profile, name: e.target.value })}/></label><label>Paese / regione<input value={demo ? t(person.country) : profile.region || ''} disabled={demo} onChange={e => setProfile({ ...profile, region: e.target.value })}/></label><label className="check-row"><input type="checkbox" checked={demo || profile.diagnosed} disabled={demo} onChange={e => setProfile({ ...profile, diagnosed: e.target.checked })}/>Diagnosi di vitiligine già effettuata da un medico</label><label>Note per la cartella<textarea value={demo ? t('Profilo dimostrativo. Nessun dato reale.') : profile.notes || ''} disabled={demo} onChange={e => setProfile({ ...profile, notes: e.target.value })}/></label><button className="primary" onClick={async () => { if (demo) {
                show('Passa alla cartella personale per salvare il profilo.');
                return;
            } try {
                await api('profile', profile);
                show('Profilo aggiornato.');
            }
            catch (e: any) {
                show(e.message);
            } }}>Salva profilo <Check size={16}/></button></section><aside><section className="card"><span className="icon-tile mint"><Stethoscope size={22}/></span><h3>Il tuo medico, con il tuo consenso.</h3><p>Solo un professionista abilitato dal progetto può ricevere accesso. Puoi revocarlo quando vuoi.</p><label>Email del medico<input type="email" placeholder="nome@ospedale.it" value={email} onChange={e => setEmail(e.target.value)}/></label><button className="outline" onClick={async () => { if (demo) {
                show('Condivisione simulata: nessun invito inviato.');
                return;
            } if (!email.trim()) {
                show('Inserisci l’email del medico.');
                return;
            } try {
                await api('sharing', { email });
                setShare(email);
                show('Accesso autorizzato. Nessuna email è stata inviata.');
            }
            catch (e: any) {
                show(e.message);
            } }}>Autorizza accesso</button>{share && <><p>Autorizzato: {share}</p><button className="text-button" onClick={async () => { try {
                await api('sharing', { email: '' });
                setShare('');
                show('Accesso revocato.');
            }
            catch (e: any) {
                show(e.message);
            } }}>Revoca accesso</button></>}</section><section className="card"><h3>Disponibile anche su iPhone.</h3><p>Apri il sito in Safari e aggiungilo alla schermata Home.</p><button className="text-button" onClick={() => setModal('install')}>Istruzioni <ArrowRight size={15}/></button></section></aside></div></>}
            </>}
    {page === 'gallery' && <PeopleGallery active={caseIndex} onOpen={setLightbox} onProfile={i => { setCaseIndex(i); setDemo(true); setRole('patient'); setReport(''); setCompare(0); setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onAnalyze={i => { setCaseIndex(i); setDemo(true); setRole('patient'); setPhotoSeed(demoCases[i].image); setPage('capture'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}/>}
    <footer><div className="footer-brand">VitiTrack <span>by WIFA Robotics</span></div><span>Prototipo sperimentale · Non è un dispositivo diagnostico</span><button onClick={() => setModal('privacy')}>Privacy e limiti</button></footer></main></div><nav className="mobile-nav">{(role==='doctor'?[['home','Panoramica',LayoutDashboard],['chat','Chat',HeartHandshake],['research','Ricerca',BookOpen],['report','Visita',ClipboardCheck]]:[['home', 'Diario', LayoutDashboard], ['capture', 'Foto', Camera], ['care', 'Note', BookOpen], ['report', 'Visita', ClipboardCheck]]).filter(([id]) => role !== 'public' || ['home', 'research'].includes(id as string)).map(([id, l, Icon]: any) => <button key={id} className={page === id ? 'active' : ''} onClick={() => go(id)}><Icon size={21}/><span>{l}</span></button>)}</nav>{lightbox && <div className="modal-backdrop photo-lightbox" onClick={() => setLightbox(null)}><section className="lightbox-content" role="dialog" aria-modal="true" aria-label={'Foto esempio di ' + lightbox.name} onClick={e => e.stopPropagation()}><div className="lightbox-top"><div><strong>{lightbox.name}</strong><span><MapPin size={13}/>{lightbox.country} · profilo fittizio</span></div><button className="icon-button" aria-label="Chiudi foto" onClick={() => setLightbox(null)}><X size={23}/></button></div><img src={lightbox.image} alt={'Illustrative face and hands: ' + lightbox.name}/><div className="lightbox-footer"><Sparkles size={16}/> Immagine illustrativa · nessun paziente reale · non documenta risultati clinici</div><div className="lightbox-nav"><button onClick={() => { const i = demoCases.findIndex(c => c.id === lightbox.id); setLightbox(demoCases[(i + 9) % 10]); }}>← Precedente</button><span>{demoCases.findIndex(c => c.id === lightbox.id) + 1} / 10</span><button onClick={() => { const i = demoCases.findIndex(c => c.id === lightbox.id); setLightbox(demoCases[(i + 1) % 10]); }}>Successiva →</button></div></section></div>}{toast && <div className="toast" role="status"><Info size={19}/>{toast}<button aria-label="Chiudi notifica" onClick={() => setToast('')}><X size={17}/></button></div>}{modal && <div className="modal-backdrop" onClick={() => setModal('')}><section className="modal" onClick={e => e.stopPropagation()}><button className="modal-close icon-button" aria-label="Chiudi" onClick={() => setModal('')}><X size={20}/></button>{modal === 'menu' ? <><h2>Il tuo spazio</h2><div className="modal-nav">{nav.filter(([id]) => (role !== 'public' || ['home', 'research', 'gallery', 'community'].includes(id)) && (role !== 'doctor' || !['capture','care'].includes(id))).map(([id, label, Icon]) => <button key={id} onClick={() => { go(id); setModal(''); }}><Icon size={20}/>{label}<ChevronRight size={16}/></button>)}</div></> : modal === 'install' ? <><span className="icon-tile mint"><Download size={27}/></span><h2>VitiTrack, sulla tua Home.</h2><p>Nessun account sviluppatore Apple necessario per usare questa web app.</p><ol className="steps"><li>Apri questo indirizzo in Safari su iPhone.</li><li>Tocca Condividi, poi “Aggiungi alla schermata Home”.</li><li>Se disponibile, attiva “Apri come app web” e tocca Aggiungi.</li></ol><p className="muted">Le funzioni online e il salvataggio richiedono connessione. Il prototipo non è distribuito su App Store.</p></> : <><ShieldCheck size={34} color="#148d80"/><h2>Trasparenza, prima di tutto.</h2><p>La demo contiene persone fittizie, fotografie generate con AI e andamenti artificiali. Non rappresenta risultati di uno studio.</p><p>La cartella personale richiede accesso ChatGPT. I file vengono salvati sul server e sono accessibili al proprietario e, solo con consenso, a un medico abilitato. Non vengono pubblicati nella vista aggregata.</p><p>Analisi delle immagini sperimentale: può confondere riflessi e variazioni di luce con aree chiare. Le misure non sono VASI, non diagnosticano vitiligine e non dimostrano l’efficacia di una terapia.</p><p>Prima di usare il sistema con pazienti reali servono revisione clinica, verifica privacy e convalida del processo. Per la demo usa fotografie di prova prive di elementi identificativi.</p></>}</section></div>}</div></Localized>;
}
function Heading({ eyebrow, title, desc }: {
    eyebrow: string;
    title: string;
    desc: string;
}) { return <Localized><div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{desc}</p></div></div></Localized>; }
function Stat({ label, value, sub, icon, color }: any) { return <Localized><section className="card stat"><span className={'icon-tile ' + color}>{icon}</span><div><p>{label}</p><strong>{value}</strong><small>{sub}</small></div></section></Localized>; }
function Paper({ p, i }: any) { return <Localized><a className="card article" href={p.url} target="_blank" rel="noreferrer"><div className={'article-art art-' + i % 3}>{i % 3 === 0 ? <><span className="art-orbit"/><Activity size={46}/></> : i % 3 === 1 ? <><span className="art-circle"/><Heart size={43}/></> : <><span className="art-grid"/><Sparkles size={44}/></>}<span className="paper-arrow"><ArrowUpRight size={19}/></span></div><div className="article-body"><div className="article-kicker">{p.tag}<span>{p.date}</span></div><h3>{p.title}</h3><p>{p.desc}</p><span className="article-source">PubMed · Fonte originale <ArrowUpRight size={13}/></span></div></a></Localized>; }
function photoUrl(p: string) { return p.startsWith('blob:') ? p : '/api/photo?key=' + encodeURIComponent(p); }
function fmt(s: string,locale='en') { return new Date(s + 'T12:00:00').toLocaleDateString(locale==='it'?'it-IT':'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
function PhotoEditor({ busy, onSave, seedImage }: {
    seedImage?: string;
    busy: boolean;
    onSave: (data: any, blob: Blob) => void;
}) {
    const [image, setImage] = useState<HTMLImageElement | null>(null), [blob, setBlob] = useState<Blob | null>(null), [roi, setRoi] = useState<P[]>([]), [patches, setPatches] = useState<P[][]>([]), [draft, setDraft] = useState<P[]>([]), [scale, setScale] = useState<P[]>([]), [cm, setCm] = useState(5), [mode, setMode] = useState('roi'), [threshold, setThreshold] = useState(185), [saturation, setSaturation] = useState(65), [metrics, setMetrics] = useState<any>(null), [quality, setQuality] = useState(''), [checked, setChecked] = useState(false), [consent, setConsent] = useState(false), [error, setError] = useState(''), [overlay, setOverlay] = useState(true), [isAI, setIsAI] = useState(false);
    const ref = useRef<HTMLCanvasElement>(null), input = useRef<HTMLInputElement>(null);
    useEffect(() => { const c = ref.current; if (!c || !image)
        return; c.width = image.width; c.height = image.height; const ctx = c.getContext('2d')!; ctx.drawImage(image, 0, 0); function polygon(p: P[], stroke: string, fill: string) { if (!p.length)
        return; ctx.beginPath(); p.forEach((a, i) => i ? ctx.lineTo(a.x, a.y) : ctx.moveTo(a.x, a.y)); if (p.length > 2)
        ctx.closePath(); ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = Math.max(2, image!.width / 250); ctx.fill(); ctx.stroke(); } ; if (overlay) {
        polygon(roi, '#35d8bd', '#35d8bd12');
        patches.forEach(p => polygon(p, '#a67bea', '#a67bea55'));
        polygon(draft, mode === 'roi' ? '#35d8bd' : '#ffbb92', '#ffffff15');
        draft.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, image.width / 140, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); });
        if (scale.length) {
            ctx.beginPath();
            ctx.moveTo(scale[0].x, scale[0].y);
            if (scale[1])
                ctx.lineTo(scale[1].x, scale[1].y);
            ctx.strokeStyle = '#ffd77c';
            ctx.lineWidth = image.width / 180;
            ctx.stroke();
            scale.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, image.width / 120, 0, Math.PI * 2); ctx.fillStyle = '#ffd77c'; ctx.fill(); });
        }
    } }, [image, roi, patches, draft, scale, mode, overlay]);
    async function load(file: File, ai = false) { setError(''); setIsAI(ai); if (!file.type.startsWith('image/')) {
        setError('Scegli un’immagine JPEG, PNG o HEIC supportata dal browser.');
        return;
    } if (file.size > 20 * 1024 * 1024) {
        setError('L’immagine supera 20 MB. Esporta una copia più piccola.');
        return;
    } const url = URL.createObjectURL(file); const im = new Image(); im.onload = () => { const ratio = Math.min(1, 1000 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * ratio); c.height = Math.round(im.height * ratio); const ctx = c.getContext('2d')!; ctx.drawImage(im, 0, 0, c.width, c.height); c.toBlob(b => { if (!b)
        return; setBlob(b); const converted = new Image(); converted.onload = () => setImage(converted); converted.src = URL.createObjectURL(b); }, 'image/jpeg', .9); const q = document.createElement('canvas'); q.width = 200; q.height = Math.round(c.height / c.width * 200); const qc = q.getContext('2d')!; qc.drawImage(c, 0, 0, q.width, q.height); const pix = qc.getImageData(0, 0, q.width, q.height).data; let sum = 0, variation = 0; for (let j = 4; j < pix.length; j += 4) {
        const v = (pix[j] + pix[j + 1] + pix[j + 2]) / 3;
        sum += v;
        variation += Math.abs(v - (pix[j - 4] + pix[j - 3] + pix[j - 2]) / 3);
    } const mean = sum / (pix.length / 4), detail = variation / (pix.length / 4); setQuality(mean < 55 ? 'Immagine scura: ripeti con luce diffusa' : mean > 230 ? 'Possibile sovraesposizione: verifica i dettagli' : detail < 1.4 ? 'Pochi dettagli: verifica la messa a fuoco' : 'Controllo luce preliminare completato'); setRoi([]); setPatches([]); setDraft([]); setScale([]); setMetrics(null); setChecked(false); setMode('roi'); URL.revokeObjectURL(url); }; im.onerror = () => { setError('Formato non leggibile: usa un JPEG o PNG.'); URL.revokeObjectURL(url); }; im.src = url; }
    useEffect(() => { if (!seedImage)
        return; let cancelled = false; const im = new Image(); im.onload = () => { if (cancelled)
        return; const c = document.createElement('canvas'); c.width = Math.round(im.width / 2); c.height = im.height; c.getContext('2d')!.drawImage(im, Math.floor(im.width / 2), 0, im.width / 2, im.height, 0, 0, c.width, c.height); c.toBlob(b => { if (b && !cancelled)
        load(new File([b], 'AI-demo-hands.jpg', { type: 'image/jpeg' }), true); }, 'image/jpeg', .94); }; im.src = seedImage; return () => { cancelled = true; }; }, [seedImage]);
    function sample() { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = Math.round(im.width / 2); c.height = im.height; c.getContext('2d')!.drawImage(im, Math.floor(im.width / 2), 0, im.width / 2, im.height, 0, 0, c.width, c.height); c.toBlob(b => { if (b)
        load(new File([b], 'AI-demo-hands.jpg', { type: 'image/jpeg' }), true); }, 'image/jpeg', .94); }; im.src = demoCases[0].image; }
    function click(e: React.PointerEvent<HTMLCanvasElement>) { if (!image || !ref.current)
        return; const box = ref.current.getBoundingClientRect(), p = { x: (e.clientX - box.left) / box.width * image.width, y: (e.clientY - box.top) / box.height * image.height }; setMetrics(null); setChecked(false); if (mode === 'scale')
        setScale(x => x.length < 2 ? [...x, p] : [p]);
    else
        setDraft(x => [...x, p]); }
    function finish() { if (draft.length < 3) {
        setError('Seleziona almeno tre punti per chiudere un contorno.');
        return;
    } if (mode === 'roi') {
        setRoi(draft);
        setPatches([]);
        setMode('patch');
    }
    else
        setPatches(x => [...x, draft]); setDraft([]); setMetrics(null); setError(''); setChecked(false); }
    function auto() { if (!image || roi.length < 3) {
        setError('Delimita prima la regione della mano.');
        return;
    } const c = document.createElement('canvas'); c.width = 80; c.height = Math.max(1, Math.round(80 * image.height / image.width)); const ctx = c.getContext('2d')!; ctx.drawImage(image, 0, 0, c.width, c.height); const d = ctx.getImageData(0, 0, c.width, c.height).data; const p: P[][] = []; const dx = image.width / c.width, dy = image.height / c.height; for (let y = 0; y < c.height; y++) {
        let start = -1;
        for (let x = 0; x <= c.width; x++) {
            const j = (y * c.width + x) * 4, max = Math.max(d[j] || 0, d[j + 1] || 0, d[j + 2] || 0), min = Math.min(d[j] || 0, d[j + 1] || 0, d[j + 2] || 0);
            const yes = x < c.width && inside((x + .5) * dx, (y + .5) * dy, roi) && (d[j] + d[j + 1] + d[j + 2]) / 3 >= threshold && (max - min) <= saturation;
            if (yes && start < 0)
                start = x;
            if (!yes && start >= 0) {
                p.push([{ x: start * dx, y: y * dy }, { x: x * dx, y: y * dy }, { x: x * dx, y: (y + 1) * dy }, { x: start * dx, y: (y + 1) * dy }]);
                start = -1;
            }
        }
    } setPatches(p); setMetrics(null); setChecked(false); setError(p.length ? 'Proposta basata solo su luminosità e colore: controlla e correggi riflessi e ombre.' : 'Nessuna area trovata con queste soglie. Regola i cursori o delimita manualmente.'); setMode('patch'); }
    function calculate() { if (!image || roi.length < 3) {
        setError('Delimita la regione prima di misurare.');
        return;
    } if (draft.length) {
        setError('Chiudi o annulla il contorno in corso.');
        return;
    } if (scale.length === 1) {
        setError('Completa il riferimento con due punti o annullalo.');
        return;
    } if (scale.length === 2 && Math.hypot(scale[0].x - scale[1].x, scale[0].y - scale[1].y) < 10) {
        setError('Il riferimento è troppo corto per una scala affidabile.');
        return;
    } setMetrics(measure(roi, patches, image.width, image.height, { points: scale, cm })); setError(''); }
    return <Localized><div className="photo-editor"><input ref={input} type="file" accept="image/*" onChange={e => { if (e.target.files?.[0])
        load(e.target.files[0]); }} hidden/>{!image ? <button className="upload-zone" onClick={() => input.current?.click()}><span className="upload-icon"><Camera size={35}/></span><h3>La tua foto, un nuovo punto di partenza.</h3><p>Scatta una foto o scegli dalla libreria</p><span className="primary">Seleziona immagine <Plus size={17}/></span><small>JPEG o PNG · elaborazione iniziale sul dispositivo</small></button> : <><div className="editor-top">{isAI && <span className="pill lavender"><Sparkles size={12}/> Foto illustrativa</span>}<span className="pill mint">{image.width} × {image.height} px</span><button className="text-button" onClick={() => input.current?.click()}>Cambia foto</button><button className="text-button" onClick={() => setOverlay(!overlay)}>{overlay ? 'Nascondi' : 'Mostra'} contorni</button></div><div className="canvas-wrap"><canvas ref={ref} onPointerDown={click} aria-label="Seleziona punti per delimitare mano, aree chiare o riferimento di scala"/></div><div className="editor-modes">{[['roi', '1 · Regione mano'], ['patch', '2 · Area chiara'], ['scale', '3 · Scala (opzionale)']].map(([id, l]) => <button key={id} className={mode === id ? 'selected' : ''} onClick={() => { setMode(id); setDraft([]); }}>{l}</button>)}</div><p className="hint">{mode === 'scale' ? 'Tocca due estremi di una lunghezza nota nel righello. Il riferimento deve essere sullo stesso piano della pelle.' : 'Tocca più punti attorno al contorno e premi “Chiudi contorno”. Aggiungi più aree chiare separatamente.'}</p><div className="button-row"><button className="outline" disabled={mode === 'scale' || draft.length < 3} onClick={finish}><Check size={15}/> Chiudi contorno</button><button className="outline" onClick={() => { setMetrics(null); setChecked(false); if (mode === 'scale')
        setScale(x => x.slice(0, -1));
    else if (draft.length)
        setDraft(x => x.slice(0, -1));
    else if (mode === 'patch')
        setPatches(x => x.slice(0, -1));
    else
        setRoi([]); }}><Undo2 size={15}/> Annulla</button><button className="text-button" onClick={() => { setPatches([]); setMetrics(null); setChecked(false); }}>Cancella aree chiare</button></div>{mode === 'scale' && <label>Lunghezza di riferimento (cm)<input type="number" min="0.1" max="100" step="0.1" value={cm} onChange={e => { setCm(Math.max(.1, Number(e.target.value))); setMetrics(null); setChecked(false); }}/></label>}<details className="segmentation"><summary><SlidersHorizontal size={17}/> Proposta automatica sperimentale</summary><p>Il filtro identifica pixel chiari poco saturi nella regione selezionata. Non distingue vitiligine, riflessi e altre cause.</p><label>Luminosità minima: {threshold}<input type="range" min="90" max="250" value={threshold} onChange={e => { setThreshold(Number(e.target.value)); setMetrics(null); setChecked(false); }}/></label><label>Differenza colore massima: {saturation}<input type="range" min="5" max="150" value={saturation} onChange={e => { setSaturation(Number(e.target.value)); setMetrics(null); setChecked(false); }}/></label><button className="outline" onClick={auto}>Proponi aree chiare</button></details><div className="quality"><Info size={16}/>{quality}</div><PhotoReview blob={blob}/><button className="primary" onClick={calculate}>Calcola misura sperimentale <ArrowRight size={16}/></button>{metrics && <div className="measurement-result"><div><small>AREA CHIARA / REGIONE</small><strong>{metrics.coverage.toFixed(1)}%</strong></div><div><small>SUPERFICIE STIMATA</small><strong>{metrics.areaCm2 != null ? metrics.areaCm2.toFixed(2) + ' cm²' : 'Senza scala'}</strong></div><p>Area in pixel: {Math.round(metrics.patchPixels)} px² · {metrics.widthCm != null ? `Ingombro complessivo: ${metrics.widthCm.toFixed(2)} × ${metrics.heightCm.toFixed(2)} cm.` : String(patches.length) + ' regioni annotate.'} Confrontabilità clinica non verificata.</p></div>}<label className="check-row"><input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)}/>Ho verificato i contorni e i limiti della stima.</label><label className="check-row"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/>Autorizzo il salvataggio della foto e delle annotazioni nella mia cartella di prova.</label><button className="primary save-photo" disabled={!metrics || !checked || !consent || busy} onClick={() => { if (blob)
        onSave({ metrics, roi, patches, scale: { points: scale, cm }, quality: isAI ? 'Foto esempio · annotazione da verificare' : 'Annotazione utente · da verificare' }, blob); }}>{busy ? 'Salvataggio…' : 'Salva registrazione'} <Check size={16}/></button></>}{!image && <button className="text-button sample-button" onClick={sample}>Prova con una foto della galleria <Sparkles size={14}/></button>}{error && <p className="editor-message" role="status">{error}</p>}<p className="muted editor-note">Non diagnostica la vitiligine. La misura riguarda solo la regione scelta, non l’intera superficie corporea.</p></div></Localized>;
}
function PeopleGallery({ active, onOpen, onProfile, onAnalyze }: {
    active: number;
    onOpen: (p: DemoCase) => void;
    onProfile: (i: number) => void;
    onAnalyze: (i: number) => void;
}) { const [query, setQuery] = useState(''), [country, setCountry] = useState('Tutti i Paesi'), [view, setView] = useState<'both' | 'face' | 'hands'>('both'); const filtered = demoCases.map((p, i) => ({ p, i })).filter(({ p }) => (country === 'Tutti i Paesi' || p.country === country) && (p.name + ' ' + p.country).toLocaleLowerCase().includes(query.toLocaleLowerCase())); return <Localized><><div className="page-heading gallery-heading"><div><p className="eyebrow">PERSONE DIVERSE. LO STESSO SPAZIO.</p><h1>Ogni pelle, una storia.</h1><p>Dieci profili fittizi, dieci paesi, una visione più inclusiva. Esplora i volti e le mani, con fotografie illustrative.</p></div><span className="gallery-count"><Globe size={19}/> 10 profili · 10 Paesi</span></div><section className="gallery-intro"><div className="intro-symbol"><HeartHandshake size={33}/></div><div><h2>Un’app che fa spazio a tutti.</h2><p>Tonalità, età e percorsi diversi. Queste immagini servono a presentare e provare l’esperienza: non sono pazienti reali né dati per validare il modello.</p></div><div className="intro-avatars">{[0, 1, 2, 8].map(i => <PersonAvatar key={i} person={demoCases[i]}/>)}</div></section><div className="gallery-toolbar"><div className="searchbox"><Search size={18}/><input aria-label="Cerca profilo o paese" placeholder="Cerca un nome o un paese…" value={query} onChange={e => setQuery(e.target.value)}/></div><select aria-label="Filtra paese" value={country} onChange={e => setCountry(e.target.value)}><option value="Tutti i Paesi">Tutti i Paesi</option>{demoCases.map(p => <option value={p.country} key={p.id}>{p.country}</option>)}</select><div className="gallery-view" aria-label="Tipo di immagine">{([['both', 'Volto + mani', Images], ['face', 'Volto', ScanFace], ['hands', 'Mani', Hand]] as const).map(([id, label, Icon]) => <button key={id} aria-pressed={view === id} className={view === id ? 'active' : ''} onClick={() => setView(id)}><Icon size={15}/>{label}</button>)}</div></div><div className="gallery-summary"><span>{filtered.length} profili visibili</span><span><Sparkles size={13}/> Fotografie illustrative · persone fittizie</span></div><div className={'people-grid grid-view-' + view}>{filtered.map(({ p, i }) => <article className={'person-card ' + (active === i ? 'current-person' : '')} key={p.id}><button className="person-image-button" aria-label={'Ingrandisci ' + p.name} onClick={() => onOpen(p)}><PersonPhoto person={p} view={view}/><span className="photo-ai-badge"><Sparkles size={12}/> ESEMPIO</span><span className="expand-photo"><Expand size={16}/></span></button><div className="person-info"><div className="person-title"><div><h3>{p.name}</h3><span><MapPin size={12}/>{p.country}</span></div><span className={'case-number tone-' + i % 4}>{String(i + 1).padStart(2, '0')}</span></div><p>Profilo fittizio · volto e mani · un’unica registrazione visiva.</p><div className="person-actions"><button className="text-button" onClick={() => onProfile(i)}>Apri profilo demo <ArrowUpRight size={15}/></button><button className="analyze-button" onClick={() => onAnalyze(i)}><ScanLine size={15}/> Analizza mani</button></div></div></article>)}</div>{!filtered.length && <div className="card empty"><Search size={30}/><h3>Nessun profilo trovato.</h3><button className="outline" onClick={() => { setQuery(''); setCountry('Tutti i Paesi'); }}>Mostra tutti i profili</button></div>}<JourneyStory /><figure className="project-cover"><img src="/brand/vititrack-cover.webp" alt="VitiTrack: foto, diario e preparazione della visita" loading="lazy"/><figcaption><a href="/brand/vititrack-cover.webp" download>Scarica la copertina</a></figcaption></figure><div className="gallery-science-note"><ShieldCheck size={20}/><div><strong>Immagini dimostrative, non prove cliniche.</strong><p>Nomi e paesi sono assegnati a personaggi inventati. L’aspetto non verifica nazionalità, diagnosi o fototipo. Nessuna sequenza di miglioramento o efficacia terapeutica è associata a queste foto.</p></div></div></></Localized>; }
export default function VitiApp(props: {
    signedIn: boolean;
    displayName: string;
}) { return <Localized><LocaleProvider><VitiAppContent {...props}/></LocaleProvider></Localized>; }
