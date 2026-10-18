'use client';
import { useEffect, useRef, useState } from 'react';
import { Localized, useLocale } from './locale';
import { ArrowUpRight, Download, Film, Images } from 'lucide-react';

const moments = [
    ['Week 1', 'Settimana 1'], ['Month 1', 'Mese 1'], ['Month 2', 'Mese 2'],
    ['Month 3', 'Mese 3'], ['Month 4', 'Mese 4'], ['Month 6', 'Mese 6'],
    ['Month 8', 'Mese 8'], ['Month 10', 'Mese 10'], ['Month 11', 'Mese 11'], ['Month 12', 'Mese 12'],
] as const;

export default function JourneyStory({ compact = false }: { compact?: boolean }) {
    const video = useRef<HTMLVideoElement>(null);
    const [activeMoment, setActiveMoment] = useState(0);
    const { l } = useLocale();

    useEffect(() => {
        const element = video.current;
        if (!element) return;
        element.muted = true;
        element.defaultMuted = true;
        element.play().catch(() => undefined);
    }, []);

    function syncMoment() {
        const element = video.current;
        if (!element || !element.duration) return;
        setActiveMoment(Math.min(moments.length - 1, Math.floor(element.currentTime / element.duration * moments.length)));
    }

    function visitMoment(index: number) {
        const element = video.current;
        setActiveMoment(index);
        if (!element || !element.duration) return;
        element.currentTime = element.duration * index / moments.length;
        element.play().catch(() => undefined);
    }

    return <Localized><section className={'journey-story ' + (compact ? 'journey-compact' : '')} aria-labelledby="journey-title">
        <header className="journey-heading">
            <span className="eyebrow">{l('A STORY IN PICTURES', 'UN RACCONTO PER IMMAGINI')}</span>
            <h2 id="journey-title">{l('A year of noticing, documenting, and talking with a doctor.', 'Un anno per osservare, documentare e parlare con il medico.')}</h2>
            <p>{l('Ten imagined moments, from the first week to month twelve.', 'Dieci momenti immaginari, dalla prima settimana al dodicesimo mese.')}</p>
        </header>

        <div className="journey-film">
            <video ref={video} onTimeUpdate={syncMoment} onSeeked={syncMoment} autoPlay muted loop playsInline preload="auto" poster="/story/journey-poster-crop-v3.jpg" aria-label={l('A fictional ten-moment story, playing silently on repeat', 'Una storia immaginaria in dieci momenti, in riproduzione silenziosa e continua')}>
                <source src="/story/fictional-journey-crop-v3.mp4" type="video/mp4" />
                {l('Your browser does not support this video.', 'Il browser non supporta questo video.')}
            </video>
            <span className="journey-film-label"><Film size={14} />{l('Fictional story · 12 months', 'Storia immaginaria · 12 mesi')}</span>
        </div>

        <nav className="journey-timeline" aria-label={l('Story timeline', 'Cronologia della storia')}>
            {moments.map(([en, it], index) => <button key={en} type="button" className={activeMoment === index ? 'active' : ''} aria-current={activeMoment === index ? 'step' : undefined} aria-label={l(`Go to ${en}`, `Vai a ${it.toLowerCase()}`)} onClick={() => visitMoment(index)}>
                <span className="journey-dot" aria-hidden="true" />
                <span>{l(en, it)}</span>
            </button>)}
        </nav>

        <p className="journey-disclosure">{l('Illustrative fictional character and timeline. This is not a patient story, clinical evidence, a treatment outcome, or a promise of recovery.', 'Personaggio e cronologia fittizi a scopo illustrativo. Non è la storia di un paziente, una prova clinica, un risultato terapeutico o una promessa di guarigione.')}</p>

        {!compact && <div className="journey-extras">
            <a className="journey-sheet" href="/story/fictional-journey-10-steps.webp" target="_blank" rel="noreferrer" aria-label={l('Open all ten story images', 'Apri tutte le dieci immagini della storia')}><img src="/story/fictional-journey-10-steps.webp" alt={l('Ten illustrative portraits of the same fictional character across an imagined year', 'Dieci ritratti illustrativi dello stesso personaggio immaginario durante un anno immaginario')} loading="lazy" /><span><Images size={14} />{l('Explore all ten moments', 'Esplora tutti i dieci momenti')}<ArrowUpRight size={16} /></span></a>
            <div className="journey-links"><a href="/story/fictional-journey-crop-v3.mp4" download><Download size={15} />{l('Download video', 'Scarica il video')}</a><a href="/story/fictional-journey-10-steps.webp" download><Download size={15} />{l('Download image sheet', 'Scarica il foglio immagini')}</a></div>
        </div>}
    </section></Localized>;
}
