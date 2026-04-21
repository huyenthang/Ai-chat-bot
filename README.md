# AI Agent Chatbot

A secure AI chatbot application built with Next.js, Tailwind CSS, and Vercel AI SDK.

## Features

- Minimalist chat interface
- Password-protected access
- Secure API calls via server-side route handlers
- Streaming AI responses
- Expert knowledge on AI and AI Agents

## Prerequisites

- Node.js 18+
- OpenAI API Key

## Local Development

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` with your credentials:
```env
OPENAI_API_KEY=your_openai_api_key_here
APP_PASSWORD=your_secure_password_here
```

5. Run development server:
```bash
npm run dev
```

6. Open http://localhost:3000

## Deployment to Vercel

### Step 1: Code is already on GitHub

### Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository (huyenthang/Ai-chat-bot)
4. In "Environment Variables" section, add:

| Name | Value |
|------|-------|
| `OPENAI_API_KEY` | `sk-your-openai-api-key` |
| `APP_PASSWORD` | `your-secure-password` |

5. Click "Deploy"

### Step 3: Verify Deployment

After deployment, your app will be available at `https://your-project.vercel.app`

## Security Notes

- API keys are stored as environment variables and never exposed to the client
- Password authentication is verified server-side
- Auth cookie is httpOnly and secure in production
- All AI API calls go through server-side route handlers

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Vercel AI SDK
- OpenAI API

## License

MIT
