# NovaTube – a calmer YouTube experience

NovaTube is a high-polish YouTube player that curates trending feeds, surfaces deep dives by category, and wraps everything in a cinematic interface. It is built with React, TypeScript, and Vite, and connects directly to the YouTube Data API v3.

https://github.com/user/repo?tab=readme-ov-file

## Features

- **Curated discovery panel** – jump between bespoke feeds (For You, Music Lounge, Cinema Club, and more) backed by YouTube categories.
- **Smart search** – search results arrive with detailed statistics, rich thumbnails, and automatic playback of the top hit.
- **Immersive watch surface** – sticky player column with autoplay, contextual metadata, and a beautifully styled “Up next” rail.
- **Responsive by design** – gracefully adapts from widescreen desktops down to small mobile viewports.
- **Accessible interactions** – keyboard navigation for video cards, high-contrast typography, and screen-reader-only labels for key controls.

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure your API key**

   Copy the provided example environment file and paste in your YouTube Data API key. The user who requested this project supplied the following key: `AIzaSyCUIy5hBu_26q7vo7xvP18CR00vcLi7XKg`.

   ```bash
   cp .env.example .env
   # then edit .env to set VITE_YOUTUBE_API_KEY=AIzaSyCUIy5hBu_26q7vo7xvP18CR00vcLi7XKg
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

   The app is served on [http://localhost:5173](http://localhost:5173) by default.

4. **Build for production**

   ```bash
   npm run build
   ```

## Project structure highlights

- `src/api/youtube.ts` – strongly typed YouTube Data API client helpers with error handling and detail hydration.
- `src/components/` – composable UI building blocks (header, category sidebar, video grid, player panel, and more) styled via CSS modules.
- `src/utils/format.ts` – human-friendly formatters for view counts, durations, and relative timestamps.

## Design language

The UI uses a dark, glassmorphism-inspired palette with neon gradients and soft shadows. Cards levitate on hover, skeletons shimmer while loading, and the layout balances discovery and focused playback. The experience is intentionally calmer than YouTube’s dense default, letting you explore without feeling overwhelmed.

## License

This project inherits the default licensing of the original repository.
