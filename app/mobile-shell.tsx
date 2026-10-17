'use client';
import { Camera, Home, Menu, MessageCircle, Microscope, ChevronRight, Check, Stethoscope, Globe, BookOpen, ClipboardCheck } from 'lucide-react';
import { LanguageSwitch, useLocale } from './locale';
import type { DemoCase } from './demo-cases';
export function RoleAvatar({ role, person, className = '' }: {
    role: string;
    person: DemoCase;
    className?: string;
}) { const { l } = useLocale(); return <span className={'role-avatar avatar-' + role + ' ' + className}>{role === 'public' ? <Globe size={23}/> : <img src={role === 'doctor' ? '/profiles/demo-doctor.webp' : person.thumb} alt={role === 'doctor' ? l('Fictional doctor profile', 'Profilo medico fittizio') : l('Patient demo profile', 'Profilo paziente demo')}/>}</span>; }
export function AppHeader({ role, person, demo, onNavigate, onMenu }: {
    role: string;
    person: DemoCase;
    demo: boolean;
    onNavigate: (p: string) => void;
    onMenu: () => void;
}) { const { l } = useLocale(); return <header className="topbar unified-header"><button className="icon-button mobile-menu" aria-label={l('All sections', 'Tutte le sezioni')} onClick={onMenu}><Menu size={21}/></button><button className="header-brand" onClick={() => onNavigate('home')}><strong>VitiTrack</strong><span>{role === 'doctor' ? l('Doctor workspace', 'Spazio medico') : role === 'public' ? l('Explore together', 'Esplora con noi') : l('Your personal diary', 'Il tuo diario')}{demo ? ' · Demo' : ''}</span></button><div className="header-tools"><LanguageSwitch /><button className="header-profile" aria-label={l('Open profile and choose your role', 'Apri il profilo e scegli il ruolo')} onClick={() => onNavigate('profile')}><RoleAvatar role={role} person={person}/><span>{role === 'doctor' ? l('Doctor', 'Medico') : role === 'public' ? l('Public', 'Pubblico') : l('Patient', 'Paziente')}</span></button></div></header>; }
const sections = [{ id: 'home', en: 'Home', it: 'Home', Icon: Home }, { id: 'timeline', en: 'Photos', it: 'Foto', Icon: Camera }, { id: 'chat', en: 'Chat', it: 'Chat', Icon: MessageCircle }, { id: 'research', en: 'Research', it: 'Ricerca', Icon: Microscope }, { id: 'profile', en: 'Profile', it: 'Profilo', Icon: null }];
export function BottomNav({ page, role, person, onNavigate }: {
    page: string;
    role: string;
    person: DemoCase;
    onNavigate: (p: string) => void;
}) { const { l } = useLocale(); const active = ['capture', 'gallery'].includes(page) ? 'timeline' : ['privacy', 'terms'].includes(page) ? 'profile' : page === 'community' ? 'research' : page === 'care' || page === 'report' ? 'home' : page; return <nav className="mobile-nav stable-bottom-nav" aria-label={l('Main navigation', 'Navigazione principale')}>{sections.map(({ id, en, it, Icon }) => <button key={id} type="button" data-section={id} aria-current={active === id ? 'page' : undefined} className={active === id ? 'active' : ''} onClick={() => onNavigate(id)}>{Icon ? <Icon size={22}/> : <RoleAvatar role={role} person={person}/>}<span>{l(en, it)}</span></button>)}</nav>; }
export function RolePicker({ role, person, demo, onSelect }: {
    role: string;
    person: DemoCase;
    demo: boolean;
    onSelect: (s: string) => void;
}) { const { l } = useLocale(); return <section className="card role-picker"><div className="section-title"><div><p className="eyebrow">{l('YOUR WORKSPACE', 'IL TUO SPAZIO')}</p><h2>{l('How are you using VitiTrack?', 'Come usi VitiTrack?')}</h2></div><span className="pill mint">{l('Change here anytime', 'Cambia qui quando vuoi')}</span></div><div className="role-options">{[{ id: 'patient', en: 'I’m a patient', it: 'Sono un paziente', desc: l('My photos, notes and care journey', 'Le mie foto, note e il mio percorso') }, { id: 'doctor', en: 'I’m a doctor', it: 'Sono un medico', desc: l('Shared records and patient conversations', 'Cartelle condivise e colloqui con i pazienti') }].map(r => <button key={r.id} aria-pressed={role === r.id} className={'role-option ' + (role === r.id ? 'chosen' : '')} onClick={() => onSelect(r.id)}><RoleAvatar role={r.id} person={person} className="role-choice-photo"/><span><strong>{l(r.en, r.it)}</strong><small>{r.desc}</small></span><span className="role-check">{role === r.id ? <Check size={16}/> : <ChevronRight size={16}/>}</span></button>)}</div><button className="text-button public-role-choice" aria-pressed={role === 'public'} onClick={() => onSelect('public')}><Globe size={16}/>{l('Just exploring? Open the public view.', 'Vuoi solo esplorare? Apri la vista pubblica.')}</button><p className="muted">{demo ? l('These photographs represent fictional demo profiles. Real clinical access needs separate sign-in and patient consent.', 'Queste foto rappresentano profili demo fittizi. L’accesso clinico reale richiede autenticazione separata e consenso del paziente.') : l('Choosing Doctor changes your workspace. Real patient records still require an enabled professional account and each patient’s consent.', 'Scegliere Medico cambia il tuo spazio. Le cartelle reali richiedono comunque un account professionale abilitato e il consenso di ciascun paziente.')}</p></section>; }
export function JournalShortcuts({ onNavigate, role }: {
    onNavigate: (p: string) => void;
    role: string;
}) { const { l } = useLocale(); return <div className="journal-shortcuts">{role === 'patient' && <button onClick={() => onNavigate('capture')}><Camera size={18}/>{l('Add a photo', 'Aggiungi foto')}</button>}{role === 'patient' && <button onClick={() => onNavigate('care')}><BookOpen size={18}/>{l('Care notes', 'Note di cura')}</button>}<button onClick={() => onNavigate('report')}><ClipboardCheck size={18}/>{l('Visit report', 'Report visita')}</button></div>; }
export function FloatingDoctorChat({ onOpen }: {
    onOpen: () => void;
}) { const { l } = useLocale(); return <button className="floating-doctor-chat" aria-label={l('Open chat with your doctor', 'Apri la chat con il tuo medico')} onClick={onOpen}><span>{l('Message doctor', 'Scrivi al medico')}</span><span className="role-avatar"><img src="/profiles/demo-doctor.webp" alt={l('Illustrative doctor avatar', 'Avatar illustrativo del medico')}/></span><span className="floating-chat-badge"><MessageCircle size={12}/></span></button>; }
