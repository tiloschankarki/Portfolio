# Research Areas & Interests Archive Design

## Goal

Replace the portfolio's Blog presentation with a professional, intuitive research archive that can be shared with professors. The archive should present formal and developing work clearly without making visitors learn a complex interface.

## Scope

- Rename the visible `Blog` navigation and page heading to `Research Areas & Interests`.
- Preserve the existing portfolio color palette, background treatment, navigation, and overall visual identity.
- Replace the current three-column feature cards and modal with a compact chronological archive.
- Add simple research-area filters.
- Support readable web content and optional uploaded PDFs.
- Preserve all existing blog records and keep the `/blog` route working for existing links.
- Do not redesign unrelated portfolio pages.

## Archive Experience

The page uses one chronological list inspired by the approved right-hand mockup. It is an archive rather than a dashboard or a collection of promotional cards.

At the top, the page contains:

- The heading `Research Areas & Interests`
- A short introduction explaining the purpose of the archive
- A compact filter row beginning with `All`, followed by the available research areas

Each archive row contains:

- Date
- Content-type label
- Progress-status label
- Title
- Short summary
- `Read` when web content is available
- `View PDF` when a PDF is available

If both web content and a PDF are available, both actions appear. The `Read` action expands or opens the complete content within the archive page rather than forcing visitors into a separate, unfamiliar section. `View PDF` opens the uploaded document in the browser.

The archive is newest-first by default. Research-area filters update the visible list immediately without reloading the page. Search, multi-filter controls, and advanced sorting are intentionally excluded until the volume of content makes them necessary.

## Responsive Presentation

Desktop rows use a restrained editorial layout with clear alignment and subtle dividers. On small screens, the same information stacks in this order:

1. Date and labels
2. Title
3. Summary
4. Available actions

No information depends on hover. Buttons remain large enough to use comfortably on touch screens.

## Content Model

The existing Django `BlogPost` record will be extended instead of introducing a second publishing system. The user-facing name becomes research content, while the underlying model and `/api/blog/` endpoint remain compatible with existing data and links.

Each entry supports:

- `title`: required display title
- `description`: required short archive summary
- `content`: optional full web-readable content
- `content_type`: one of `Paper`, `Proposal`, `Blog`, or `Research Note`
- `status`: one of `Draft`, `In Progress`, `Completed`, or `Published`
- `research_area`: a concise filterable area name
- `created_at`: archive date, preserving existing behavior
- `reading_time`: optional estimate for web-readable content
- `pdf`: optional uploaded PDF

An entry must provide at least one readable destination: non-empty full content, a PDF, or both. Existing entries are preserved and default to the `Blog` content type. Defaults for status and research area must be chosen during migration so the deployment does not require destructive data editing.

## Django Administration

The existing Django admin remains the only authoring interface. Its research-content form will expose the new type, status, research-area, and PDF fields alongside the current title, summary, and content fields.

The admin list should make the archive easy to manage by displaying title, type, status, research area, and date. Basic filters for type, status, and research area are appropriate; a separate custom content-management interface is out of scope.

## API and Compatibility

The existing blog API response will add the new archive fields without removing current fields. Existing consumers therefore continue to receive title, description, content, category, date, and reading time.

Compatibility requirements:

- `/blog` continues to render the renamed research archive.
- `/api/blog/` continues to return the underlying collection.
- Existing blog entries remain readable after migration.
- The landing-page summary may continue consuming recent entries, but its visible wording must use the new research terminology wherever Blog is currently shown.
- A missing PDF produces no PDF action rather than a broken link.

## States and Error Handling

- While loading, show a restrained archive loading state that preserves the page layout.
- When no entries exist, show `Research work coming soon.`
- When a selected filter has no entries, explain that no work is available in that area and provide a way back to `All`.
- If the request fails, show a clear message and a retry action instead of an empty page.
- If a PDF URL is unavailable, omit `View PDF`.
- If full content is unavailable, omit `Read`.
- The interface must never present an action that leads to an empty destination.

## Visual Direction

The redesign retains the site's deep navy, warm off-white, turquoise accents, and restrained coral highlights. It reuses existing typography and background styling so the archive feels like part of the same portfolio.

The new design uses:

- Generous whitespace
- Strong title and summary hierarchy
- Thin dividers rather than large card shadows
- Compact, accessible labels
- Minimal animation limited to focus, hover, filtering, and content expansion

It does not introduce a new sidebar, unrelated navigation, glass effects, gradients, dense controls, or a different brand identity. The visual mockup's placeholder identity and sidebar are not part of the implementation.

## Testing and Verification

Backend coverage will verify:

- Existing blog records survive the migration and receive compatible defaults
- Allowed content types and statuses are enforced
- Optional PDFs serialize correctly
- Archive ordering remains deterministic
- Entries cannot expose invalid action states

Frontend coverage will verify:

- Research-area filters update the displayed entries
- Type and status labels render correctly
- `Read` appears only when content is available
- `View PDF` appears only when a PDF is available
- Both actions appear when both destinations exist
- Empty, no-results, loading, and request-failure states are understandable
- Existing `/blog` navigation remains functional

The final verification includes Django checks, migration consistency, the backend test suite, frontend tests, the production frontend build, and manual checks at desktop and mobile widths.

## Success Criteria

- A professor can understand the archive's purpose and scan current work within seconds.
- Papers, proposals, blogs, and research notes are visually distinct without clutter.
- Draft, in-progress, completed, and published work is represented professionally.
- Visitors can read content on the page, view an uploaded PDF, or use both options when available.
- Existing blog content and links continue to work.
- The portfolio's established visual identity remains intact.
- The feature stays intentionally small: one archive, one filter row, and no unnecessary library controls.
