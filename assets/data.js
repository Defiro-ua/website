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
      id: "m1", name: "Inception", dates: "15 Sep - 29 Sep 2026", due: "2026-09-29",
      goal: "Understand what to build: vision, scope, stakeholders, key requirements and the project plan.",
      slides: "https://www.canva.com/design/DAHWUQ3PrvE/hRR0qCzSGS9mnsNoTqt9BQ/view?embed", report: "",
      calendar: [
        { ms: true, when: "15/09 - 29/09", modules: [
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
      id: "m2", name: "Elaboration", dates: "30 Sep - 13 Oct 2026", due: "2026-10-13",
      goal: "Settle the architecture and remove the biggest technical risks with a prototype.",
      slides: "", report: "",
      calendar: [
        { when: "30/09 - 06/10", modules: [
          { name: "Requirements Elicitation", tasks: [
            "Requirements gathering",
            "User stories",
            "Functional requirements",
            "Non-functional requirements",
            "Identify stakeholders & goals",
            "Map manual procedures (CMA context)",
          ] },
        ] },
        { ms: true, when: "07/10 - 13/10", modules: [
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
      id: "m3", name: "Construction", dates: "14 Oct - 3 Nov 2026", due: "2026-11-03",
      goal: "Build the core of the platform: workflow designer, lifecycle engine, forms and documents.",
      slides: "", report: "",
      calendar: [
        { when: "14/10 - 20/10", modules: [
          { name: "Workflow Designer", tasks: [
            "UML diagram import & parsing",
            "Diagram validation",
          ] },
        ] },
        { when: "21/10 - 27/10", modules: [
          { name: "Procedure & Document Lifecycle Engine", tasks: [
            "State transition engine",
            "Task assignment & deadlines",
            "Audit trail / history",
          ] },
        ] },
        { ms: true, when: "28/10 - 03/11", modules: [
          { name: "Dynamic Forms & Documents", tasks: [
            "Form generation from model",
            "Document generation & export",
            "Presentation",
          ] },
        ] },
      ],
    },
    {
      id: "m4", name: "Transition", dates: "4 Nov - 16 Dec 2026", due: "2026-12-16",
      goal: "Integrate, validate with real users and hand the platform over.",
      slides: "", report: "",
      calendar: [
        { when: "04/11 - 10/11", modules: [
          { name: "Identity & Access Integration", tasks: [
            "SSO (Entra ID) integration",
            "Role & org-unit mapping",
            "Approver delegation",
          ] },
        ] },
        { when: "11/11 - 17/11", modules: [
          { name: "Inbox, Notifications & Dashboard", tasks: [
            "Task inbox",
            "Notifications (email/in-app)",
            "Metrics & dashboard",
          ] },
        ] },
        { when: "19/11 - 24/11", modules: [
          { name: "Reimbursement Module", tasks: [
            "Request → approval → payment flow",
            "Accounting system export",
          ] },
        ] },
        { when: "25/11 - 01/12", modules: [
          { name: "Integration", tasks: [
            "Connect Designer output → Lifecycle Engine",
            "Connect Engine → Dynamic Forms",
            "End-to-end tests",
          ] },
        ] },
        { when: "02/12 - 08/12", modules: [
          { name: "Integration (continuation)", tasks: [
            "Bug fixing after testing",
            "Refine communication between modules",
          ] },
        ] },
        { ms: true, when: "09/12 - 16/12", tasks: ["Presentation", "Demo"] },
        { when: "10/02/2027 - 23/02/2027", modules: [
          { name: "Second Procedure", tasks: [
            "Model second procedure as UML diagram",
            "Validate that the diagram is correctly parsed and interpreted by the engine",
          ] },
        ] },
        { when: "24/02/2027 - 09/03/2027", modules: [
          { name: "Plug-in Architecture Validation", tasks: [
            "Confirm the platform correctly generates the procedure (forms, tasks, lifecycle) from the user-created diagram",
            "Fix any gaps in the Workflow Designer/engine exposed by this second procedure",
          ] },
        ] },
        { when: "10/03/2027 - 23/03/2027", modules: [
          { name: "Refinement", tasks: [
            "Improve integration between modules",
            "Usability improvements to the Workflow Designer (based on feedback from modeling the second procedure)",
          ] },
        ] },
        { when: "24/03/2027 - 06/04/2027", modules: [
          { name: "Performance & Stabilization", tasks: [
            "Performance optimisation",
            "Prepare environment for user testing phase",
          ] },
        ] },
        { when: "07/04/2027 - 20/04/2027", tasks: ["User testing", "Apply improvements"] },
        { when: "21/04/2027 - 04/05/2027", tasks: ["Data collection & analytics", "Stabilize final product"] },
        { when: "05/05/2027 - 18/05/2027", tasks: ["Create documentation"] },
        { when: "19/05/2027 - 01/06/2027", tasks: ["Prepare final presentation"] },
        { when: "02/06/2027 - 04/06/2027", tasks: [
          "Students@DETI",
          "Demo",
          "Poster",
          "Video",
          "Prepare technical report",
        ] },
      ],
    },
  ],

  // Written reports (reports.html). Presentations come from `milestones` above.
  reports: [
    { title: "Minute 01", ms: "M1", date: "", url: "files/Minute01.pdf" },
    { title: "Minute 02", ms: "M1", date: "", url: "files/Minute02.pdf" },
    { title: "Minute 03", ms: "M1", date: "", url: "files/Minute03.pdf" },
    { title: "Minute 04", ms: "M2", date: "", url: "files/Minute04.pdf" },
    { title: "Minute 05", ms: "M2", date: "", url: "files/Minute05.pdf" },
  ],


  team: [
    { name: "Bernardo Santos", initials: "BS", photo: "assets/team/bernardo.jpg", github: "a16166", linkedin: "https://www.linkedin.com/in/bernardo-santos-50a3a13b3" },
    { name: "Daniel Rodrigues", initials: "DR", photo: "assets/team/daniel.jpg", github: "NXS2608", linkedin: "https://www.linkedin.com/in/daniel-rodr1/" },
    { name: "Dinis Sousa", initials: "DS", photo: "assets/team/dinis.jpg", github: "dinis-sousa0", linkedin: "https://www.linkedin.com/in/dinissousa05/" },
    { name: "Duarte Candeias", initials: "DC", photo: "assets/team/candeias.jpg", github: "Candeias-ua", linkedin: "https://www.linkedin.com/in/duarte-candeias-554a85372" },
    { name: "Pedro Gonçalves", initials: "PG", photo: "assets/team/pedro.jpg", github: "pedroo-goncalves", linkedin: "https://www.linkedin.com/in/pedro-gon%C3%A7alves-a732a6429" },
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

