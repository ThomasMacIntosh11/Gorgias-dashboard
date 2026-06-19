import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();
const cache = new Map<string, string>();

export async function POST(request: Request) {
  const { reason, description, count, pct } = await request.json();

  if (cache.has(reason)) {
    return Response.json({ fix: cache.get(reason) });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 128,
      system:
        'You are a product advisor for Gorgias, an AI-powered customer support platform for e-commerce. ' +
        'Given a reason why the AI is escalating tickets to human agents, write exactly one clear, direct sentence ' +
        'recommending what the product or merchant team should do to reduce this escalation type. ' +
        'Be specific about the fix. No preamble — just the single sentence.',
      messages: [
        {
          role: 'user',
          content:
            `Escalation reason: ${reason}\n` +
            `Description: ${description}\n` +
            `Occurrences: ${count} (${pct}% of all escalations)\n\n` +
            'What should the team do to reduce this escalation type?',
        },
      ],
    });

    const text = message.content.find(b => b.type === 'text')?.text ?? '';
    if (text) {
      cache.set(reason, text);
      return Response.json({ fix: text });
    }
  } catch {
    // fall through to fallback
  }

  return Response.json({ fix: null });
}
