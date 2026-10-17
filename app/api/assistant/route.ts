import { body, language, budget, complete, aiError, ApiError, configured } from '../../../lib/ai';
import { user } from '../../../lib/server';
export async function POST(req: Request) { try {
    await user();
    const b = await body(req), provider = String(b.provider || 'amd');
    if (!['amd', 'google', 'evolus'].includes(provider))
        throw new ApiError('Choose an available provider.');
    if (!await configured(provider))
        throw new ApiError('This provider needs server configuration.', 503);
    if (b.consent !== true)
        throw new ApiError('Please approve sending your message to this AI provider.');
    const messages = (Array.isArray(b.messages) ? b.messages : []).slice(-8).filter((m: any) => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string').map((m: any) => ({ role: m.role, content: m.content.slice(0, 3000) }));
    if (!messages.length || messages.at(-1).role !== 'user')
        throw new ApiError('Please enter a message.');
    if (provider === 'amd') {
        const prompts = ['How can I take more consistent photos?', 'Help me prepare questions for my dermatologist.', 'Come posso scattare foto più confrontabili?', 'Aiutami a preparare le domande per il dermatologo.'];
        if (b.demo !== true || !prompts.includes(messages.at(-1).content))
            throw new ApiError('AMD demo accepts only the sample questions. Use Google AI or Evolus for your own messages.', 400);
        messages.splice(0, messages.length - 1);
    }
    await budget();
    return Response.json(await complete(provider, messages, language(b.language)));
}
catch (e) {
    return aiError(e);
} }
