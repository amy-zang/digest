// Amy's Daily Digest — main app

const { useState, useMemo, useEffect } = React;
const D = window.DIGEST;

function timeOfDay(hour) {
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

function formatDate(d) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// ─── Masthead ──────────────────────────────────────────────
function Masthead() {
  const dateStr = formatDate(D.date);
  return (
    <header>
      <div className="masthead">
        <div className="left">
          <span>{D.edition}</span>
          <span>{D.location}</span>
        </div>
        <div className="wordmark">
          <span className="amy">Amy's</span>{" "}
          <span className="digest-word">Daily Digest</span>
        </div>
        <div className="right">
          <span>{dateStr}</span>
          <span>Curated · 6:00 AM ET</span>
        </div>
      </div>
      <div className="submast">
        <div className="vol">
          <span>Top stories</span>
          <span>· Weather</span>
          <span>· Technology</span>
          <span>· This week</span>
          <span>· Health</span>
          <span>· Discoveries</span>
          <span>· Long reads</span>
        </div>
        <div className="weather-strip">
          <span className="dot">●</span>
          <span>{D.weatherStrip}</span>
        </div>
      </div>
    </header>
  );
}

// ─── Greeting ──────────────────────────────────────────────
function Greeting({ tod, name }) {
  return (
    <section className="greeting">
      <h1>
        Good {tod}, <span className="signature">{name}.</span>
      </h1>
      <div className="meta">
        <div><b>Today's read time</b> · about 24 minutes</div>
        <div><b>New since yesterday</b> · 14 stories</div>
        <div><b>Skipped per your filters</b> · 38</div>
        <div><b>Mood for today</b> · slow &amp; curious</div>
      </div>
    </section>
  );
}

// ─── Story ─────────────────────────────────────────────────
function Story({ s, isLead }) {
  const [read, setRead] = useState(false);
  return (
    <article className={"story" + (isLead ? " lead" : "")}>
      <div className="story-img">
        <span className="caption">[ photo · {s.caption} ]</span>
      </div>
      <div className="story-body">
        <div className="story-cat">{s.category}</div>
        <h3 className="story-headline">{s.headline}</h3>
        {s.deck && <p className="story-deck">{s.deck}</p>}
        <div className="story-meta">
          <span className="bias-pill">
            <span className="dot" /> {s.bias} bias · {s.source}
          </span>
          <span>{s.read} read</span>
          <a href={s.url}>Open source ↗</a>
          <button
            className={"read-toggle" + (read ? " on" : "")}
            onClick={() => setRead(!read)}>
            {read ? "✓ Read" : "Mark read"}
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Weather card ──────────────────────────────────────────
function WeatherCard() {
  const w = D.weather;
  return (
    <aside className="weather">
      <div className="weather-head">
        <span className="tag">Weather · forecast</span>
        <span className="place">New York · Brooklyn</span>
      </div>
      <div className="weather-now">
        <div>
          <div className="temp">{w.now}<span className="deg">°F</span></div>
          <div className="weather-cond">
            <b>{w.condition}.</b> Feels like {w.feels}°. High {w.high}, low {w.low}.
          </div>
        </div>
        <div className="sun-glyph">
          <div className="core" />
        </div>
      </div>
      <div className="weather-hours">
        {w.hours.map((h, i) =>
          <div className="hour" key={i}>
            <span className="h">{h.h}</span>
            <span className="ic">{h.ic}</span>
            <span className="t">{h.t}°</span>
          </div>
        )}
      </div>
      <div className="weather-advice">
        <div className="advice-title">What to wear / bring</div>
        <ul className="advice-list">
          {w.advice.map((a, i) =>
            <li key={i}>
              <span className="mark">{a.mark}</span>
              <span>{a.text}</span>
            </li>
          )}
        </ul>
        <div style={{
          marginTop: "12px",
          fontFamily: "var(--mono)",
          fontSize: "10px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <span>↑ Sunrise {w.sunrise}</span>
          <span>↓ Sunset {w.sunset}</span>
        </div>
      </div>
    </aside>
  );
}

// ─── Top row ───────────────────────────────────────────────
function TopRow() {
  return (
    <section className="section">
      <div className="kicker">
        <div className="label">
          <span className="num">i.</span>
          Top stories · today
        </div>
        <div className="tag">Curated from 47 sources · Lowest-bias selected</div>
      </div>
      <div className="top-row">
        <div className="stories">
          {D.topStories.map((s, i) =>
            <Story key={i} s={s} isLead={i === 0} />
          )}
        </div>
        <WeatherCard />
      </div>
    </section>
  );
}

// ─── Technology ────────────────────────────────────────────
function TechSection() {
  return (
    <section className="section">
      <div className="kicker">
        <div className="label">
          <span className="num">ii.</span>
          Technology · today
        </div>
        <div className="tag">Picked for builder / researcher interest</div>
      </div>
      <div className="tech-grid">
        {D.tech.map((t, i) =>
          <article className="tech-card" key={i}>
            <div className="tech-num">{t.num}</div>
            <h3>{t.headline}</h3>
            <p>{t.deck}</p>
            <div className="src">
              <span><a href="#">{t.source} ↗</a></span>
              <span>{t.read}</span>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

// ─── Events ────────────────────────────────────────────────
function EventList({ items }) {
  return (
    <div>
      {items.map((e, i) =>
        <div className="event" key={i}>
          <div className="event-date">
            <div className="day">{e.day}</div>
            <div className="num">{e.num}</div>
          </div>
          <div className="event-body">
            <h4>{e.title}</h4>
            <p>{e.blurb}</p>
          </div>
          <div className="event-meta">
            <div className="pin">{e.where}</div>
            <div>{e.time}</div>
            <div>{e.price}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function EventsSection() {
  const [scope, setScope] = useState("both");
  return (
    <section className="section">
      <div className="kicker">
        <div className="label">
          <span className="num">iii.</span>
          This week · next 7 days
        </div>
        <div className="scope-tabs">
          <button className={scope === "nyc" ? "on" : ""} onClick={() => setScope("nyc")}>NYC</button>
          <button className={scope === "world" ? "on" : ""} onClick={() => setScope("world")}>World</button>
          <button className={scope === "both" ? "on" : ""} onClick={() => setScope("both")}>Both</button>
        </div>
      </div>
      <div className="events-row">
        {(scope === "nyc" || scope === "both") &&
          <div className="events-col">
            <div className="events-head">
              <h2><b>New York</b> <em>— happening near you</em></h2>
              <span className="span">May 23 → 29</span>
            </div>
            <EventList items={D.nycEvents} />
          </div>
        }
        {(scope === "world" || scope === "both") &&
          <div className="events-col">
            <div className="events-head">
              <h2><b>The world</b> <em>— at a glance</em></h2>
              <span className="span">May 23 → 29</span>
            </div>
            <EventList items={D.worldEvents} />
          </div>
        }
      </div>
    </section>
  );
}

// ─── Health ────────────────────────────────────────────────
function HealthSection() {
  const h = D.health;
  const cols = [
    { ...h.eat, glyph: "e" },
    { ...h.move, glyph: "m" },
    { ...h.supps, glyph: "s" }
  ];
  return (
    <section className="section">
      <div className="kicker">
        <div className="label">
          <span className="num">iv.</span>
          The health desk · personal
        </div>
        <div className="tag">Tuned to your last 14 days · Not medical advice</div>
      </div>
      <div className="health-row">
        {cols.map((c, i) =>
          <div className="health-col" key={i}>
            <div className="icon-frame">{c.glyph}</div>
            <h3>{c.title}</h3>
            <div className="sub">{c.sub}</div>
            <p>{c.copy}</p>
            <ul className="health-list">
              {c.list.map((l, j) =>
                <li key={j}><span><b>{l.b}.</b> {l.text}</span></li>
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Discoveries + Long reads ──────────────────────────────
function DiscoveriesAndReads() {
  const d = D.discoveries;
  return (
    <section className="section">
      <div className="kicker">
        <div className="label">
          <span className="num">v.</span>
          New discoveries &amp; the long read
        </div>
        <div className="tag">Slower reading · saved for the weekend</div>
      </div>
      <div className="lower-row">
        <div className="discovery">
          <article className="feat">
            <div className="feat-img">
              <span className="caption">[ image · {d.feature.caption} ]</span>
            </div>
            <div className="feat-body">
              <div className="cat">{d.feature.cat}</div>
              <h3>{d.feature.headline}</h3>
              <p>{d.feature.deck}</p>
              <div className="src"><a href="#">{d.feature.source} ↗</a> · 8 min read</div>
            </div>
          </article>
          <div className="discovery-more">
            {d.more.map((m, i) =>
              <div className="discovery-mini" key={i}>
                <div className="field">{m.field}</div>
                <div>
                  <h4>{m.title}</h4>
                  <p>{m.deck}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="longreads">
          <div style={{
            fontFamily: "var(--mono)",
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink)",
            fontWeight: 600,
            marginBottom: "10px"
          }}>
            Saved for the weekend
          </div>
          {D.longreads.map((l, i) =>
            <article className="longread" key={i}>
              <div className={"longread-img " + l.img} />
              <div>
                <div className="longread-pub">{l.pub}</div>
                <h4>{l.headline}</h4>
                <p>{l.deck}</p>
                <div className="meta">
                  <span>{l.author}</span>
                  <span>· {l.read}</span>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Colophon ──────────────────────────────────────────────
function Colophon() {
  return (
    <footer className="colophon">
      <div>
        <b>Daily Digest</b>
        Delivered every morning at 6:00 AM ET.<br />
        Curated, never auto-generated.
      </div>
      <div className="center">
        <b>Today's edition</b>
        Vol. III · No. 142 · May 22, 2026<br />
        47 sources · 14 selections · 24 min read
      </div>
      <div className="right">
        <b>Tomorrow</b>
        Weekend edition · long reads emphasized<br />
        Markets closed Mon (Memorial Day)
      </div>
    </footer>
  );
}

// ─── Tweaks panel ──────────────────────────────────────────
const TWEAK_DEFAULTS = {
  name: "Amy",
  timeOfDay: "auto",
  accent: "#2563c4",
  theme: "paper",
  showWeatherAdvice: true
};

function Tweaks({ t, setTweak }) {
  if (!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakToggle, TweakText, TweakSelect } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Reader">
        <TweakText label="Name" value={t.name} onChange={(v) => setTweak("name", v)} />
        <TweakSelect
          label="Greeting"
          value={t.timeOfDay}
          onChange={(v) => setTweak("timeOfDay", v)}
          options={[
            { value: "auto", label: "Auto (by clock)" },
            { value: "morning", label: "Good morning" },
            { value: "afternoon", label: "Good afternoon" },
            { value: "evening", label: "Good evening" },
            { value: "night", label: "Good night" }
          ]} />
      </TweakSection>
      <TweakSection label="Paper">
        <TweakRadio
          label="Theme"
          value={t.theme}
          onChange={(v) => setTweak("theme", v)}
          options={[
            { value: "paper", label: "Paper" },
            { value: "charcoal", label: "Charcoal" }
          ]} />
        <TweakColor
          label="Accent"
          value={t.accent}
          onChange={(v) => setTweak("accent", v)}
          options={["#2563c4", "#3c8dbc", "#1f6f8b", "#5b6fb5"]} />
      </TweakSection>
      <TweakSection label="Sections">
        <TweakToggle
          label="Show weather advice list"
          value={t.showWeatherAdvice}
          onChange={(v) => setTweak("showWeatherAdvice", v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

// ─── App ───────────────────────────────────────────────────
const ACCENT_MAP = {
  "#2563c4": { accent: "#2563c4", deep: "#1a4a99" },
  "#3c8dbc": { accent: "#3c8dbc", deep: "#246a8e" },
  "#1f6f8b": { accent: "#1f6f8b", deep: "#13556e" },
  "#5b6fb5": { accent: "#5b6fb5", deep: "#3f5293" }
};

function App() {
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, () => {}];

  const tod = useMemo(() => {
    if (tweaks.timeOfDay && tweaks.timeOfDay !== "auto") return tweaks.timeOfDay;
    return timeOfDay(new Date().getHours());
  }, [tweaks.timeOfDay]);

  useEffect(() => {
    document.body.dataset.theme = tweaks.theme || "paper";
    const a = ACCENT_MAP[tweaks.accent] || ACCENT_MAP["#2563c4"];
    document.body.style.setProperty("--terracotta", a.accent);
    document.body.style.setProperty("--terracotta-deep", a.deep);
  }, [tweaks.theme, tweaks.accent]);

  useEffect(() => {
    document.body.classList.toggle("hide-weather-advice", !tweaks.showWeatherAdvice);
  }, [tweaks.showWeatherAdvice]);

  return (
    <div className="digest">
      <Masthead />
      <Greeting tod={tod} name={tweaks.name || "Amy"} />
      <TopRow />
      <TechSection />
      <EventsSection />
      <HealthSection />
      <DiscoveriesAndReads />
      <Colophon />
      <Tweaks t={tweaks} setTweak={setTweak} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
