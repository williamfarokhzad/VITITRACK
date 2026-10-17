import { body, language, budget, complete, aiError, ApiError, configured } from '../../../lib/ai';
import { user } from '../../../lib/server';
import { latestPapers } from '../../../lib/papers';
export async function POST(req: Request) { try {
    await user();
    const b = await body(req);
    if (!configured('google'))
        throw new ApiError('Google AI needs server configuration.', 503);
    const p = (await latestPapers()).articles.find(p => p.id === b.id && p.source === b.source);
    if (!p || !p.abstract || p.retracted)
        throw new ApiError('No eligible abstract is available for this article.');
    await budget();
    return Response.json({ ...await complete('google', [{ role: 'user', content: 'Summarize only this abstract in four short sections: question, study design/population, reported findings, limitations. Label unknown details as not reported. Do not add results or advice. The source is an abstract, not the full paper. Data: ' + JSON.stringify({ title: p.title, date: p.date, abstract: p.abstract }) }], language(b.language)), sourceUrl: p.url });
}
catch (e) {
    return aiError(e);
} }
