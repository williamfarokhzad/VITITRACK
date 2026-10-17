'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import translations from './translations';
export type Locale = 'en' | 'it';
const Context = createContext<{
    locale: Locale;
    setLocale: (x: Locale) => void;
}>({ locale: 'en', setLocale: () => { } });
export function LocaleProvider({ children }: {
    children: React.ReactNode;
}) { const [locale, set] = useState<Locale>('en'); useEffect(() => { if (localStorage.getItem('vititrack-language') === 'it')
    set('it'); }, []); function setLocale(x: Locale) { set(x); localStorage.setItem('vititrack-language', x); } useEffect(() => { document.documentElement.lang = locale; }, [locale]); return <Context.Provider value={{ locale, setLocale }}>{children}</Context.Provider>; }
export function useLocale() { const { locale, setLocale } = useContext(Context); return { locale, setLocale, l: (en: string, it: string) => locale === 'it' ? it : en, t: (s: string) => translate(s, locale) }; }
export function translate(s: string, locale: Locale) { if (locale === 'it' && errors[s])
    return errors[s]; if (locale === 'it')
    return s === 'AMD demo uses fixed fictional records only. Token Factory does not permit sensitive health data.' ? 'La demo AMD usa solo registrazioni fittizie predefinite. Token Factory non consente dati sanitari sensibili.' : s; const key = s.trim(); return translations[key] ? s.replace(key, translations[key]) : s; }
function tree(node: React.ReactNode, locale: Locale): React.ReactNode { if (typeof node === 'string')
    return translate(node, locale); if (Array.isArray(node))
    return node.map((n, i) => <React.Fragment key={React.isValidElement(n) ? n.key ?? i : i}>{tree(n, locale)}</React.Fragment>); if (!React.isValidElement(node))
    return node; const p = node.props as any, props: any = {}; for (const key of ['title', 'placeholder', 'aria-label', 'alt'])
    if (typeof p[key] === 'string')
        props[key] = translate(p[key], locale); if (p.children !== undefined)
    props.children = tree(p.children, locale); return React.cloneElement(node, props); }
export function Localized({ children }: {
    children: React.ReactNode;
}) { const { locale } = useLocale(); return tree(children, locale); }
export function LanguageSwitch() { const { locale, setLocale } = useLocale(); return <div className="language-switch" aria-label="Language / Lingua">{(['en', 'it'] as const).map(x => <button key={x} type="button" aria-pressed={locale === x} onClick={() => setLocale(x)}>{x.toUpperCase()}</button>)}</div>; }
const errors: Record<string, string> = {
    "Please sign in to use online services.": "Accedi per usare i servizi online.",
    "The service could not complete this request. Please try again.": "Il servizio non ha completato la richiesta. Riprova.",
    "This provider needs server configuration.": "Questo servizio richiede la configurazione sul server.",
    "Google AI needs server configuration.": "Google AI richiede la configurazione sul server.",
    "AMD needs a server key, endpoint and model.": "AMD richiede chiave, endpoint e modello sul server.",
    "Hourly limit reached. Please try again later.": "Limite orario raggiunto. Riprova più tardi.",
    "Provider limit reached. Please wait before retrying.": "Limite del servizio raggiunto. Attendi prima di riprovare.",
    "Provider unavailable. Check the server credentials, model and quota.": "Servizio non disponibile. Verifica credenziali, modello e quota sul server.",
    "No response returned. Try another question.": "Nessuna risposta ricevuta. Prova un’altra domanda.",
    "Connect with an enabled doctor in your profile first.": "Collegati prima a un medico abilitato dal tuo profilo.",
    "Access not permitted.": "Accesso non consentito.",
    "AMD demo accepts only the sample questions. Use Google AI or Evolus for your own messages.": "La demo AMD accetta solo le domande di esempio. Usa Google AI o Evolus per i tuoi messaggi.",
    "AMD Token Factory is restricted to fictional demo data. Your real journal remains available as a local structured report.": "AMD Token Factory è limitato a dati fittizi. Il tuo diario reale resta disponibile come riepilogo strutturato locale.",
    "No eligible abstract is available for this article.": "Nessun abstract idoneo disponibile per questo articolo.",
    "Please wait before sending more messages.": "Attendi prima di inviare altri messaggi.",
    "AMD model catalog unavailable.": "Catalogo modelli AMD non disponibile.",
    "Configured AMD model is absent from the current catalog. Update AMD_MODEL on the server.": "Il modello AMD configurato non è nel catalogo attuale. Aggiorna AMD_MODEL sul server."
};
