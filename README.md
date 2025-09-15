# GPT Clone with Memory 

A ChatGPT-like clone built with **Next.js 13+**, **Vercel AI SDK**, **Google Gemini**, and **mem0** for AI memory.  
Includes streaming responses, memory persistence, Document and image uploading

## Tech Stack

- [Next.js 14+ (App Router)](https://nextjs.org/)
- [Vercel AI SDK v5](https://sdk.vercel.ai/docs) (for AI streaming)
- [Google Gemini](https://ai.google.dev/)
- [mem0](https://mem0.ai/) (AI memory persistence)
- [Tailwind CSS](https://tailwindcss.com/) (UI styling)
- [React Markdown + Rehype/Remark](https://github.com/remarkjs/react-markdown) (rendering AI responses with code blocks)
- [Mongo db](https://mongodb.com)
- [Uploadcare](https://uploadcare.com/)


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Features

💬 ChatGPT-style UI — clean, responsive design that works seamlessly on mobile, tablet, and desktop

⚡ Streaming responses — AI replies stream in real-time with typing indicators and loaders

🤖 Gemini integration — powered by Google Gemini via the Vercel AI SDK

🧠 Persistent memory — context-aware conversations using mem0, stored per user

🗂 Code rendering — AI responses support code blocks with syntax highlighting

🚨 Error handling — graceful error bubbles for failed or interrupted requests

🆕 Multi-chat support — start new chats (local storage + MongoDB integration)

🔐 User sessions — tracked via cookies (user_id) and Clerk authentication

📂 File & image uploads — upload images (PNG, JPG, JPEG) or PDFs and get AI responses

⏳ Prompt history limit — local storage keeps the 4 most recent prompts per user

📋 User-specific memory — conversations and memory tied to each authenticated user

📑 Chat management — fetch all chats for a user and view all messages in a chat

## Architecture

- **Next.js (App Router)** → Frontend & API routes
- **Vercel AI SDK** → Streams responses from Gemini
- **mem0** → Stores/retrieves user memories (per `user_id`)
- **Local Storage** → Limits prompt history (max 4)
- **Cookies** → Generates unique `user_id` for each visitor
