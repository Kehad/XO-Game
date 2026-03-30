# XO Game (Multiplayer Tic-Tac-Toe)

A sleek, modern, neon-themed Tic-Tac-Toe game built with Next.js, React, Tailwind CSS, and Socket.io. Features both offline (local multiplayer and AI) and real-time online multiplayer formats.

## Features

- **Neon Aesthetic**: Beautiful glowing UI using Tailwind CSS with immersive transitions.
- **Game Modes**:
  - **Play vs AI**: Challenge an intelligent computer opponent with multiple difficulty levels.
  - **Local Multiplayer**: Play with a friend on the same device.
  - **Online Multiplayer**: Real-time multiplayer over the internet powered by Socket.io.
- **Custom Player Names**: Optionally enter names to personalize the match.
- **Score Tracking**: Automatic win/loss/draw tracking during your session.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks (`useState`, `useEffect`)
- **Real-time Communication**: [Socket.io](https://socket.io/) (via custom Next.js server setup)
- **Deployment Ready**: Easy to deploy to platforms like Vercel or custom Node servers.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or Wait! For Socket.io to work correctly you might need to run the custom server:
npm run server 
# if a custom server file like server.js exists
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
