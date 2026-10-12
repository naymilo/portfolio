/*
 * ════════════════════════════════════════════════
 *  SITE CONFIG — Edit this file to update your site
 * ════════════════════════════════════════════════
 *
 *  Just change the values below and refresh your browser.
 *  No build step, no server needed.
 *
 */

const CONFIG = {

  siteTitle: "Nenad M",

  nav: {
    logo: "NENAD M",
    links: [
      { label: "Work", scrollTo: "#work" },
      { label: "About", href: "about.html" }
    ]
  },

  hero: {
    headline: "Design, code and\nthings in between.",   // \n = line break
    subtext: "A multidisciplinary portfolio by Nenad M.",
    headlineLineHeight: 1.1,  // adjust to control space between lines (e.g. 0.9 tight → 1.4 loose)
    dimOpacity: 0.31          // dark overlay over the sphere (0 = none, 1 = black)
  },

  // ── PROJECTS ──
  // Each one is a row in the homepage index and gets its own page at
  // project.html?p=<slug>. Order here = order on the site.
  //   thumb:  image used for the hover preview and on phones
  //   videos: Vimeo embeds on the project page ({ id, ratio: width/height })
  //   url:    optional external link (shown as a button on the project page)

  projects: [
    {
      slug: "swing",
      title: "Swing",
      discipline: "Product",
      summary: "Match tracking and coaching for pickleball and tennis.",
      tags: ["Figma", "Prototype", "Creative coding"],
      thumb: "assets/thumbs/tennis-app.jpg",
      url: "https://pickleballtesiting.pages.dev/",
      urlLabel: "Open the prototype",

      // Case study page. Images: set `src` to a Figma export; until then a labelled placeholder shows.
      caseStudy: {
        hero: { label: "Record screen", ratio: 16 / 10 },
        sections: [
          {
            label: "Why I built it",
            body: [
              "I play a lot of pickleball, and I always want to know what I could do better. Not in a vague way — in numbers. Where did the ball land? Which shots actually lost me the point?",
              "I wanted an app that records a live game and shows me exactly that."
            ]
          },
          {
            label: "The idea",
            body: [
              "Prop your phone up, tap record, play. Swing tracks the ball through the whole game and maps every shot on the court: where it landed, how fast it was, and whether it won or lost the point.",
              "Pickleball came first. Tennis was a natural second mode — same flow, different court."
            ]
          },
          {
            label: "Who it's for",
            body: [
              "Club and rec players who play a few times a week and want to get better, but don't have a coach watching every game."
            ]
          },
          {
            label: "What matters to players",
            features: [
              { title: "One tap to start",
                body: "Setup is the enemy. Pick the sport and the format, tap once, and play.",
                image: { label: "Record screen" } },
              { title: "Where the ball went",
                body: "Every shot plotted on the court. Patterns show up fast — the backhand that keeps landing long, the serve that always goes to the middle.",
                image: { label: "Shot map" } },
              { title: "Stats players already use",
                body: "Winners, unforced errors, first-serve percentage, shot speed. Familiar numbers, compared with your last match.",
                image: { label: "Match analysis" } },
              { title: "One thing to fix",
                body: "Instead of forty charts, Insights leads with the single biggest opportunity, a drill plan, and clips of the moments that matter.",
                image: { label: "Insights" } },
              { title: "Progress over time",
                body: "Rating trend, win rate, streaks. A reason to open the app after the next game.",
                image: { label: "Profile" } }
            ]
          },
          {
            label: "Process",
            body: [
              "I started from the court, not the dashboard: shot maps first, then the screens around them."
            ],
            gallery: [
              { label: "Sketches" },
              { label: "Wireframes" },
              { label: "Final screens" }
            ]
          },
          {
            label: "Where it stands",
            body: [
              "Swing is a working prototype. Ball tracking works; the matches and stats shown here are sample data.",
              "Next: putting it in front of real players on real courts, and tightening shot detection."
            ]
          }
        ]
      }
    },
    {
      slug: "sleep-dojo",
      title: "Sleep Dojo",
      discipline: "Product",
      summary: "Your ADHD sleep companion. A white-noise sleep and alarm app.",
      tags: [],
      thumb: "assets/thumbs/sleep-dojo.jpg",
      url: "https://sleepdojo.pages.dev/",
      urlLabel: "Open the prototype"
    },
    {
      slug: "wordscapes",
      title: "Wordscapes",
      discipline: "Game UI",
      summary: "UI, Spine animation, and Unity integration work for Wordscapes.",
      tags: ["UI", "Unity", "Spine"],
      thumb: "assets/thumbs/wordscapes.jpg",
      videos: [{ id: "1013260534", ratio: 4 / 3 }]
    },
    {
      slug: "comfyui-3d",
      title: "3D asset pipeline",
      discipline: "AI tooling",
      summary: "A ComfyUI workflow that generates 3D assets in bulk.",
      tags: ["ComfyUI", "AI", "3D"],
      thumb: "assets/thumbs/comfyui-3d.jpg",
      videos: [{ id: "1130410040", ratio: 1280 / 675 }]
    },
    {
      slug: "unity-light-baking",
      title: "Light baking workflow",
      discipline: "Tech art",
      summary: "Unity tooling for mesh cloning and saving baked light maps into prefabs.",
      tags: ["Unity", "Tooling", "Lighting"],
      thumb: "assets/thumbs/unity-light-baking.jpg",
      videos: [{ id: "836761841", ratio: 16 / 9 }]
    },
    {
      slug: "unreal-environments",
      title: "Unreal environments",
      discipline: "Prototyping",
      summary: "Rapid environment prototyping in Unreal Engine.",
      tags: ["Unreal", "Environment art", "3D"],
      thumb: "assets/thumbs/unreal-environments.jpg",
      videos: [{ id: "1031729867", ratio: 16 / 9 }]
    }
  ],

  footer: {
    social: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/nenadmilo/" }
    ]
  }

};
