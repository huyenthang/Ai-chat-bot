import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ token: '564d60b09cb940e96a9ea2c76f9ecbc4' })
}