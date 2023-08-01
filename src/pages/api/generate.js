import { OpenAIStream } from '../../utils/OpenAIStream'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI')
}

export const config = {
  runtime: 'edge',
}

export default async (request, response) => {
  const { messages } = request.body

  if (!messages) {
    return new Response('No messages in the request', { status: 400 })
  }

  const payload = {
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
