#!/usr/bin/env python3
"""
Daily Digest generator
Fetches news (RSS + optional NewsAPI), weather (Open-Meteo), generates
content with Claude, and rewrites index.html.
"""

import os
import sys
import json
import re
import datetime
import zoneinfo
import requests
import feedparser
import anthropic

# ── Config ────────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
NEWS_API_KEY      = os.environ.get("NEWS_API_KEY", "")
ROOT_DIR          = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_PATH        = os.path.join(ROOT_DIR, "index.html")

ET    = zoneinfo.ZoneInfo("America/New_York")
NOW   = datetime.datetime.now(ET)
TODAY = NOW.date()

# ── RSS sources ───────────────────────────────────────────────────────────────
RSS_FEEDS = {
    "general": [
        "https://feeds.bbci.co.uk/news/rss.xml",
        "https://www.cbsnews.com/latest/rss/main",
        "https://abcnews.go.com/abcnews/topstories",
        "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    ],
    "world": [
        "https://feeds.bbci.co.uk/news/world/rss.xml",
        "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    ],
    "tech": [
        "https://techcrunch.com/feed/",
        "https://www.theverge.com/rss/index.xml",
        "https://feeds.arstechnica.com/arstechnica/index",
    ],
    "science": [
        "https://www.sciencenews.org/feed",
        "https://phys.org/rss-feed/",
        "https://www.newscientist.com/feed/home/?cmpid=RSS|NSNS-2012-GLOBAL|newscientist.com-GLOBAL-Feed-allcontent",
    ],
    "health": [
        "https://rss.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC",
        "https://www.health.harvard.edu/blog/feed",
    ],
    "longreads": [
        "https://www.smithsonianmag.com/rss/latest_articles/",
        "https://www.theatlantic.com/feed/all/",
        "https://feeds.nationalgeographic.com/ng/News/News_Main",
    ],
}

# ── Weather codes ─────────────────────────────────────────────────────────────
WMO_COND = {
    0:"Clear", 1:"Mostly Clear", 2:"Partly Cloudy", 3:"Overcast",
    45:"Foggy", 48:"Icy Fog",
    51:"Light Drizzle", 53:"Drizzle", 55:"Heavy Drizzle",
    61:"Light Rain", 63:"Rain", 65:"Heavy Rain",
    71:"Light Snow", 73:"Snow", 75:"Heavy Snow",
    80:"Showers", 81:"Heavy Showers", 82:"Violent Showers",
    95:"Thunderstorms", 99:"Severe Thunderstorms",
}
WMO_ICON = {
    0:"☀", 1:"🌤", 2:"⛅", 3:"☁", 45:"🌫", 48:"🌫",
    51:"🌦", 53:"🌦", 55:"🌧", 61:"🌧", 63:"🌧", 65:"🌧",
    71:"🌨", 73:"❄", 75:"❄", 80:"🌦", 81:"🌧", 82:"⛈",
    95:"⛈", 99:"⛈",
}

# ── News helpers ──────────────────────────────────────────────────────────────
def strip_html(text):
    return re.sub(r"<[^>]+>", " ", text or "").strip()

def fetch_rss(url, n=4):
    try:
        feed = feedparser.parse(url, agent="DailyDigestBot/1.0 (github.com/amy-zang/digest)")
        items = []
        for e in feed.entries[:n]:
            img = ""
            for enc in e.get("enclosures", []):
                if "image" in enc.get("type", ""):
                    img = enc.get("url", "")
                    break
            if not img and e.get("media_thumbnail"):
                img = e["media_thumbnail"][0].get("url", "")
            items.append({
                "title":     e.get("title", "").strip(),
                "summary":   strip_html(e.get("summary", e.get("description", "")))[:300],
                "link":      e.get("link", ""),
                "source":    feed.feed.get("title", ""),
                "image":     img,
                "published": e.get("published", ""),
            })
        return items
    except Exception as ex:
        print(f"    RSS error ({url}): {ex}")
        return []

def gather_rss():
    print("  Fetching RSS feeds...")
    all_news = {}
    for cat, urls in RSS_FEEDS.items():
        items = []
        for url in urls:
            items.extend(fetch_rss(url, n=3))
            if len(items) >= 8:
                break
        all_news[cat] = items[:8]
    return all_news

def gather_newsapi():
    """Fetch from NewsAPI if key is present — better source coverage + images."""
    if not NEWS_API_KEY:
        return None
    print("  Using NewsAPI...")
    headers = {"X-Api-Key": NEWS_API_KEY}
    base    = "https://newsapi.org/v2"
    result  = {}
    cats    = [("general","top-headlines?country=us&pageSize=10"),
               ("tech",   "top-headlines?country=us&category=technology&pageSize=6"),
               ("science","top-headlines?country=us&category=science&pageSize=6"),
               ("health", "top-headlines?country=us&category=health&pageSize=6")]
    for key, endpoint in cats:
        try:
            r = requests.get(f"{base}/{endpoint}", headers=headers, timeout=12)
            r.raise_for_status()
            result[key] = [
                {
                    "title":   a.get("title",""),
                    "summary": a.get("description",""),
                    "link":    a.get("url",""),
                    "source":  a.get("source",{}).get("name",""),
                    "image":   a.get("urlToImage",""),
                    "published": a.get("publishedAt",""),
                }
                for a in r.json().get("articles",[])
            ]
        except Exception as ex:
            print(f"    NewsAPI error ({key}): {ex}")
    return result if result else None

# ── Weather ───────────────────────────────────────────────────────────────────
def fetch_weather():
    print("  Fetching weather from Open-Meteo...")
    try:
        r = requests.get("https://api.open-meteo.com/v1/forecast", params={
            "latitude": 40.7484, "longitude": -73.9967,
            "current":  "temperature_2m,apparent_temperature,weather_code",
            "hourly":   "temperature_2m,weather_code",
            "daily":    "temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max",
            "temperature_unit": "fahrenheit",
            "timezone": "America/New_York",
            "forecast_days": 1,
        }, timeout=12)
        r.raise_for_status()
        d      = r.json()
        cur    = d.get("current", {})
        daily  = d.get("daily",   {})
        hourly = d.get("hourly",  {})

        code  = int(cur.get("weather_code", 0))
        temp  = round(cur.get("temperature_2m", 68))
        feels = round(cur.get("apparent_temperature", temp))
        high  = round((daily.get("temperature_2m_max") or [temp])[0])
        low   = round((daily.get("temperature_2m_min") or [temp-10])[0])
        uv    = round((daily.get("uv_index_max")        or [3])[0])

        def fmt(iso):
            t = iso.split("T")[1][:5] if "T" in iso else iso
            h, m = map(int, t.split(":"))
            p = "a" if h < 12 else "p"; h = h % 12 or 12
            return f"{h}:{m:02d}{p}"

        sunrise = fmt((daily.get("sunrise") or ["2000-01-01T06:00"])[0])
        sunset  = fmt((daily.get("sunset")  or ["2000-01-01T20:00"])[0])

        hour_temps = hourly.get("temperature_2m", [])
        hour_codes = hourly.get("weather_code",   [])
        now_h      = NOW.hour
        forecast   = []
        for label, off in [("Now",0),("+2h",2),("+5h",5),("+8h",8),("+11h",11)]:
            i = now_h + off
            t = round(hour_temps[i]) if i < len(hour_temps) else temp
            c = int(hour_codes[i])   if i < len(hour_codes)  else code
            forecast.append({"h": label, "t": t, "ic": WMO_ICON.get(c,"🌤")})

        return {
            "now": temp, "condition": WMO_COND.get(code,"Clear"),
            "feels": feels, "high": high, "low": low, "uv": uv,
            "sunrise": sunrise, "sunset": sunset,
            "hours": forecast,
        }
    except Exception as ex:
        print(f"  Weather error: {ex}")
        return {
            "now":68,"condition":"Clear","feels":68,"high":72,"low":58,"uv":4,
            "sunrise":"6:00a","sunset":"8:00p",
            "hours":[{"h":"Now","t":68,"ic":"🌤"},{"h":"+2h","t":70,"ic":"☀"},
                     {"h":"+5h","t":71,"ic":"☀"},{"h":"+8h","t":67,"ic":"⛅"},
                     {"h":"+11h","t":62,"ic":"🌙"}],
        }

# ── Claude generation ─────────────────────────────────────────────────────────
def generate_with_claude(news, weather):
    print("  Calling Claude API...")
    client   = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    date_str = TODAY.strftime("%A, %B %d, %Y")
    month_yr = TODAY.strftime("%B %Y")

    # Flatten news into a readable prompt block
    def fmt(items):
        out = []
        for item in items:
            if not item.get("title"):
                continue
            img_line = f"\n    IMG: {item['image']}" if item.get("image") else ""
            out.append(f"  • [{item['source']}] {item['title']}\n"
                       f"    {item['summary'][:220]}\n"
                       f"    URL: {item['link']}{img_line}")
        return "\n".join(out)

    news_block = ""
    for cat, items in news.items():
        if items:
            news_block += f"\n[{cat.upper()}]\n{fmt(items)}\n"

    prompt = f"""You are the editor of "Daily Digest" — a curated personal morning briefing for a reader in Manhattan, New York.

Today is {date_str}.

Manhattan weather right now:
  {weather['condition']}, {weather['now']}°F (feels {weather['feels']}°F)
  High {weather['high']}°F / Low {weather['low']}°F · UV {weather['uv']}
  Sunrise {weather['sunrise']} · Sunset {weather['sunset']}

Latest news from RSS feeds:
{news_block}

Your job: generate today's digest content as a single JSON object. Follow these rules exactly:
- topStories: exactly 3, from the general/world news. Prioritize most significant global/US stories.
- weatherAdvice: exactly 4 tips specific to today's weather ({weather['condition']}, {weather['now']}°F).
- tech: exactly 3 stories from tech news.
- nycEvents: exactly 3 — if real NYC events appear in the news, use them; otherwise suggest plausible seasonal Manhattan activities for {TODAY.strftime("%B")}.
- worldEvents: exactly 3 significant world events from today's news.
- discoveries.more: exactly 3 items from science news.
- longreads: exactly 3 from longreads/science/world feeds, preferring long-form journalism sources.
- img: if the news item listed an IMG URL, use that exact URL; otherwise "".
- Write decks in 2-3 tight sentences. Explain WHY it matters, not just what happened.
- Use real URLs from the feeds above wherever possible.

Return ONLY valid JSON — no markdown fences, no commentary:

{{
  "topStories": [
    {{"category":"Category · Type","headline":"Declarative headline.","deck":"2-3 sentence deck.","source":"Source","bias":"Center","read":"5 min","url":"https://...","img":"https://... or empty string","caption":"short caption"}}
  ],
  "weatherAdvice": [
    {{"mark":"→","text":"Practical tip for today's specific conditions."}}
  ],
  "tech": [
    {{"num":"01","headline":"Tech headline.","deck":"2-3 sentence deck.","source":"Source","read":"4 min","url":"https://...","img":""}}
  ],
  "nycEvents": [
    {{"day":"{TODAY.strftime('%a')}","num":{TODAY.day},"title":"Event","blurb":"What it is and why go.","where":"Neighborhood, Borough","time":"Time","price":"$XX+","url":""}}
  ],
  "worldEvents": [
    {{"day":"{TODAY.strftime('%a')}","num":{TODAY.day},"title":"World event","blurb":"1-2 sentence summary.","where":"City, Country","time":"Ongoing","price":"—"}}
  ],
  "health": {{
    "eat": {{"title":"On the plate","sub":"{month_yr} eating","copy":"Seasonal eating advice for {TODAY.strftime('%B')} in New York. 2-3 sentences.","list":[{{"b":"Try","text":"Tip."}},{{"b":"Limit","text":"Tip."}},{{"b":"Add","text":"Tip."}}]}},
    "move": {{"title":"Moving body","sub":"Today's recommendation","copy":"Movement advice for today's {weather['condition'].lower()}, {weather['now']}°F conditions in Manhattan. 2-3 sentences.","list":[{{"b":"Outdoor","text":"Activity."}},{{"b":"Indoor","text":"Alternative."}},{{"b":"Evening","text":"Wind-down."}}]}},
    "supps": {{"title":"Supplements","sub":"This week","copy":"Relevant wellness info for this week. 2-3 sentences.","list":[{{"b":"Priority","text":"Key supplement + timing."}},{{"b":"Consider","text":"Second rec."}},{{"b":"Note","text":"Third tip."}}]}}
  }},
  "discoveries": {{
    "feature": {{"cat":"Cover discovery · Field","headline":"Discovery headline.","deck":"2-3 sentence deck.","source":"Source","url":"https://...","img":"","caption":"caption"}},
    "more": [
      {{"field":"Field","title":"Discovery title.","deck":"1-2 sentences.","url":"https://..."}}
    ]
  }},
  "longreads": [
    {{"pub":"Publication","headline":"Longread title.","deck":"1-2 sentence tease.","author":"by Author","read":"12 min","url":"https://...","img":""}}
  ]
}}"""

    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=8192,
        messages=[{"role":"user","content":prompt}],
    )
    raw = resp.content[0].text.strip()

    # Strip markdown code fences if Claude added them
    if raw.startswith("```"):
        raw = raw[raw.find("{") : raw.rfind("}") + 1]

    try:
        return json.loads(raw)
    except json.JSONDecodeError as ex:
        print(f"  JSON parse error: {ex}")
        print(f"  Raw (first 800 chars):\n{raw[:800]}")
        raise

# ── HTML update ───────────────────────────────────────────────────────────────
def build_digest_js(digest, weather):
    """Build the const DIGEST = {...}; JavaScript block to inject into HTML."""
    t   = TODAY
    ydoy = t.timetuple().tm_yday

    weather_full = dict(weather)
    weather_full["advice"] = digest.get("weatherAdvice", [
        {"mark":"→","text":"Check the forecast before heading out."}
    ])

    sections = {
        "topStories":  digest.get("topStories",  []),
        "weather":     weather_full,
        "tech":        digest.get("tech",        []),
        "nycEvents":   digest.get("nycEvents",   []),
        "worldEvents": digest.get("worldEvents", []),
        "health":      digest.get("health",      {}),
        "discoveries": digest.get("discoveries", {}),
        "longreads":   digest.get("longreads",   []),
    }

    def jdump(obj, indent=4):
        return json.dumps(obj, indent=indent, ensure_ascii=False)

    lines = [
        f"const DIGEST = {{",
        f"  date: new Date({t.year}, {t.month - 1}, {t.day}),",
        f"  edition: \"Vol. III · No. {ydoy}\",",
        f"  location: \"Manhattan, NY\",",
        f"  weatherStrip: \"{weather['now']}°F · {weather['condition']} · UV {weather['uv']} · Manhattan\",",
        f"",
        f"  topStories: {jdump(sections['topStories'])},",
        f"",
        f"  weather: {jdump(sections['weather'])},",
        f"",
        f"  tech: {jdump(sections['tech'])},",
        f"",
        f"  nycEvents: {jdump(sections['nycEvents'])},",
        f"",
        f"  worldEvents: {jdump(sections['worldEvents'])},",
        f"",
        f"  health: {jdump(sections['health'])},",
        f"",
        f"  discoveries: {jdump(sections['discoveries'])},",
        f"",
        f"  longreads: {jdump(sections['longreads'])}",
        f"}};",
    ]
    return "\n".join(lines)

def replace_digest_in_html(new_digest_js):
    """Replace const DIGEST = {...}; in index.html using brace-depth parsing."""
    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        html = f.read()

    marker = "const DIGEST = {"
    start  = html.index(marker)
    pos    = start + len(marker) - 1   # index of the opening {

    depth      = 0
    in_str     = False
    str_char   = None
    i          = pos

    while i < len(html):
        c = html[i]
        if in_str:
            if c == "\\" and i + 1 < len(html):
                i += 2
                continue
            if c == str_char:
                in_str = False
        else:
            if c in ('"', "'", "`"):
                in_str   = True
                str_char = c
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    end = i + 1
                    if end < len(html) and html[end] == ";":
                        end += 1
                    break
        i += 1

    new_html = html[:start] + new_digest_js + html[end:]

    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(new_html)

    print(f"  Updated {INDEX_PATH}")

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    print(f"Daily Digest — {TODAY.strftime('%A, %B %d, %Y')}")
    print()

    if not ANTHROPIC_API_KEY:
        print("ERROR: ANTHROPIC_API_KEY environment variable not set.")
        sys.exit(1)

    print("Step 1 — Gathering news...")
    news = gather_newsapi() or gather_rss()

    print("Step 2 — Weather...")
    weather = fetch_weather()

    print("Step 3 — Generating with Claude...")
    digest = generate_with_claude(news, weather)

    print("Step 4 — Writing index.html...")
    digest_js = build_digest_js(digest, weather)
    replace_digest_in_html(digest_js)

    print()
    print(f"✓  Digest ready for {TODAY.strftime('%B %d, %Y')}")

if __name__ == "__main__":
    main()
