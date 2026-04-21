import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'

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

    return new Promise((resolve) => {
      const req = require('https').request(options, (res: any) => {
        let data = ''
        res.on('data', (chunk: any) => data += chunk)
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data)
            resolve(NextResponse.json(parsed))
          } catch {
            resolve(NextResponse.json({ error: 'Invalid response' }, { status: 500 }))
          }
        })
      })

      req.on('error', (e: any) => {
        resolve(NextResponse.json({ error: e.message }, { status: 500 }))
      })

      req.write(postData)
      req.end()
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}