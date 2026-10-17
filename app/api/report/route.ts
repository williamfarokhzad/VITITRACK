import { user, runtime } from '../../../lib/server';
import { body, language, budget, complete, aiError, ApiError, configured } from '../../../lib/ai';
export async function POST(req: Request) { try {
    const u = await user(), b = await body(req), e = runtime();
    if (!configured('amd'))
        throw new ApiError('AMD needs a server key, endpoint and model.', 503);
    let data: any[];
    if (b.demo === true) {
        data = [18.4, 17.1, 16.8, 15.3, 14.2, 12.6].map((coverage, i) => ({ date: '2026-' + String(i + 5).padStart(2, '0') + '-15', site: 'Fictional hand region', note: 'Synthetic demonstration entry, not a patient record', methods: [], metrics: { coverage }, quality: 'Synthetic, clinical comparability unverified' }));
    }
    else {
        throw new ApiError('AMD Token Factory is restricted to fictional demo data. Your real journal remains available as a local structured report.', 403);
    }
    if (!data.length)
        throw new ApiError('Add at least one diary entry.');
    const records = data.map(d => ({ date: String(d.date || '').slice(0, 20), site: String(d.site || '').slice(0, 100), note: String(d.note || '').slice(0, 1000), methods: Array.isArray(d.methods) ? d.methods.slice(0, 12).map((x: any) => String(x).slice(0, 100)) : [], coverage: d.metrics?.coverage ?? null, quality: String(d.quality || '').slice(0, 250) }));
    await budget();
    return Response.json(await complete('amd', [{ role: 'user', content: 'Prepare a short dermatologist visit draft using ONLY these records. Separate reported observations from experimental measurements. Percentages concern the selected annotated region, not VASI or whole-body area. State that photo comparability is unverified. Include three questions for the dermatologist. Do not include names, diagnose or attribute causality. ' + (b.demo ? 'Clearly label all entries as fictional demo data. ' : '') + JSON.stringify(records) }], language(b.language)));
}
catch (e) {
    return aiError(e);
} }
