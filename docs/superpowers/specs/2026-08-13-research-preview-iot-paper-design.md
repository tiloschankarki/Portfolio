# Research Preview and IoT Paper Design

## Goal

Refine the existing Research Areas & Interests archive so collapsed entries are concise and visually consistent, while adding the IoT Malware Detection work as a research paper without removing it from Projects.

## Archive card behavior

- A collapsed entry displays an automatic excerpt derived from its full `content` field.
- The excerpt is visually limited to three lines, so long blogs and papers cannot fill the archive page before the reader chooses to open them.
- The existing **Read** action expands the complete content inline.
- The expanded action changes to **Close** and restores the concise card when selected.
- Entries with readable web content retain the inline action. Entries with a valid GitHub PDF URL retain the separate **View PDF** action.

## Visual treatment

- Preserve the current layout, background, typography scale, labels, and navy/teal/coral palette.
- Use the archive navy for titles and primary controls.
- Use one consistent muted navy-gray for dates, introductory copy, excerpts, expanded content, and neutral labels.
- Do not redesign the cards or introduce new visual elements.

## IoT Malware Detection research entry

Add the existing IoT Malware Detection work to the research archive with these values:

- Title: **IoT Malware Detection: Reproducing and Improving CTU-IoT-23 Results**
- Type: **Paper**
- Status: **Completed**
- Research area: **Cybersecurity & Machine Learning**
- Content: a concise account of reproducing a CTU-IoT-23 research approach, comparing decision-tree and random-forest models, improving evaluation metrics, and presenting results through clearer visualizations.
- PDF URL: empty until a GitHub-hosted PDF is added through Django admin.

The existing Projects entry remains unchanged. The new research entry is created through an idempotent Django data migration so it appears once in PostgreSQL and is not duplicated by later deployments. Its reverse operation preserves the research record because, without adding an ownership field, a migration-created row cannot be safely distinguished from identical user-authored content.

## Testing and release

- Add a frontend regression test proving full content is absent while collapsed, the automatic excerpt is present, and full content appears only after **Read**.
- Add a backend migration test confirming the IoT paper metadata and single-record behavior.
- Run the complete frontend and backend test suites and production frontend build.
- Merge through a pull request, deploy Render and Vercel from `main`, then verify the live archive in desktop and mobile layouts.

## Scope boundaries

- No changes to the Projects page or project record.
- No PDF is invented or uploaded.
- No broader archive redesign, new filters, or database schema changes.
