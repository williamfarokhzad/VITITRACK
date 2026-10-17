'use client';
import { useState } from 'react';
import { Localized, LanguageSwitch, useLocale } from './locale';
import { Settings, ChevronLeft, ChevronRight, Expand, Plus, MessageCircle, BookOpen, Users, Film } from 'lucide-react';
import type { DemoCase } from './demo-cases';
type Entry = {
    id: string;
    date: string;
    photo?: string;
    note?: string;
};
export default function PocketDiary({ person, records, demo, onNavigate, onImage, onStory }: {
    person: DemoCase;
    records: Entry[];
    demo: boolean;
    onNavigate: (s: string) => void;
    onImage: () => void;
    onStory: () => void;
}) {
    const { locale, l } = useLocale();
    const now = new Date(), [month, setMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1)), [selected, setSelected] = useState(now.toISOString().slice(0, 10));
    const offset = (month.getDay() + 6) % 7, days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const dateKey = (d: number) => `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const selectedEntry = records.find(r => r.date === selected), latest = [...records].filter(r => r.photo).sort((a, b) => a.date.localeCompare(b.date)).at(-1), featured = selectedEntry?.photo ? selectedEntry : latest;
    const photos = records.filter(r => r.photo).slice(-3), monthLabel = month.toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB', { month: 'long', year: 'numeric' });
    const hand = (extra = '') => <div className={'pocket-hand ' + extra}><img src={person.image} alt="Fotografia illustrativa di una mano con chiazze chiare"/></div>;
    return <Localized><div className="pocket-diary">
  <section className="pocket-card pocket-latest"><div className="pocket-card-title"><div><h2>Ultima foto</h2><p>{featured ? new Date(featured.date + 'T12:00:00').toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : demo ? 'Una foto per iniziare il tuo diario' : 'Il tuo prossimo punto di riferimento'}</p></div><button aria-label="Ingrandisci ultima foto" onClick={onImage}><Expand size={18}/></button></div><button className="pocket-main-image" onClick={onImage} aria-label="Apri la fotografia">{featured?.photo ? <img className="pocket-real-image" src={featured.photo} alt="Foto salvata nel diario"/> : demo ? hand() : <div className="pocket-photo-empty"><Plus size={28}/><span>Aggiungi la prima foto</span></div>}</button>{demo && !featured && <span className="pocket-example">Immagine illustrativa · nessun risultato clinico</span>}</section>
  <section className="pocket-card pocket-calendar"><div className="pocket-card-title"><div><h2>Il mio diario</h2><p className="capitalize">{monthLabel}</p></div><div className="pocket-month-nav"><button aria-label="Mese precedente" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={18}/></button><button aria-label="Mese successivo" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={18}/></button></div></div><div className="pocket-weekdays">{['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(x => <span key={x}>{x}</span>)}</div><div className="pocket-days">{Array.from({ length: offset }, (_, i) => <span key={'blank' + i}/>)}{Array.from({ length: days }, (_, i) => { const key = dateKey(i + 1), entry = records.find(r => r.date === key); return <Localized key={key}><button aria-label={new Date(key + 'T12:00:00').toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} aria-pressed={selected === key} className={(selected === key ? 'selected ' : '') + (entry ? 'has-entry' : '')} onClick={() => setSelected(key)}><span>{i + 1}</span>{entry && <i />}</button></Localized>; })}</div><div className="pocket-day-note"><span>{selectedEntry ? 'Una registrazione nel diario.' : 'Come ti senti oggi?'}</span><button onClick={() => onNavigate('care')}>{selectedEntry ? 'Apri le note' : 'Aggiungi una nota'} <Plus size={13}/></button></div></section>
  <section className="pocket-card pocket-timeline"><div className="pocket-card-title"><h2>La mia timeline</h2><button aria-label="Apri tutto il percorso" onClick={() => onNavigate('timeline')}><ChevronRight size={19}/></button></div><div className="pocket-photo-row">{photos.length ? photos.map(r => <button className="pocket-thumb" key={r.id} onClick={() => onNavigate('timeline')}><img src={r.photo} alt="Foto del diario"/><span>{new Date(r.date + 'T12:00:00').toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB', { day: 'numeric', month: 'short' })}</span><i /></button>) : <><button className="pocket-thumb pocket-sample-thumb" onClick={onImage}>{demo ? hand() : <span className="pocket-thumb-placeholder"><BookOpen size={22}/></span>}<span>{demo ? 'Foto esempio' : 'Le tue foto'}</span><i /></button><div className="pocket-timeline-empty"><span>La tua storia,<br />una foto alla volta.</span></div></>}<button className="pocket-add-photo" onClick={() => onNavigate('capture')}><Plus size={25}/><span>Aggiungi<br />foto</span></button></div></section>
  <button className="pocket-visit" onClick={() => onNavigate('report')}><span className="pocket-chat-icon"><MessageCircle size={22}/></span><span><strong>Prepara la tua prossima visita</strong><small>Note, foto e domande in un unico posto.</small></span><ChevronRight size={18}/></button>
  <button className="pocket-visit pocket-ai-chat" onClick={() => onNavigate('chat')}><span className="pocket-chat-icon"><MessageCircle size={22}/></span><span><strong>{l("A little support, anytime", "Un piccolo aiuto, quando serve")}</strong><small>{l("Talk to your assistant or message your doctor.", "Parla con l’assistente o scrivi al tuo medico.")}</small></span><ChevronRight size={18}/></button><div className="pocket-more"><button onClick={() => onNavigate('research')}><BookOpen size={17}/> Ricerca</button><button onClick={() => onNavigate('gallery')}><Users size={17}/> Volti e percorsi</button><button onClick={onStory}><Film size={17}/> Una storia</button></div>
 </div></Localized>;
}
