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
    headline: "Creative work across game development, tooling & design",
    subtext: "A multi-disciplinary portfolio",
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
    },
    {
      slug: "swing",
      title: "Swing",
      discipline: "Product",
      summary: "A tennis and pickleball app. One tap to start tracking a match.",
      tags: ["Figma", "Prototype", "Creative coding"],
      thumb: "assets/thumbs/tennis-app.jpg",
      url: "https://pickleballtesiting.pages.dev/",
      urlLabel: "Open the prototype"
    }
  ],

  footer: {
    social: [
      // { label: "LinkedIn", url: "https://www.linkedin.com/in/<your-handle>/" }
    ]
  }

};
