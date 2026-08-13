# Research Preview and IoT Paper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make collapsed research entries concise and palette-consistent, and add the IoT malware-detection work to the research archive as one completed paper.

**Architecture:** Keep the existing React archive structure and derive a normalized excerpt from each entry's `content`, with CSS line clamping controlling its collapsed height. Add the IoT paper through a reversible, idempotent Django data migration keyed by its exact title, leaving the Projects catalog unchanged.

**Tech Stack:** React 18, Create React App, Testing Library/Jest, CSS, Django 5.1, Django migrations and test runner.

## Global Constraints

- Preserve the current layout, background, typography scale, labels, and navy/teal/coral palette.
- Collapsed entries show an automatic excerpt from `content`, visually limited to three lines.
- **Read** reveals the complete content inline and **Close** collapses it.
- Keep IoT Malware Detection in Projects and add it to Research as a completed Paper in **Cybersecurity & Machine Learning**.
- Leave `pdf_url` empty until a GitHub-hosted PDF is added through Django admin.
- Do not add filters, schema fields, or broader redesign work.

---

### Task 1: Collapsed research excerpt behavior

**Files:**
- Modify: `portfolio-frontend/src/pages/Blog.test.jsx`
- Modify: `portfolio-frontend/src/researchArchive.js`
- Modify: `portfolio-frontend/src/researchArchive.test.js`
- Modify: `portfolio-frontend/src/pages/Blog.jsx`

**Interfaces:**
- Consumes: archive records whose `content` is a string and may contain paragraph breaks or repeated whitespace.
- Produces: `getContentExcerpt(content: string): string`, used only for collapsed archive text.

- [ ] **Step 1: Write failing unit and component tests**

Add to `portfolio-frontend/src/researchArchive.test.js`:

```javascript
import { getContentExcerpt } from "./researchArchive";

test("normalizes full content for a concise collapsed excerpt", () => {
  expect(getContentExcerpt("First paragraph.\n\nSecond   paragraph.")).toBe(
    "First paragraph. Second paragraph."
  );
});
```

Update the first fixture in `Blog.test.jsx` so `description` is deliberately different from `content`, then add:

```javascript
test("keeps full content hidden until Read is selected", async () => {
  const user = userEvent.setup();
  render(<Blog />);

  expect(await screen.findByText("Full proposal text.")).toBeInTheDocument();
  expect(screen.queryByText("Admin-written description.")).not.toBeInTheDocument();
  expect(screen.queryByText("Private expanded paragraph.")).not.toBeInTheDocument();

  await user.click(
    screen.getByRole("button", { name: "Read Faithfulness in Language Models" })
  );

  expect(screen.getByText(/Private expanded paragraph/)).toBeInTheDocument();
});
```

Use content `"Full proposal text.\n\nPrivate expanded paragraph."`. The collapsed excerpt assertion matches the first normalized portion, while the expanded assertion catches accidental full rendering.

- [ ] **Step 2: Run the targeted tests and verify RED**

Run:

```bash
CI=true npm test -- --runInBand src/researchArchive.test.js src/pages/Blog.test.jsx
```

Expected: FAIL because `getContentExcerpt` is absent and the component still selects `description || content`.

- [ ] **Step 3: Implement minimal excerpt derivation**

Add to `researchArchive.js`:

```javascript
export const getContentExcerpt = (content = "") =>
  content.replace(/\s+/g, " ").trim();
```

Import it in `Blog.jsx` and replace the collapsed summary expression with:

```jsx
<p className="research-entry__summary">
  {getContentExcerpt(entry.content)}
</p>
```

Do not truncate the stored string in JavaScript; CSS supplies the responsive three-line visual limit without cutting words or changing expanded content.

- [ ] **Step 4: Run targeted tests and verify GREEN**

Run the same targeted command. Expected: all targeted tests PASS with no warnings.

- [ ] **Step 5: Commit the behavior change**

```bash
git add portfolio-frontend/src/pages/Blog.jsx portfolio-frontend/src/pages/Blog.test.jsx portfolio-frontend/src/researchArchive.js portfolio-frontend/src/researchArchive.test.js
git commit -m "Fix collapsed research entry previews"
```

---

### Task 2: Palette consistency and three-line clamp

**Files:**
- Modify: `portfolio-frontend/src/pages/Blog.css`

**Interfaces:**
- Consumes: `.research-entry__summary` from Task 1.
- Produces: a three-line visual clamp and shared `--archive-muted` color token.

- [ ] **Step 1: Add the palette token and clamp**

Define `--archive-muted: #52636c;` beside the existing archive variables. Replace the one-off neutral text colors `#537078`, `#607078`, `#53656e`, and `#263b47` in archive copy with `var(--archive-muted)`.

Add to `.research-entry__summary`:

```css
display: -webkit-box;
overflow: hidden;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;
```

Keep titles and filter controls on `--archive-navy`; do not alter type/status label semantic colors.

- [ ] **Step 2: Build the production frontend**

Run:

```bash
npm run build
```

Expected: exit 0 and `Compiled successfully.`

- [ ] **Step 3: Commit the visual correction**

```bash
git add portfolio-frontend/src/pages/Blog.css
git commit -m "Align research archive preview styling"
```

---

### Task 3: Idempotent IoT paper data migration

