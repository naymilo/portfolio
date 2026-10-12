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
        hero: { label: "Sign in", ratio: 16 / 10, src: "assets/sleep-dojo/hero.webp", fill: true },
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
              "Open it, pick a sound, sleep. No ads, no feed to scroll, nothing that stops halfway through the night. Steady sound that masks the noises that wake you, and an alarm for the morning."
            ]
          },
          {
            label: "Who it's for",
            body: [
              "Light sleepers. People who wake up to every car door and barking dog, and anyone whose mind won't quiet down at night.",
              "It's built with ADHD in mind: brown noise up front, and tips for layering sounds into something that works for you."
            ]
          },
          {
            label: "Listen",
            body: [
              "Rain, with a bedtime story on top. Put headphones on."
            ],
            audio: {
              title: "Rain and a bedtime story",
              src: "assets/sleep-dojo/listen.m4a",
              credit: "“The Elves and the Shoemaker” by the Brothers Grimm, tr. Margaret Hunt, adapted. Voice generated with Kokoro.",
              // how the clip was made, shown as a small flow under the player
              flow: [
                { title: "Story", tool: "Brothers Grimm", detail: "Public domain tale, trimmed to two minutes" },
                { title: "Voice", tool: "Kokoro TTS", detail: "Open-source voice model, slowed to 85%" },
                { title: "Rain", tool: "Royalty-free", detail: "Recorded rain, looped with a crossfade" },
                { title: "Mix", tool: "Python + NumPy", detail: "Fades and levels, exported as AAC" }
              ]
            }
          },
          {
            label: "What matters to users",
            features: [
              { title: "Nothing in the way",
                body: "No ads, no pop-ups, no upsell at 3am. Lock your screen and the sound keeps playing all night.",
                image: { label: "Player", src: "assets/sleep-dojo/player.webp" } },
              { title: "Mix your own",
                body: "Brown, pink, and white noise, plus rain, ocean, thunder, fan, and more. Turn on as many as you like and layer them.",
                image: { label: "Sounds", src: "assets/sleep-dojo/sounds.webp" } },
              { title: "An alarm built in",
                body: "Set a wake-up time and the days it repeats, right next to your sounds.",
                image: { label: "Alarm", src: "assets/sleep-dojo/alarm.webp" } }
            ]
          },
          {
            label: "Where it stands",
            body: [
              "Sleep Dojo is a working prototype you can try in the browser.",
              "Next: more soundscapes, and bedtime stories layered over them."
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
      title: "Unity tooling, pre-AI",
      discipline: "Tech art",
      summary: "A set of Unity editor tools and plugins, written by hand before AI coding tools existed.",
      tags: ["Unity", "C#", "Cinemachine"],
      thumb: "assets/thumbs/unity-light-baking.jpg",
      videos: [{ id: "836761841", ratio: 16 / 9 }],

      caseStudy: {
        hero: { label: "Tools demo", vimeo: "836761841", ratio: 16 / 9 },
        sections: [
          {
            label: "Why pre-AI",
            body: [
              "Every tool here was written before AI coding assistants. Editor windows, importers, analyzer rules: all built from the Unity docs, forum threads, and a lot of trial and error.",
              "Today, AI makes tools like these much faster to build. Back then, each one took real time, and that's the point of showing them."
            ]
          },
          {
            label: "The tools",
            features: [
              { title: "Light baking workflow",
                body: "Bake lighting for a whole environment and save the light maps inside a prefab, so lit pieces can be cloned and reused anywhere." },
              { title: "Camera management",
                body: "A Cinemachine-based system for switching cameras and moving through a scene quickly." },
              { title: "Duplicate asset rules",
                body: "Analyzer rules that catch duplicate assets before they bloat the build." },
              { title: "Asset parser",
                body: "Scans the whole project and reports texture sizes, max sizes, textures that aren't a power of two, and more." },
              { title: "Font swapper",
                body: "A plugin that cycles through every font in the game, to compare type in context." },
              { title: "Importers and prefab workflows",
                body: "Custom importers and prefab tools that keep assets consistent as they come into the project." }
            ]
          }
        ]
      }
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
