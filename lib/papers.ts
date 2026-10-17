import { remote, ApiError } from './ai';
let cached: {
    time: number;
    articles: any[];
} | null = null;
export async function latestPapers() { if (cached && Date.now() - cached.time < 3600000)
    return cached; const d = await remote('https://www.ebi.ac.uk/europepmc/webservices/rest/search?' + new URLSearchParams({ query: 'TITLE_ABS:vitiligo sort_date:y', format: 'json', pageSize: '12', resultType: 'core' }), { headers: { Accept: 'application/json' } }); const articles = (d.resultList?.result || []).filter((p: any) => p.title && p.id).map((p: any) => ({ id: String(p.id), source: String(p.source), title: String(p.title), authors: String(p.authorString || ''), date: String(p.firstPublicationDate || p.pubYear || ''), journal: String(p.journalInfo?.journal?.title || ''), abstract: String(p.abstractText || '').replace(/<[^>]*>/g, ' ').slice(0, 14000), doi: p.doi || '', url: p.source === 'MED' ? 'https://pubmed.ncbi.nlm.nih.gov/' + encodeURIComponent(p.id) + '/' : 'https://europepmc.org/article/' + encodeURIComponent(p.source) + '/' + encodeURIComponent(p.id), retracted: p.isRetracted === 'Y' })); if (!articles.length)
    throw new ApiError('No research results returned. Please try again later.', 502); cached = { time: Date.now(), articles }; return cached; }
