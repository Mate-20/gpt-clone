# GPT Clone with Memory 

A ChatGPT-like clone built with **Next.js 13+**, **Vercel AI SDK**, **Google Gemini**, and **mem0** for AI memory.  
Includes streaming responses, conversation editing, memory persistence.

## Tech Stack

- [Next.js 14+ (App Router)](https://nextjs.org/)
- [Vercel AI SDK v5](https://sdk.vercel.ai/docs) (for AI streaming)
- [Google Gemini](https://ai.google.dev/)
- [mem0](https://mem0.ai/) (AI memory persistence)
- [Tailwind CSS](https://tailwindcss.com/) (UI styling)
- [React Markdown + Rehype/Remark](https://github.com/remarkjs/react-markdown) (rendering AI responses with code blocks)


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

- 💬 ChatGPT-style UI (responsive: mobile, tablet, desktop)
- ⚡ Streaming AI responses with loader indicators
- 🤖 Gemini model integration via Vercel AI SDK
- 🧠 AI memory with mem0 (context-aware responses)
- 📝 Editable user messages
- 🗂 Code block rendering with syntax highlighting
- 🚨 Error message bubbles for failed requests
- 🆕 Start new chats (local storage based for now)
- 🔐 Per-user sessions via cookies (`user_id`)
- 📂 File & image upload support (Uploadcare integration - WIP)
- ⏳ Local storage limit of 4 prompts per user

## Architecture

- **Next.js (App Router)** → Frontend & API routes
- **Vercel AI SDK** → Streams responses from Gemini
- **mem0** → Stores/retrieves user memories (per `user_id`)
- **Local Storage** → Limits prompt history (max 4)
- **Cookies** → Generates unique `user_id` for each visitor


mongo
username : alvin2000
password:mongobuddyboy