import { latestPapers } from '../../../lib/papers';
import { aiError } from '../../../lib/ai';
export async function GET() { try {
    const d = await latestPapers();
    return Response.json({ articles: d.articles.map(({ abstract, ...p }: any) => ({ ...p, hasAbstract: !!abstract })), retrievedAt: new Date(d.time).toISOString(), source: 'Europe PMC', cacheMinutes: 60 });
}
catch (e) {
    return aiError(e);
} }
