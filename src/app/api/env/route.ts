import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    PIANO_API: process.env.PIANO_API,
    ALLOWED_DOMAINS: process.env.ALLOWED_DOMAINS
  })
}
