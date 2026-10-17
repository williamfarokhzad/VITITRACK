import { body, language, budget, complete, aiError, ApiError, configured } from '../../../lib/ai';
import { user } from '../../../lib/server';
export async function POST(req: Request) { try {
    await user();
    const b = await body(req, 1500000);
    if (!configured('google'))
        throw new ApiError('Google AI needs server configuration.', 503);
    if (b.consent !== true)
        throw new ApiError('Please approve sending this photo to Google AI.');
    const image = String(b.image || '');
    if (image.length < 100 || image.length > 1400000 || !/^[A-Za-z0-9+/]+=*$/.test(image) || !image.startsWith('/9j/'))
        throw new ApiError('Use a JPEG photo smaller than 1 MB.');
    await budget();
    return Response.json(await complete('google', [{ role: 'user', content: 'Review this photo ONLY for documentation quality: lighting, blur, framing, shadows, reflections, visible scale and suggestions for repeating the same position. Say if assessment is uncertain. Do not identify a person, infer skin type or nationality, diagnose, measure patches, estimate severity or recommend treatment. Give at most five short practical points.' }], language(b.language), image));
}
catch (e) {
    return aiError(e);
} }
