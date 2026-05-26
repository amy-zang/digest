# 🌸 My Daily Digest

Hiiiiii! Welcome to my little corner of the internet ✨

This is a personal pet project I built entirely with **Claude Code** — as a way to explore what it feels like to have the news curated *just for you*, in a way that actually matches how you want to read it.

---

## What is this?

A daily personalized news digest that lives at **[amy-zang.github.io/digest](https://amy-zang.github.io/digest)** and refreshes itself every morning at 9am ET — even when my laptop is closed.

Every day it:
- Pulls the latest headlines from RSS feeds (BBC, NYT, CBS, TechCrunch, The Verge, Science News, WebMD, and more)
- Asks Claude to rewrite everything in clean, neutral wire-service style — no drama, no bias, just facts
- Pulls real weather data for Manhattan from Open-Meteo
- Generates outfit suggestions based on the actual forecast
- Suggests seasonal fruits, vegetables, meals, workout ideas, and supplements tailored to the time of year and my cycle
- Auto-commits the updated `index.html` to GitHub Pages via Actions

---

## Why I built this

I wanted my morning read to feel like *mine* — not an algorithmic feed, not a push notification, not 47 tabs. Just one beautiful page with everything I actually care about: world news, NYC events, tech, science discoveries, health, long reads, and the weather.

It's also my playground for testing **Claude Code** — this entire project (the UI, the workflow, the Python generator, the responsive CSS, all of it) was built through conversations with Claude Code in the terminal. No boilerplate, no scaffolding tools, just vibes and iteration.

---

## How it works

```
GitHub Actions (9am ET daily)
    └── scripts/generate_digest.py
            ├── Fetch RSS feeds (news, tech, science, health, longreads)
            ├── Fetch weather from Open-Meteo (Manhattan)
            │     ├── Current conditions + 5-hour forecast
            │     └── 7-day outlook with temperature range bars
            ├── Call Claude API (claude-sonnet-4-6)
            │     └── Generate stories, events, discoveries, health tips
            └── Inject content into index.html → git push → GitHub Pages
```

The whole thing is a **single HTML file** — React 18 + Babel running inline, no build step, no bundler, no Node. It just works.

---

## Tech stack

| Thing | What |
|---|---|
| **Frontend** | Single-file React 18 + Babel (inline JSX) |
| **Fonts** | IBM Plex Mono + JetBrains Mono |
| **Weather** | Open-Meteo API (free, no key needed) |
| **News** | RSS feeds via `feedparser` |
| **AI** | Anthropic `claude-sonnet-4-6` |
| **Automation** | GitHub Actions (scheduled cron) |
| **Hosting** | GitHub Pages |
| **Built with** | Claude Code ✨ |

---

## Sections

- **i. Top Stories** — 3 curated headlines from global/US news, neutral tone
- **Weather** — Current conditions, UV/rain/wind chips, hourly forecast, 7-day outlook with range bars, outfit suggestions
- **ii. Technology** — 3 tech stories
- **iii. Events** — NYC events + world events this week
- **iv. Health Desk** — Seasonal eating (fruits, vegs, meals), gym + yoga/pilates tips, daily & cycle-aware supplements
- **v. New Discoveries** — Science feature + 3 mini discoveries
- **Long Reads** — 3 longform pieces worth your time

---

## Running locally

```bash
# Clone and open — no install needed
open index.html
```

To regenerate content locally:

```bash
pip install -r requirements.txt
ANTHROPIC_API_KEY=sk-ant-... python scripts/generate_digest.py
```

---

## Secrets needed (GitHub Actions)

| Secret | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `NEWS_API_KEY` | Optional — [newsapi.org](https://newsapi.org) |

---

*Made with curiosity, Claude Code, and too many opinions about seasonal produce.* 🍓
