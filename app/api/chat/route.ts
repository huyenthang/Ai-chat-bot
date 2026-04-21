import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages } = body

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const systemMessage = {
      role: 'system',
      content: `You are an AI and AI Agent expert. You have deep knowledge about:
- Artificial Intelligence (AI) fundamentals
- Machine Learning and Deep Learning
- AI Agents and Agentic AI systems
- Large Language Models (LLMs)
- Prompt Engineering
- AI automation and workflows
- AI tools and frameworks
- AI ethics and best practices

Respond concisely, accurately, and in a helpful manner. Keep answers brief but informative.`
    }

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      stream: true,
    })

    return new Response(stream.toReadableStream(), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}