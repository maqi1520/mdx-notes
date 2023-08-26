import type { NextRequest } from 'next/server'
import { Configuration, OpenAIApi } from 'openai-edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const handler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)

  const { messages } = await req.json()

  if (!messages) {
    return new Response('No messages in the request', { status: 400 })
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '你是一名智能写作助手。' },
        ...messages,
      ],
      max_tokens: 7,
      temperature: 0,
      stream: true,
    })

    return new Response(completion.body, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream;charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error: any) {
    console.error(error)

    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        'content-type': 'application/json',
      },
    })
  }
}

export const config = {
  runtime: 'edge',
}

export default handler
