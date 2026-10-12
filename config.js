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
        hero: { label: "Live tracking", ratio: 16 / 10, src: "assets/swing/tracking.png" },
        sections: [
          {
            label: "Why I built it",
            body: [
              "I play a lot of pickleball, and I always want to know what I could do better. Not in a vague way, but in numbers. Where did the ball land? Which shots actually lost me the point?",
              "I wanted an app that records a live game and shows me exactly that."
            ]
          },
          {
            label: "The idea",
            body: [
              "Prop your phone up, tap record, play. Swing tracks the ball through the whole game and maps every shot on the court: where it landed, how fast it was, and whether it won or lost the point.",
              "Pickleball came first. Tennis was a natural second mode: same flow, different court."
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
              { title: "Progress over time",
                body: "Rating trend, win rate, streaks. A reason to open the app after the next game.",
                image: { label: "Profile", src: "assets/swing/profile.png" } },
              { title: "One tap to start",
                body: "Setup is the enemy. Pick the sport and the format, tap once, and play.",
                image: { label: "Record screen", src: "assets/swing/record.png" } },
              { title: "Where the ball went",
                body: "The ball is tracked live as you play. In or out, shot speed, shots, rallies, and dinks, called in real time.",
                image: { label: "Live tracking: out", src: "assets/swing/tracking-out.png" } },
              { title: "Stats players already use",
                body: "Winners, unforced errors, first-serve percentage, shot speed. Familiar numbers, compared with your last match.",
                image: { label: "Match analysis", src: "assets/swing/analysis.png" } },
              { title: "One thing to fix",
                body: "Instead of forty charts, Insights leads with the single biggest opportunity, a drill plan, and clips of the moments that matter.",
                image: { label: "Insights", src: "assets/swing/insights.png" } }
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
      summary: "White noise for sleep. No ads, no interruptions.",
      tags: [],
      thumb: "assets/thumbs/sleep-dojo.jpg",
      url: "https://sleepdojo.pages.dev/",
      urlLabel: "Open the prototype",

      caseStudy: {
        hero: { label: "Player screen", ratio: 16 / 10 },
        sections: [
          {
            label: "Why I built it",
            body: [
              "Noise keeps waking me up at night. White noise helps, so I leaned on YouTube videos and sleep apps. They kept showing ads, or cut out in the middle of the night.",
              "I wanted a white noise app that just plays white noise. That's it."
            ]
          },
          {
            label: "The idea",
            body: [
              "Open it, pick a sound, sleep. No ads, no feed to scroll, nothing that stops halfway through the night. Steady sound that masks the noises that wake you, and a gentle alarm in the morning."
            ]
          },
          {
            label: "Who it's for",
            body: [
              "Light sleepers. People who wake up to every car door and barking dog, and anyone whose mind won't quiet down at night."
            ]
          },
          {
            label: "Listen",
            body: [
              "Rain, with a whispered bedtime story on top. Put headphones on."
            ],
            // set src to the mixed clip (mp3/m4a) once it's ready
            audio: { title: "Rain and a whispered story", label: "Clip coming soon" }
          },
          {
            label: "What matters to users",
            features: [
              { title: "No ads, ever",
                body: "Nothing breaks the sound. No pre-rolls, no pop-ups, no upsell at 3am.",
                image: { label: "Sound library" } },
              { title: "Sound that doesn't stop",
                body: "Seamless loops that play all night, with no gaps or fades to wake you.",
                image: { label: "Player" } },
              { title: "One tap to sleep",
                body: "Pick a sound and put the phone down. A dark, quiet screen that stays out of the way.",
                image: { label: "Sleep screen" } },
              { title: "A gentle wake up",
                body: "An alarm that eases you out of sleep instead of jolting you awake.",
                image: { label: "Alarm" } }
            ]
          },
          {
            label: "Where it stands",
            body: [
              "Sleep Dojo is a working prototype you can try in the browser.",
              "Next: more soundscapes, and whispered stories layered over them."
            ]
          }
        ]
      }
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
