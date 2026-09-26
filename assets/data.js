/*
 * All site content lives here so the team can update it without touching the layout.
 *
 * Placeholders: wrap any text in [[double brackets]] and it renders as a highlighted
 * placeholder on the site. Search this file for "[[" to find everything still to fill in.
 */

window.DEFIRO = {
  // One entry per OpenUP milestone. `slides` / `report`: link to a file in files/ or an
  // embeddable URL (Google Slides "publish to web", OneDrive embed, PDF…). Empty = not yet published.
  milestones: [
    {
      id: "m1", name: "Inception", dates: "Oct 2026", due: "[[2026-10-28?]]",
      goal: "Understand what to build: vision, scope, stakeholders, key requirements and the project plan.",
      slides: "", report: "",
      calendar: [
        { when: "[[01/10 – 14/10]]", tasks: [
          "Project website (Duarte)",
          "GitHub organisation and repository (Dinis)",
          "Stakeholder interviews (Everyone)",
          "State of the art and related work (Bernardo, [[+1?]])",
        ] },
        { when: "[[15/10 – 28/10]]", tasks: [
          "Requirements, actors and use cases (Everyone)",
          "Project calendar and communication plan (Duarte)",
          "User stories ([[who?]])",
          "M1 presentation (Everyone)",
        ] },
      ],
    },
    {
      id: "m2", name: "Elaboration", dates: "Early Nov 2026", due: "[[date TBD]]",
      goal: "Settle the architecture and remove the biggest technical risks with a prototype.",
      slides: "", report: "",
      calendar: [
        { when: "[[01/11 – 14/11]]", tasks: [
          "System architecture (Pedro, Dinis)",
          "Supported UML subset and its mapping to states (Bernardo)",
          "Wireframes and mockups (Duarte)",
          "Entra ID sign-in spike (Daniel)",
          "M2 presentation (Everyone)",
        ] },
      ],
    },
    {
      id: "m3", name: "Construction", dates: "Mid Nov 2026 – Mar 2027", due: "[[date TBD]]",
      goal: "Build in iterations: an MVP in December, then the full platform and a second workflow.",
      slides: "", report: "",
      calendar: [
        { when: "[[15/11 – 18/12]]", tasks: [
          "MVP: workflow engine (Pedro)",
          "MVP: Entra ID single sign-on (Daniel)",
          "MVP: task inbox (Duarte)",
          "CI/CD and environments (Dinis)",
          "First workflow running end to end (Everyone)",
        ] },
        { when: "[[Jan – Feb]]", tasks: [
          "Visual workflow designer (Bernardo)",
          "Generated forms and documents (Bernardo, Pedro)",
          "Notifications and dashboard (Duarte)",
          "Export to accounting (Daniel)",
        ] },
        { when: "[[March]]", tasks: [
          "Second workflow built only in the designer (Everyone)",
          "Usability and performance (Everyone)",
          "M3 presentation (Everyone)",
        ] },
      ],
    },
    {
      id: "m4", name: "Transition", dates: "Apr – May 2027", due: "[[date TBD]]",
      goal: "Validate with real users, deploy and hand the platform over.",
      slides: "", report: "",
      calendar: [
        { when: "[[April]]", tasks: [
          "Unit, integration and acceptance tests (Dinis)",
          "User testing (Everyone)",
          "Apply improvements (Everyone)",
        ] },
        { when: "[[May]]", tasks: [
          "Deployment (Dinis)",
          "Documentation and training material (Everyone)",
          "Final report and presentation (Everyone)",
          "Students@DETI: demo, poster, video [[date]]",
        ] },
      ],
    },
  ],

  // Written reports (reports.html). Presentations come from `milestones` above.
  reports: [
    { title: "Project proposal", ms: "M1", date: "2026-09-24", url: "" },
    { title: "Project calendar & communication plan", ms: "M1", date: "[[2026-10-28?]]", url: "" },
    { title: "Vision & requirements", ms: "M1", date: "[[date TBD]]", url: "" },
    { title: "Architecture & design", ms: "M2", date: "[[date TBD]]", url: "" },
    { title: "Test & validation report", ms: "M4", date: "[[date TBD]]", url: "" },
    { title: "Final report", ms: "M4", date: "[[date TBD]]", url: "" },
  ],

  // Roles are a proposal; confirm with the team. Activities: newest first.
  team: [
    { name: "Duarte Candeias", initials: "DC", role: "Team Leader · Frontend & UX", github: "Candeias-ua", linkedin: "",
      activities: ["Project website", "Project calendar and communication plan", "Task inbox and dashboard"] },
    { name: "Pedro Gonçalves", initials: "PG", role: "Workflow Engine · Backend", github: "", linkedin: "",
      activities: ["System architecture", "Workflow engine", "Generated documents"] },
    { name: "Daniel Rodrigues", initials: "DR", role: "Identity & Integrations", github: "", linkedin: "",
      activities: ["Entra ID single sign-on", "Roles and delegation", "Export to accounting"] },
    { name: "Bernardo Santos", initials: "BS", role: "Workflow Designer · Modelling", github: "", linkedin: "",
      activities: ["State of the art", "UML subset and mapping", "Visual workflow designer", "Generated forms"] },
    { name: "Dinis Sousa", initials: "DS", role: "DevOps & Quality", github: "", linkedin: "",
      activities: ["GitHub organisation", "CI/CD", "Testing strategy", "Deployment"] },
  ],

  advisors: [
    { name: "Osvaldo Pacheco", url: "https://www.ua.pt/pt/p/10313442" },
    { name: "Daniel Ferreira", url: "https://www.ua.pt/pt/p/80653922" },
  ],

  // Communication plan (shown on the M1 page).
  channels: [
    { what: "Team chat", tool: "[[Discord / WhatsApp]]", when: "Daily" },
    { what: "Team meeting", tool: "[[in person / online]]", when: "[[weekly, day & time]]" },
    { what: "Advisor meeting", tool: "[[room / Teams]]", when: "[[every 2 weeks?]]" },
        { what: "Tasks", tool: "GitHub Projects [[confirm]]", when: "Continuous" },
    { what: "Code & docs", tool: "GitHub", when: "Continuous" },
    { what: "Minutes & private info", tool: "Team area of this site", when: "After each meeting" },
  ],
};
