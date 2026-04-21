import { NextRequest, NextResponse } from 'next/server'
import https from 'https'

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const { apiKey, messages, model = 'meta/llama-3.1-8b-instruct' } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key required' }, { status: 400 })
    }

    const postData = JSON.stringify({
      model,
      messages,
      max_tokens: 1024,
      temperature: 0.5
    })

    const data = await new Promise<string>((resolve, reject) => {
      const options = {
        hostname: 'integrate.api.nvidia.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }

      const req = https.request(options, (res) => {
        let body = ''
        res.on('data', (chunk) => body += chunk)
        res.on('end', () => resolve(body))
      })

      req.on('error', reject)
      req.write(postData)
      req.end()
    })

    const parsed = JSON.parse(data)
    return NextResponse.json(parsed)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}