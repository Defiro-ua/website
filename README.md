# defiro · website

Project website for **defiro**, a workflow automation platform adaptable to any scenario (PEI, Universidade de Aveiro).

Published to GitHub Pages by [`.github/workflows/pages.yml`](.github/workflows/pages.yml) (one-time setup: Settings → Pages → Source: **GitHub Actions**).

- **Pages**: `index.html`, `calendar.html`, `milestones.html#m1`…`#m4`, `reports.html`, `team.html`. Header and footer are built by `assets/site.js`.
- **Content** is in [`assets/data.js`](assets/data.js): milestones and calendar, reports, team, communication plan. Milestone text is in `milestones.html`.
- **Placeholders**: text in `[[double brackets]]` (or `<span class="ph">` in HTML) shows as a highlighted placeholder.
- **Slides / reports**: put the file in `files/` (or use an embeddable link) and set `slides` / `report` on the milestone, or `url` on a report.

Preview locally with Live Server, or `python -m http.server 8000`.
