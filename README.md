#  Gemini Chat App

A responsive, AI-style chat app built with **Next.js**, **TailwindCSS**, **Zustand**, and **TypeScript**. This project simulates a Gemini-like conversational interface with key UX and performance features implemented using modern frontend best practices.

## Live Demo

[ Click here to view the live app](https://your-deployed-link.com)  


---

## Project Overview

This web app provides a conversational AI chat experience with the following capabilities:

- Chat UI supporting AI + user messages
- Image message preview and upload
- Reverse infinite scroll
- Typing indicator ("Gemini is typing...")
- Copy-to-clipboard on hover
- Timestamps per message
- OTP-based login simulation
- Smooth UX with "Send on Enter" and "Shift+Enter for newline"

---

## Setup & Run Instructions

1. **Clone the repository**
```bash
git clone https://github.com/devdignesh/gemini_clone.git
cd gemini_clone
```
2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```
4. Open http://localhost:3000

## Folder & Component Structure

```bash
├── app/
|   ├── (chat)
|   |    ├── chatroom/[id]/page.tsx  # Chatroom
|   |    ├── page.tsx                # Landing / chat entry point      
│   └── login/page.tsx          # Login page
|   ├── layout.tsx                # Main layout     
│
├── components/
│   ├── ChatView.tsx              # Message input with send + preview
│   ├── Header.tsx              # Header
│   ├── MessageBubble.tsx         # Single message renderer
│   ├── ModeToggle.tsx           # Change theme mode
│   ├── Sidebar.tsx              # List of chatroom
│
├── store/
│   ├── auth.ts                 # Zustand auth state
│   ├── chat.ts                 # Zustand chatroom state (room list / create / delete)
│   └── message.ts              # Zustand chat messages per room
│
├── hooks/
│   ├── useDebounce.ts          # Get a debounce value
│   └── useCountries.ts         # Country dial code data hook
│
├── lib/
│   ├── generateFakeReply.ts    # Return fake reply
│   ├── getCountries.ts         # Get countries
│   ├── groupByDate.ts          # Function for create a group by date
│   └── utils.ts                # Helpers (e.g., message simulation)
│
├── types/
│   └── index.ts                # TypeScript interfaces
```

## Feature Implementation Details
### 1. Form Validation
- Implemented with react-hook-form and zod
- Phone number & OTP forms validated with clear error messages

### 2. Reverse Infinite Scroll
- Chat messages render newest at the bottom
- ref attached to top sentinel for pagination
- On scroll to top, older messages load and append above

### 3. Throttling (Send on Enter)
- Enter key triggers send() function
- Shift+Enter allows newline
- Prevents multiple quick submissions with a lock & timeout

### 4. Pagination
- Simulated using batched loading in reverse scroll
- Messages are sliced and loaded incrementally
- In real apps, this would connect to backend APIs

## Contact
Feel free to reach out with any questions!

