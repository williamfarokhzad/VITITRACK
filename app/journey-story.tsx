'use client';
import { useEffect, useRef, useState } from 'react';
import { Localized, useLocale } from './locale';
import { Film, Images, ArrowUpRight, Download, Play, Pause } from 'lucide-react';
export default function JourneyStory({ compact = false }: {
    compact?: boolean;
}) {
    const video = useRef<HTMLVideoElement>(null), [playing, setPlaying] = useState(false), { l } = useLocale();
    useEffect(()=>{const element=video.current;if(!element)return;element.muted=true;element.defaultMuted=true;element.play().catch(()=>setPlaying(false));},[]);
    return <Localized><section className={"journey-story " + (compact ? "journey-compact" : "")} aria-labelledby="journey-title">
  <div className="journey-film"><video ref={video} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} controls autoPlay muted loop playsInline preload="auto" poster="/story/journey-poster-v2.jpg" aria-label="Dieci immagini in sequenza, storia immaginaria"><source src="/story/fictional-journey-stabilized-v2.mp4" type="video/mp4"/>Il browser non supporta il video. Usa il collegamento per scaricarlo.</video><button type="button" className="journey-play" data-playing={playing} aria-label={playing ? l('Pause story video', 'Metti in pausa il video') : l('Play story video', 'Riproduci il video')} onClick={() => { if (playing)
        video.current?.pause();
    else
        video.current?.play().catch(() => { }); }}>{playing ? <Pause size={19}/> : <Play size={21}/>}</button><span className="journey-film-label"><Film size={14}/> 10 momenti · simulazione</span></div>
  <div className="journey-copy"><span className="eyebrow">UN RACCONTO PER IMMAGINI</span><h2 id="journey-title">Dalla preoccupazione<br />a un nuovo sorriso.</h2><p>Dieci istanti di una storia immaginaria. Guarda la sequenza, oppure esplora tutte le immagini insieme.</p><a className="journey-sheet" href="/story/fictional-journey-10-steps.webp" target="_blank" rel="noreferrer" aria-label="Apri le dieci immagini a dimensione intera"><img src="/story/fictional-journey-10-steps.webp" alt="Dieci ritratti illustrativi dello stesso personaggio: espressione da preoccupata a sorridente e riduzione immaginaria delle chiazze" loading="lazy"/><span><Images size={14}/> Tutti i dieci momenti <ArrowUpRight size={16}/></span></a><div className="journey-links"><a href="/story/fictional-journey-stabilized-v2.mp4" download><Download size={15}/> Scarica il video</a><a href="/story/fictional-journey-10-steps.webp" download><Download size={15}/> Scarica l’immagine</a></div><p className="journey-disclosure">Simulazione visiva con un personaggio fittizio. La sequenza non documenta un trattamento, non mostra risultati di VitiTrack e non promette guarigione.</p></div>
    </section></Localized>;
}
