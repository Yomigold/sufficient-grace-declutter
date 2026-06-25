import Anthropic from '@anthropic-ai/sdk'
import { ExtractionResult } from '../../types'
import { AGENT_SYSTEM_PROMPT } from './prompt'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function stripCodeFences(text: string): string {
  return text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
}

export async function runAgent(thread: string, source: string): Promise<ExtractionResult> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: AGENT_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Source: ${source}\n\nConversation thread:\n${thread}`,
      },
    ],
  })

  const block = message.content[0]
  if (block.type !== 'text') {
    throw new Error('Unexpected response type from Claude API')
  }

  const cleaned = stripCodeFences(block.text)
  const parsed = JSON.parse(cleaned) as ExtractionResult

  if (!parsed.name || !parsed.stage || !Array.isArray(parsed.notes) || !Array.isArray(parsed.tasks)) {
    throw new Error('Invalid extraction result shape from Claude API')
  }

  return parsed
}
