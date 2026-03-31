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

  siteTitle: "Studio Name",

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

    // ── Hero background ──
    // OPTION A: Direct video file (mp4/webm) — best for local or self-hosted
    //   videoUrl: "assets/my-reel.mp4",
    //
    // OPTION B: Vimeo embed — set vimeoId instead of videoUrl
    //   vimeoId: "1093012650",
    //
    // Only one is needed. If vimeoId is set, it takes priority.
    //https://vimeo.com/user85734886 - Vimeo User
    // vimeoId: "1093012650",
    videoUrl: "18069235-uhd_3840_2160_24fps.mp4",

    dimOpacity: 0.55
  },

  // ── SECTIONS ──
  // Each section appears on the homepage in order.
  // Types: "vimeo" | "cards" | "cases"
  // To add a section: copy any block below, change the values.
  // To reorder: move blocks up or down.
  // To remove: delete the block.

  sections: [
    {
      id: "video-work",
      title: "Game Dev & Tooling",
      subtitle: "Selected videos of tooling and game development",
      type: "vimeo",
      items: [
        {
          title: "Wordscapes",
          description: "UI, Spine, and Unity integration work",
          vimeoId: "1013260534",
          tags: ["UI", "Unity","Spine"]
        },
        {
          title: "AI Workflow - Comfy UI ",
          description: "3D asset generation demo for bulk processing",
          vimeoId: "1130410040",
          tags: ["Comfy UI", "AI", "3D"]
        },
        {
          title: "AI Workflow - Comfy UI ",
          description: "3D asset generation demo for bulk processing",
          vimeoId: "836761841",
          tags: ["Comfy UI", "AI", "3D"]
        },
        {
          title: "Unreal engine rapid protortping ",
          description: "Enviorment protortping",
          vimeoId: "1031729867",
          tags: ["Unreal", "Enviorment art", "3D"]
        }
      ]
    },
    // {
    //   id: "code-projects",
    //   title: "Code & Experiments",
    //   subtitle: "Open source projects and creative dev work",
    //   type: "cards",
    //   items: [
    //     {
    //       title: "Particle System",
    //       description: "WebGL particle engine with physics simulation and audio reactivity.",
    //       url: "https://github.com",
    //       tags: ["webgl", "creative-coding"]
    //     },
    //     {
    //       title: "Design Tokens CLI",
    //       description: "A CLI tool that syncs Figma tokens to CSS variables automatically.",
    //       url: "https://github.com",
    //       tags: ["tooling", "figma"]
    //     },
    //     {
    //       title: "Scroll Observatory",
    //       description: "Lightweight scroll-triggered animation library. Zero dependencies.",
    //       url: "https://github.com",
    //       tags: ["library", "animation"]
    //     }
    //   ]
    // },
    // {
    //   id: "case-studies",
    //   title: "Case Studies",
    //   subtitle: "In-depth looks at selected projects",
    //   type: "cases",
    //   items: [
    //     {
    //       title: "Reimagining Onboarding",
    //       description: "How motion design reduced drop-off by 34% for a health-tech startup.",
    //       image: "",
    //       url: "#",
    //       tags: ["ux", "motion"]
    //     },
    //     {
    //       title: "Generative Identity System",
    //       description: "A living brand that evolves — built with code, guided by design principles.",
    //       image: "",
    //       url: "#",
    //       tags: ["branding", "creative-coding"]
    //     }
    //   ]
    // },
    // {
    //   id: "prototypes",
    //   title: "Prototypes & Demos",
    //   subtitle: "Interactive experiments and proof-of-concepts",
    //   type: "cards",
    //   items: [
    //     {
    //       title: "3D Product Configurator",
    //       description: "Three.js product viewer with real-time material and lighting controls.",
    //       url: "#",
    //       tags: ["threejs", "interactive"]
    //     },
    //     {
    //       title: "Voice-Driven UI",
    //       description: "Prototype exploring voice commands for navigating complex dashboards.",
    //       url: "#",
    //       tags: ["prototype", "accessibility"]
    //     }
    //   ]
    // }
  ],

  footer: {
    tagline: "Let's make something.",
    email: "hello@studio.com",
    social: [
      { label: "LinkedIn", url: "https://linkedin.com" }
    ]
  }

};
