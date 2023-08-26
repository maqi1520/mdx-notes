import type { NextRequest } from 'next/server'
import {
  OpenAIStream,
  OpenAIStreamPayload,
  ChatGPTMessage,
} from '../../utils/OpenAIStream'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI')
}

export const config = {
  runtime: 'edge',
}

const handler = async (req: NextRequest): Promise<Response> => {
  const { messages } = (await req.json()) as {
    messages: ChatGPTMessage[]
  }

  if (!messages) {
    return new Response('No messages in the request', { status: 400 })
  }

  const payload: OpenAIStreamPayload = {
    // model: "text-davinci-003",
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 500,
    stream: true,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}

export default handler
