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
      id: "m1", name: "Inception", dates: "15 Sep – 29 Sep 2026", due: "2026-09-29",
      goal: "Understand what to build: vision, scope, stakeholders, key requirements and the project plan.",
      slides: "", report: "",
      calendar: [
        { when: "15/09 – 29/09", modules: [
          { name: "Project Planning", tasks: [
            "Project website (Duarte)",
            "GitHub organisation",
            "GitHub project",
            "State of the art and context (Pedro)",
            "Project calendar (Daniel)",
            "Presentation (Bernardo)",
          ] },
        ], deliverables: ["Project calendar", "Project website", "M1 presentation"] },
      ],
    },
    {
      id: "m2", name: "Elaboration", dates: "30 Sep – 13 Oct 2026", due: "2026-10-13",
      goal: "Settle the architecture and remove the biggest technical risks with a prototype.",
      slides: "", report: "",
      calendar: [
        { when: "30/09 – 06/10", modules: [
          { name: "Requirements Elicitation", tasks: [
            "Requirements gathering",
            "User stories",
            "Functional requirements",
            "Non-functional requirements",
            "Identify stakeholders & goals",
            "Map manual procedures (CMA context)",
          ] },
        ] },
        { when: "07/10 – 13/10", modules: [
          { name: "System Architecture & Mock-ups", tasks: [
            "Architecture design",
            "Design mockups",
            "Database diagrams",
            "Presentation",
          ] },
        ] },
      ],
    },
    {
      id: "m3", name: "Construction", dates: "14 Oct – 3 Nov 2026", due: "2026-11-03",
      goal: "Build the core of the platform: workflow designer, lifecycle engine, forms and documents.",
      slides: "", report: "",
      calendar: [
        { when: "14/10 – 20/10", modules: [
          { name: "Workflow Designer", tasks: [
            "UML diagram import & parsing",
            "Diagram validation",
          ] },
        ] },
        { when: "21/10 – 27/10", modules: [
          { name: "Procedure & Document Lifecycle Engine", tasks: [
            "State transition engine",
            "Task assignment & deadlines",
            "Audit trail / history",
          ] },
        ] },
        { when: "28/10 – 03/11", modules: [
          { name: "Dynamic Forms & Documents", tasks: [
            "Form generation from model",
            "Document generation & export",
            "Presentation",
          ] },
        ] },
      ],
    },
    {
      id: "m4", name: "Transition", dates: "4 Nov – 15 Dec 2026", due: "2026-12-15",
      goal: "Integrate, validate with real users and hand the platform over.",
      slides: "", report: "",
      calendar: [
        { when: "04/11 – 10/11", modules: [
          { name: "Identity & Access Integration", tasks: [
            "SSO (Entra ID) integration",
            "Role & org-unit mapping",
            "Approver delegation",
          ] },
          { name: "Inbox, Notifications & Dashboard", tasks: [
            "Task inbox",
            "Notifications (email/in-app)",
            "Metrics & dashboard",
          ] },
        ] },
        { when: "11/11 – 17/11", modules: [
          { name: "Integration", tasks: [
            "Connect Designer output → Lifecycle Engine",
            "Connect Engine → Dynamic Forms",
            "End-to-end smoke test with dummy procedure",
          ] },
        ] },
        { when: "19/11 – 24/11", tasks: ["User testing", "Stabilise final product"] },
        { when: "25/11 – 01/12", tasks: ["Create documentation"] },
        { when: "02/12 – 08/12", tasks: ["Prepare final presentation"] },
        { when: "09/12 – 15/12", tasks: [
          "Students@DETI: demo, poster, video",
          "Prepare technical report",
        ] },
      ],
    },
  ],

  // Written reports (reports.html). Presentations come from `milestones` above.
  reports: [
    { title: "Minute 01", ms: "M1", date: "", url: "files/Minute01.pdf" },
    { title: "Minute 02", ms: "M1", date: "", url: "files/Minute02.pdf" },
  ],


  team: [
    { name: "Duarte Candeias", initials: "DC", github: "Candeias-ua", linkedin: "https://www.linkedin.com/in/duarte-candeias-554a85372" },
    { name: "Pedro Gonçalves", initials: "PG", github: "pedroo-goncalves", linkedin: "https://www.linkedin.com/in/pedro-gon%C3%A7alves-a732a6429" },
    { name: "Daniel Rodrigues", initials: "DR", github: "NXS2608", linkedin: "https://www.linkedin.com/in/daniel-rodr1/" },
    { name: "Bernardo Santos", initials: "BS", github: "a16166", linkedin: "https://www.linkedin.com/in/bernardo-santos-50a3a13b3" },
    { name: "Dinis Sousa", initials: "DS", github: "dinis-sousa0", linkedin: "https://www.linkedin.com/in/dinissousa05/" },
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
    { what: "Minutes", tool: "Reports page of this site", when: "After each meeting" },
    { what: "Private team information", tool: "Private Drive shared with advisors and instructor", when: "Continuous" },
  ],
};