**Files:**
- Create: `portfolio-backend/portfolio/migrations/0007_add_iot_malware_research_paper.py`
- Modify: `portfolio-backend/portfolio/tests/test_research_archive.py`

**Interfaces:**
- Consumes: historical `portfolio.BlogPost` model from migration state `0006`.
- Produces: one row titled `IoT Malware Detection: Reproducing and Improving CTU-IoT-23 Results`.

- [ ] **Step 1: Write a failing migration test**

Add a `TransactionTestCase` using `MigrationExecutor` that migrates from `0006_research_archive_fields` to `0007_add_iot_malware_research_paper`, then asserts the historical model contains exactly one matching row with:

```python
{
    "content_type": "Paper",
    "status": "Completed",
    "research_area": "Cybersecurity & Machine Learning",
    "category": "AI/ML",
    "pdf_url": "",
}
```

Also assert the content mentions `CTU-IoT-23`, `decision-tree`, `random-forest`, improved metrics, and clearer visualizations. Run the forward migration twice through the executor and assert the row count remains one.

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
../venv/bin/python manage.py test portfolio.tests.test_research_archive.IoTPaperMigrationTests -v 2
```

Expected: FAIL because migration `0007_add_iot_malware_research_paper` does not exist.

- [ ] **Step 3: Implement the reversible data migration**

Create migration `0007` depending on `0006`. Its forward function calls `get_or_create(title=TITLE, defaults={...})`; its reverse function deletes only the row with the exact title. Store this content:

```text
This paper recreates an intrusion-detection study using the CTU-IoT-23 network-traffic dataset and evaluates whether learned patterns generalize across malware scenarios and IoT devices. It compares decision-tree and random-forest classifiers, improves the reported evaluation metrics through careful preprocessing and scenario-based testing, and presents the findings with clearer interactive visualizations so model performance and error patterns are easier to interpret.
```

Use description `A reproduction and extension of CTU-IoT-23 malware-detection research with improved evaluation metrics and clearer result visualizations.`, `reading_time=8`, and an empty `pdf_url`.

- [ ] **Step 4: Run the migration test and verify GREEN**

Run the targeted Django command again. Expected: PASS.

- [ ] **Step 5: Verify migration consistency**

Run:

```bash
../venv/bin/python manage.py makemigrations --check --dry-run
```

Expected: `No changes detected`.

- [ ] **Step 6: Commit the IoT paper migration**

```bash
git add portfolio-backend/portfolio/migrations/0007_add_iot_malware_research_paper.py portfolio-backend/portfolio/tests/test_research_archive.py
git commit -m "Add IoT malware detection research paper"
```

---

### Task 4: Full verification and pull request

**Files:**
- No additional source files.

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces: a verified branch ready for review and deployment.

- [ ] **Step 1: Run complete backend verification**

```bash
../venv/bin/python manage.py test -v 2
../venv/bin/python manage.py check
../venv/bin/python manage.py makemigrations --check --dry-run
```

Expected: all tests PASS, system check reports no issues, and no model changes are detected.

- [ ] **Step 2: Run complete frontend verification**

```bash
CI=true npm test -- --runInBand
npm run build
```

Expected: all suites PASS and the production build compiles successfully.

- [ ] **Step 3: Review branch scope**

```bash
git diff --check main...HEAD
git status --short
git log --oneline main..HEAD
```

Expected: no whitespace errors, only the intentional untracked recovery/private artifacts remain, and commits match this plan.

- [ ] **Step 4: Push and open a pull request**

```bash
git push -u origin codex/research-preview-iot
gh pr create --base main --head codex/research-preview-iot --title "Refine research previews and add IoT paper" --body-file <prepared-pr-body>
```

The PR body summarizes the collapsed preview fix, palette alignment, IoT paper migration, and fresh test/build results.

---

### Task 5: Merge, deploy, and live verification

**Files:**
- User-facing data backup: `outputs/research-records-before-preview-deploy.json`

**Interfaces:**
- Consumes: an approved, conflict-free PR with passing checks.
- Produces: Render and Vercel production deployments from the merged `main` commit.

- [ ] **Step 1: Preserve current live research data**

Download `https://tfolio-backend.onrender.com/api/blog/` to the output path, parse it as JSON, record its row count and SHA-256, and do not print content bodies.

- [ ] **Step 2: Confirm merge safety and merge**

Check PR mergeability and required status checks. Merge only if conflict-free and green; otherwise stop and report the exact blocker.

- [ ] **Step 3: Monitor Render and Vercel**

Confirm Render applies migration `0007` and serves the merged commit. Confirm the Vercel production deployment for the same commit reports success.

- [ ] **Step 4: Verify live behavior and data**

Verify:

- `/api/blog/` returns HTTP 200, preserves the previous entry count, and adds exactly one IoT paper.
- The IoT entry reports Paper, Completed, Cybersecurity & Machine Learning, `has_pdf=false`, and `has_web_content=true`.
- The public archive shows a concise collapsed IoT excerpt and does not expose the complete LLM blog before **Read**.
- **Read** and **Close** work, filters include both General and Cybersecurity & Machine Learning, and the Projects page still includes IoT Malware Detection.
- Desktop and mobile archive layouts preserve the navy/teal/coral palette without overflow.

- [ ] **Step 5: Clean the completed local branch/worktree**

Fast-forward local `main`, remove only the owned feature branch/worktree after merge, and preserve all unrelated untracked recovery/private artifacts.
