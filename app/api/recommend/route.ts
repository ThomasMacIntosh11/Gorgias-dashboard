import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();
const cache = new Map<string, string>();

export async function POST(request: Request) {
  const { issueType, frequency, merchantSegment, daysOpen, triageStatus, recommendedAction } = await request.json();

  if (cache.has(issueType)) {
    return Response.json({ recommendation: cache.get(issueType) });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 128,
      system:
        'You are a product advisor for Gorgias, an AI-powered customer support platform for e-commerce merchants. ' +
        'Given a product signal, write exactly one clear, direct sentence recommending what the product team should do. ' +
        'Name the specific fix and the expected outcome. No preamble, no bullet points — just the single sentence.',
      messages: [
        {
          role: 'user',
          content:
            `Issue: ${issueType}\n` +
            `Occurrences: ${frequency}\n` +
            `Affected segment: ${merchantSegment}\n` +
            `Days open: ${daysOpen}\n` +
            `Triage status: ${triageStatus}\n\n` +
            'What is your recommended action for the product team?',
        },
      ],
    });

    const text = message.content.find(b => b.type === 'text')?.text ?? '';
    if (text) {
      cache.set(issueType, text);
      return Response.json({ recommendation: text });
    }
  } catch {
    // fall through to fallback
  }

  return Response.json({ recommendation: recommendedAction ?? null });
}
