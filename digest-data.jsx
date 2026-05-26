// Amy's Daily Digest — content for Friday, May 22, 2026
// All sources, headlines, and event details are illustrative placeholders.

const DIGEST = {
  date: new Date(2026, 4, 22), // May 22, 2026
  edition: "Vol. III · No. 142",
  location: "Brooklyn, NY",
  weatherStrip: "72°F · Mostly sunny · UV 8 · AQI 41",

  topStories: [
    {
      lead: true,
      category: "Lead Story · Policy",
      headline: "Federal infrastructure bill clears second chamber after eleven-hour negotiation",
      deck: "The 412-page package directs new funding to passenger rail, bridge maintenance, and broadband expansion in rural counties — implementation begins fiscal year 2027.",
      caption: "Capitol exterior, morning",
      source: "Reuters wire",
      bias: "Center",
      read: "6 min",
      url: "#"
    },
    {
      category: "Markets",
      headline: "Energy sector leads early trading as natural-gas futures rebound",
      deck: "Analysts attribute the move to revised inventory data released overnight.",
      caption: "Trading floor",
      source: "AP Business",
      bias: "Center",
      read: "3 min",
      url: "#"
    },
    {
      category: "International",
      headline: "Climate envoys reach preliminary agreement on shipping-emissions standard",
      deck: "Forty-two nations signed onto a framework that takes effect in phases through 2032.",
      caption: "Geneva conference hall",
      source: "BBC",
      bias: "Center-Left",
      read: "4 min",
      url: "#"
    }
  ],

  weather: {
    now: 72,
    condition: "Mostly sunny",
    feels: 74,
    high: 78,
    low: 61,
    sunrise: "5:32a",
    sunset: "8:14p",
    hours: [
      { h: "Now", t: 72, ic: "☀" },
      { h: "2p",  t: 76, ic: "☀" },
      { h: "5p",  t: 78, ic: "⛅" },
      { h: "8p",  t: 68, ic: "🌤" },
      { h: "11p", t: 63, ic: "🌙" }
    ],
    advice: [
      { mark: "→", text: "Linen shirt or short sleeves — light layer for the evening (low 60s after sundown)." },
      { mark: "→", text: "Sunglasses + SPF 30 minimum. UV index hits 8 around 1pm." },
      { mark: "→", text: "Skip the umbrella. Rain holds off until Sunday afternoon." },
      { mark: "→", text: "Subway will feel warm — start the morning with cold water." }
    ]
  },

  tech: [
    {
      num: "01",
      headline: "Open-source robotics foundation releases standardized gripper-control spec",
      deck: "The 1.0 release consolidates three competing protocols and ships with reference hardware drivers in C++ and Rust.",
      source: "The Verge",
      read: "4 min"
    },
    {
      num: "02",
      headline: "Quantum-error-correction startup demonstrates 12-qubit logical block at room temperature",
      deck: "Peer review pending, but the published methodology has already prompted three replication attempts.",
      source: "IEEE Spectrum",
      read: "7 min"
    },
    {
      num: "03",
      headline: "European Commission finalizes guidance for foundation-model transparency reporting",
      deck: "Disclosure templates take effect in November and apply to any model trained with over 10^25 FLOPs.",
      source: "TechCrunch",
      read: "5 min"
    }
  ],

  nycEvents: [
    {
      day: "Sat", num: 23,
      title: "Brooklyn Botanic Garden — Peak Rose Weekend",
      blurb: "Cranford Rose Garden hits full bloom this weekend; arrive before 11am for shade and shorter lines.",
      where: "Crown Heights", time: "10a–6p", price: "$22"
    },
    {
      day: "Sun", num: 24,
      title: "Smorgasburg opens at Marsha P. Johnson State Park",
      blurb: "Eighty vendors, including six new pastry stalls. Cash-free; bring a tote — the wind off the river kicks up around 2pm.",
      where: "Williamsburg", time: "11a–6p", price: "Free entry"
    },
    {
      day: "Mon", num: 25,
      title: "Memorial Day ceremony, Intrepid Museum",
      blurb: "Veterans procession on the flight deck at 11am, followed by the museum's annual wreath-laying.",
      where: "Hell's Kitchen", time: "10a–1p", price: "Free"
    },
    {
      day: "Wed", num: 27,
      title: "MoMA after-hours: studio visits with three painters",
      blurb: "A small, ticketed walkthrough of new acquisitions led by associate curator E. Ramos.",
      where: "Midtown", time: "7p–9p", price: "$45"
    },
    {
      day: "Thu", num: 28,
      title: "Lincoln Center — Mostly Mozart preview night",
      blurb: "Open rehearsal with the orchestra; a relaxed format with a 20-minute Q&A.",
      where: "Lincoln Square", time: "7:30p", price: "Pay-what-you-wish"
    }
  ],

  worldEvents: [
    {
      day: "Sat", num: 23,
      title: "Cannes Film Festival — closing ceremony & Palme d'Or",
      blurb: "Awards announced in the late evening Paris time. Streaming via the festival's official feed.",
      where: "Cannes, FR", time: "7:15p CET", price: "Stream"
    },
    {
      day: "Mon", num: 25,
      title: "Roland-Garros opens, first round",
      blurb: "Two-week clay-court Grand Slam begins. Defending champions in both draws return.",
      where: "Paris, FR", time: "11a CET", price: "TV"
    },
    {
      day: "Tue", num: 26,
      title: "World Health Assembly plenary",
      blurb: "WHO member states convene; agenda includes pandemic-preparedness treaty progress and revised IHR.",
      where: "Geneva, CH", time: "9a CET", price: "—"
    },
    {
      day: "Wed", num: 27,
      title: "SpaceX Starship — uncrewed lunar-orbit demonstration",
      blurb: "Launch window opens 03:14 UTC. First full-stack flight following March's static-fire campaign.",
      where: "Boca Chica, TX", time: "11:14p ET", price: "Stream"
    },
    {
      day: "Fri", num: 29,
      title: "G7 finance ministers — interim communiqué",
      blurb: "Two-day pre-summit at the Italian presidency. Expect statements on critical minerals and capital flows.",
      where: "Stresa, IT", time: "5p CET", price: "—"
    }
  ],

  health: {
    eat: {
      title: "On the plate",
      sub: "Today's nudge",
      copy: "Aim for a fistful of leafy greens at lunch and a palm of slow protein. Friday's farmer's-market list at Grand Army Plaza skews toward asparagus, fava beans, and the first strawberries.",
      list: [
        { b: "Try", text: "Soft-boiled eggs over wilted spinach, lemon zest, black pepper." },
        { b: "Skip", text: "A second coffee after 2pm — it's a sleep-quality day." },
        { b: "Hydrate", text: "84 oz target with UV index 8. Add electrolytes if you walk over 7k steps." }
      ]
    },
    move: {
      title: "Moving body",
      sub: "30-minute prescription",
      copy: "Yesterday's load was light. The forecast supports an outdoor zone-2 session — Prospect Park outer loop is 3.35 miles with the wind behind you on the second half.",
      list: [
        { b: "Primary", text: "35-min easy run or brisk walk; heart rate 60–70% of max." },
        { b: "Secondary", text: "8 minutes of hip + ankle mobility before bed." },
        { b: "Recover", text: "10-min legs-up-the-wall while the kettle boils." }
      ]
    },
    supps: {
      title: "Supplements",
      sub: "What's on the counter",
      copy: "A conservative stack, tuned to the season. None of this replaces a conversation with a clinician — your annual is overdue by six weeks.",
      list: [
        { b: "Vitamin D₃", text: "2,000 IU with breakfast (fat-soluble — pair with eggs)." },
        { b: "Magnesium glycinate", text: "300 mg, 60 minutes before bed." },
        { b: "Omega-3 EPA/DHA", text: "1 g, alternating days; pause if you eat fatty fish twice this week." }
      ]
    }
  },

  discoveries: {
    feature: {
      cat: "Cover discovery · Astrophysics",
      caption: "Artist concept — JWST imaging",
      headline: "A second ring of debris found around Fomalhaut, hinting at a previously unseen planet",
      deck: "Mid-infrared imaging from JWST resolves a thin secondary belt at 95 AU, structured in a way three independent groups say is best explained by a shepherding body roughly Neptune-mass.",
      source: "Nature Astronomy"
    },
    more: [
      {
        field: "Marine biology",
        title: "Hagfish slime composition mapped at single-fiber resolution",
        deck: "Cryo-EM imaging reveals two distinct protein scaffolds previously thought to be one structure."
      },
      {
        field: "Neuroscience",
        title: "Sleep spindles show measurable role in motor-skill consolidation in adults over 60",
        deck: "A 312-participant cohort study finds an inflection point that earlier research missed."
      },
      {
        field: "Materials",
        title: "Room-temperature transparent conductor reaches 92% transmittance",
        deck: "The doped-oxide film, fabricated at atmospheric pressure, opens a path to lower-cost OLED substrates."
      }
    ]
  },

  longreads: [
    {
      pub: "National Geographic",
      img: "a",
      headline: "The last river dolphins of the Mekong — and the families who count them",
      deck: "A monsoon-season dispatch from Kratie, where conservation has become a quiet civic ritual.",
      author: "by Elena Marchetti",
      read: "18 min"
    },
    {
      pub: "Time",
      img: "b",
      headline: "The teacher who turned a public-school cafeteria into a fermentation lab",
      deck: "How a Queens elementary school traded plastic-wrapped sides for live-culture sauerkraut — and what the kids think.",
      author: "by Jordan Pak",
      read: "12 min"
    },
    {
      pub: "The Atlantic",
      img: "c",
      headline: "Against the hour — a brief defense of the long meal",
      deck: "On lingering, and what gets restored when we let the plates sit a while longer.",
      author: "by H. Okafor",
      read: "9 min"
    },
    {
      pub: "Smithsonian",
      img: "d",
      headline: "How a forgotten cartographer mapped New York Harbor twice — once underwater",
      deck: "The 19th-century surveys that built the modern port, retraced with sonar and notebook.",
      author: "by R. Stein",
      read: "14 min"
    }
  ]
};

window.DIGEST = DIGEST;
