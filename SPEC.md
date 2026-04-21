# AI Chatbot Application Specification

## 1. Project Overview

- **Project Name**: AI & AI Agent Chatbot
- **Project Type**: Web Application (Next.js)
- **Core Functionality**: A secure chatbot interface for answering questions about AI and AI Agents, protected by password authentication
- **Target Users**: Users interested in learning about AI and AI Agent concepts

## 2. UI/UX Specification

### Layout Structure

- **Login Page**: Centered card with password input
- **Chat Page**: Full-screen chat interface with message list and input area

### Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Visual Design

#### Color Palette

- **Background**: `#0a0a0f` (deep dark)
- **Card Background**: `#12121a` (dark slate)
- **Border**: `#1e1e2e` (subtle border)
- **Primary**: `#6366f1` (indigo)
- **Primary Hover**: `#818cf8` (light indigo)
- **Text Primary**: `#f0f0f5` (off-white)
- **Text Secondary**: `#9ca3af` (muted gray)
- **User Message BG**: `#1e1b4b` (indigo dark)
- **AI Message BG**: `#18181b` (zinc dark)
- **Error**: `#ef4444` (red)
- **Success**: `#22c55e` (green)

#### Typography

- **Font Family**: `"JetBrains Mono", "Fira Code", monospace`
- **Heading (Login)**: 24px, font-weight 600
- **Body**: 14px, font-weight 400
- **Message Text**: 14px, font-weight 400
- **Input**: 14px, font-weight 400

#### Spacing System

- **Card Padding**: 32px
- **Message Gap**: 16px
- **Input Padding**: 12px 16px
- **Button Padding**: 12px 24px

#### Visual Effects

- **Card Shadow**: `0 25px 50px -12px rgba(0, 0, 0, 0.5)`
- **Border Radius**: 12px (cards), 8px (inputs/buttons)
- **Transitions**: 200ms ease-in-out

### Components

#### Login Page

- Logo/Title: "AI Agent Chat" centered
- Password Input: Full width, placeholder "Enter password"
- Submit Button: Full width, "Access Chat"
- Error Message: Red text below input when password incorrect
- Background: Subtle grid pattern

#### Chat Page

- Header: Fixed top, shows title and logout button
- Message List: Scrollable area displaying conversation
- User Message: Right-aligned, indigo background
- AI Message: Left-aligned, dark background with typewriter effect
- Input Area: Fixed bottom, text input + send button
- Loading State: Animated dots or typing indicator

## 3. Functionality Specification

### Core Features

1. **Password Authentication**
   - Check password against `APP_PASSWORD` environment variable
   - Store authenticated state in session/cookie
   - Redirect to login if not authenticated

2. **Chat Interface**
   - Display message history
   - Send user messages
   - Receive AI responses with streaming
   - Auto-scroll to latest message

3. **AI Responses (via Server-side API)**
   - Route Handler at `/api/chat`
   - Use OpenAI API Key from environment variable
   - System prompt: "You are an AI and AI Agent expert. Answer concisely and accurately."
   - Streaming responses

### User Interactions

1. Login Flow
   - User enters password
   - Click "Access Chat" or press Enter
   - If correct -> redirect to chat page
   - If incorrect -> show error message

2. Chat Flow
   - Type message in input
   - Click send or press Enter
   - Message appears in list
   - AI response streams in
   - Click logout to return to login

### Security Requirements

- **API Key**: Never exposed to client, stored in server-side environment
- **Password**: Checked server-side against environment variable
- **Session**: Simple auth cookie or session storage

## 4. Acceptance Criteria

- [ ] Login page displays with password input
- [ ] Incorrect password shows error message
- [ ] Correct password redirects to chat page
- [ ] Chat page shows message input area
- [ ] User can send messages and see them in list
- [ ] AI responds with streaming text
- [ ] Logout returns to login page
- [ ] API Key is not visible in client-side code
- [ ] Application works when deployed to Vercel with environment variables

## 5. Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **AI SDK**: Vercel AI SDK (`ai`)
- **AI Provider**: OpenAI (`openai`)
- **Deployment**: Vercel