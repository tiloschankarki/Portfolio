# Research Areas & Interests Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Blog card grid with a compact, filterable research archive that preserves existing content and supports inline reading plus optional PDFs.

**Architecture:** Extend the existing `BlogPost` model and `/api/blog/` endpoint so deployed data and old links remain compatible. Keep presentation logic in a focused React archive component, keep filtering/action decisions in pure helper functions, and retain the existing site shell and palette.

**Tech Stack:** Django 5, Django REST Framework, PostgreSQL/SQLite, React 18, React Router, Tailwind CSS, Jest, React Testing Library

## Global Constraints

- Preserve the existing deep navy `#011627`, warm off-white `#FDFFFC`, turquoise `#41EAD4`, and restrained coral `#F71735` palette.
- Keep `/blog` and `/api/blog/` working; rename only the visible experience to `Research Areas & Interests`.
- Preserve every existing blog record and migrate it to content type `Blog`, status `Completed`, and research area `General` when no more specific value exists.
- Allowed content types are exactly `Paper`, `Proposal`, `Blog`, and `Research Note`.
- Allowed statuses are exactly `Draft`, `In Progress`, `Completed`, and `Published`.
- Show `Read` only for non-empty web content and `View PDF` only for an uploaded PDF.
- Do not add search, advanced sorting, multiple simultaneous filters, a new sidebar, or a custom content-management interface.
- Keep private keys, database backups, recovered fixtures, local environment files, and uploaded production data out of Git.

---

## File Map

- `portfolio-backend/portfolio/models/blog.py`: archive choices, fields, PDF validation, and readable-destination validation.
- `portfolio-backend/portfolio/migrations/0006_research_archive_fields.py`: additive schema and safe defaults for existing rows.
- `portfolio-backend/portfolio/admin.py`: research-oriented Django admin list, filters, and field organization.
- `portfolio-backend/portfolio/serializers.py`: stable API field output and absolute PDF URL.
- `portfolio-backend/portfolio/views.py`: deterministic archive ordering; existing endpoint names remain unchanged.
- `portfolio-backend/portfolio/tests/test_research_archive.py`: model, migration-default, API, ordering, and action-state coverage.
- `portfolio-frontend/src/researchArchive.js`: pure filter and action helpers.
- `portfolio-frontend/src/researchArchive.test.js`: helper behavior coverage.
- `portfolio-frontend/src/pages/Blog.jsx`: archive loading, filtering, rows, inline reader, PDF actions, empty/error states.
- `portfolio-frontend/src/pages/Blog.test.jsx`: user-visible archive behavior.
- `portfolio-frontend/src/pages/Blog.css`: focused archive layout and responsive styling using the existing palette.
- `portfolio-frontend/src/App.jsx`: visible navigation label while retaining `/blog`.
- `portfolio-frontend/src/setupTests.js`: Jest DOM matchers.
- `portfolio-frontend/package.json` and `portfolio-frontend/package-lock.json`: explicit React Testing Library dependencies.

---

### Task 1: Extend the Research Content Model Safely

**Files:**
- Modify: `portfolio-backend/portfolio/models/blog.py`
- Create: `portfolio-backend/portfolio/migrations/0006_research_archive_fields.py`
- Create: `portfolio-backend/portfolio/tests/test_research_archive.py`

**Interfaces:**
- Produces: `BlogPost.CONTENT_TYPES`, `BlogPost.STATUSES`, `BlogPost.content_type`, `BlogPost.status`, `BlogPost.research_area`, and `BlogPost.pdf`.
- Produces: `BlogPost.has_web_content: bool` and `BlogPost.has_pdf: bool` properties for serializers and admin.
- Preserves: existing `title`, `description`, `content`, `category`, `created_at`, and `reading_time` fields.

- [ ] **Step 1: Write failing model tests**

Add tests that assert the four exact choices, safe defaults, optional content/PDF behavior, PDF extension validation, and the rule that at least one readable destination must exist:

```python
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from portfolio.models.blog import BlogPost


class ResearchArchiveModelTests(TestCase):
    def test_archive_defaults_preserve_existing_blog_semantics(self):
        post = BlogPost(title="Existing entry", content="Original body")
        post.full_clean()
        self.assertEqual(post.content_type, "Blog")
        self.assertEqual(post.status, "Completed")
        self.assertEqual(post.research_area, "General")

    def test_entry_requires_content_or_pdf(self):
        post = BlogPost(title="Empty", description="Summary", content="")
        with self.assertRaisesMessage(ValidationError, "content or a PDF"):
            post.full_clean()

    def test_pdf_can_be_the_only_readable_destination(self):
        post = BlogPost(
            title="Formal proposal",
            description="A proposal summary",
            content="",
            content_type="Proposal",
            status="Draft",
            research_area="Trustworthy AI",
            pdf=SimpleUploadedFile("proposal.pdf", b"%PDF-1.4"),
        )
        post.full_clean()
        self.assertFalse(post.has_web_content)
        self.assertTrue(post.has_pdf)

    def test_non_pdf_upload_is_rejected(self):
        post = BlogPost(
            title="Bad file",
            description="Invalid attachment",
            content="",
            pdf=SimpleUploadedFile("notes.txt", b"notes"),
        )
        with self.assertRaises(ValidationError):
            post.full_clean()
```

- [ ] **Step 2: Run the model tests and confirm they fail**

Run:

```bash
cd portfolio-backend
DATABASE_URL=sqlite:////private/tmp/tfolio-research-test.sqlite3 ../venv/bin/python manage.py test portfolio.tests.test_research_archive.ResearchArchiveModelTests -v 2
```

Expected: failures because the research archive fields and properties do not exist.

- [ ] **Step 3: Implement the model fields and validation**

Use constants so later admin and tests share the same exact values:

```python
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models


class BlogPost(models.Model):
    CONTENT_TYPES = (
        ("Paper", "Paper"),
        ("Proposal", "Proposal"),
        ("Blog", "Blog"),
        ("Research Note", "Research Note"),
    )
    STATUSES = (
        ("Draft", "Draft"),
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
        ("Published", "Published"),
    )

    # Keep the existing fields; change only content to blank=True.
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES, default="Blog")
    status = models.CharField(max_length=20, choices=STATUSES, default="Completed")
    research_area = models.CharField(max_length=120, default="General")
    pdf = models.FileField(
        upload_to="research_pdfs/",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(["pdf"])],
    )

    @property
    def has_web_content(self):
        return bool(self.content and self.content.strip())

    @property
    def has_pdf(self):
        return bool(self.pdf)

    def clean(self):
        super().clean()
        if not self.has_web_content and not self.has_pdf:
            raise ValidationError("A research entry requires web content or a PDF.")
```

- [ ] **Step 4: Generate and inspect the migration**

Run:

```bash
cd portfolio-backend
DATABASE_URL=sqlite:////private/tmp/tfolio-research-test.sqlite3 ../venv/bin/python manage.py makemigrations portfolio --name research_archive_fields
```

Confirm migration `0006_research_archive_fields.py` adds all four fields, alters `content` to `blank=True`, uses `Blog`/`Completed`/`General` defaults, and contains no deletion or rename operation.

- [ ] **Step 5: Run the model tests and migration check**

Run:

```bash
cd portfolio-backend
DATABASE_URL=sqlite:////private/tmp/tfolio-research-test.sqlite3 ../venv/bin/python manage.py test portfolio.tests.test_research_archive.ResearchArchiveModelTests -v 2
DATABASE_URL=sqlite:////private/tmp/tfolio-research-test.sqlite3 ../venv/bin/python manage.py makemigrations --check --dry-run
```

Expected: model tests pass and Django reports `No changes detected`.

- [ ] **Step 6: Commit the model and migration**

```bash
git add portfolio-backend/portfolio/models/blog.py portfolio-backend/portfolio/migrations/0006_research_archive_fields.py portfolio-backend/portfolio/tests/test_research_archive.py
git commit -m "Add research archive content fields"
```

---

### Task 2: Expose and Manage Archive Metadata

**Files:**
- Modify: `portfolio-backend/portfolio/admin.py`
- Modify: `portfolio-backend/portfolio/serializers.py`
- Modify: `portfolio-backend/portfolio/views.py`
- Modify: `portfolio-backend/portfolio/tests/test_research_archive.py`

**Interfaces:**
- Consumes: `BlogPost` fields and properties from Task 1.
- Produces: `/api/blog/` objects containing existing fields plus `content_type`, `status`, `research_area`, `pdf_url`, `has_web_content`, and `has_pdf`.
- Preserves: `get_blog_posts`, `/api/blog/`, and the homepage response key `blogs`.

- [ ] **Step 1: Write failing API and ordering tests**

Add tests using DRF's `APIClient`:

```python
from django.test import override_settings
from rest_framework.test import APIClient


class ResearchArchiveApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_keeps_newest_first_and_exposes_action_flags(self):
        older = BlogPost.objects.create(
            title="Older note", description="Older", content="Readable",
            content_type="Research Note", status="Completed",
            research_area="Data Systems",
        )
        newer = BlogPost.objects.create(
            title="New proposal", description="Newer", content="Draft body",
            content_type="Proposal", status="In Progress",
            research_area="Trustworthy AI",
        )
        BlogPost.objects.filter(pk=older.pk).update(created_at="2025-01-01T00:00:00Z")

        response = self.client.get("/api/blog/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["id"], newer.id)
        self.assertEqual(response.data[0]["content_type"], "Proposal")
        self.assertTrue(response.data[0]["has_web_content"])
        self.assertFalse(response.data[0]["has_pdf"])
        self.assertIsNone(response.data[0]["pdf_url"])

    def test_api_keeps_legacy_fields(self):
        BlogPost.objects.create(title="Legacy", description="Summary", content="Body")
        payload = self.client.get("/api/blog/").data[0]
        for field in ("title", "description", "content", "category", "created_at", "reading_time"):
            self.assertIn(field, payload)
```

- [ ] **Step 2: Run the API tests and confirm failure**

Run:

```bash
cd portfolio-backend
DATABASE_URL=sqlite:////private/tmp/tfolio-research-test.sqlite3 ../venv/bin/python manage.py test portfolio.tests.test_research_archive.ResearchArchiveApiTests -v 2
```

Expected: failure because the serializer does not expose computed action fields or `pdf_url`.

- [ ] **Step 3: Implement the serializer contract**

Define explicit computed fields while retaining all model fields:

```python
class BlogPostSerializer(serializers.ModelSerializer):
    pdf_url = serializers.SerializerMethodField()
    has_web_content = serializers.ReadOnlyField()
    has_pdf = serializers.ReadOnlyField()

    class Meta:
        model = BlogPost
        fields = "__all__"

    def get_pdf_url(self, obj):
        if not obj.pdf:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(obj.pdf.url) if request else obj.pdf.url
```

Pass `context={"request": request}` from `get_blog_posts` and preserve newest-first ordering using `order_by("-created_at", "-id")` for deterministic ties.

- [ ] **Step 4: Replace the generic admin registration**

Register a focused admin class:

```python
@admin.register(BlogPost)
class ResearchEntryAdmin(admin.ModelAdmin):
    list_display = ("title", "content_type", "status", "research_area", "created_at")
    list_filter = ("content_type", "status", "research_area")
    search_fields = ("title", "description", "content")
    readonly_fields = ("created_at",)
    fieldsets = (
        ("Research entry", {"fields": ("title", "description", "research_area")}),
        ("Classification", {"fields": ("content_type", "status")}),
        ("Reading options", {"fields": ("content", "reading_time", "pdf")}),
        ("Legacy metadata", {"fields": ("category",), "classes": ("collapse",)}),
        ("Dates", {"fields": ("created_at",)}),
    )
```

Remove the previous `admin.site.register(BlogPost)` line to avoid duplicate registration.

- [ ] **Step 5: Run backend archive tests and Django checks**

Run:

```bash
cd portfolio-backend
DATABASE_URL=sqlite:////private/tmp/tfolio-research-test.sqlite3 ../venv/bin/python manage.py test portfolio.tests.test_research_archive -v 2
DATABASE_URL=sqlite:////private/tmp/tfolio-research-test.sqlite3 ../venv/bin/python manage.py check
```

Expected: all archive tests pass and the system check reports no issues.

- [ ] **Step 6: Commit API and admin behavior**

```bash
git add portfolio-backend/portfolio/admin.py portfolio-backend/portfolio/serializers.py portfolio-backend/portfolio/views.py portfolio-backend/portfolio/tests/test_research_archive.py
git commit -m "Expose research archive metadata"
```

---

### Task 3: Add Tested Frontend Archive Helpers

**Files:**
- Create: `portfolio-frontend/src/researchArchive.js`
- Create: `portfolio-frontend/src/researchArchive.test.js`

**Interfaces:**
- Produces: `ALL_AREAS = "All"`.
- Produces: `getResearchAreas(entries: ResearchEntry[]): string[]` with `All` first and remaining areas alphabetized.
- Produces: `filterResearchEntries(entries: ResearchEntry[], area: string): ResearchEntry[]`.
- Produces: `getEntryActions(entry: ResearchEntry): { canRead: boolean, canViewPdf: boolean }`.

- [ ] **Step 1: Write failing helper tests**

```javascript
import {
  ALL_AREAS,
  filterResearchEntries,
  getEntryActions,
  getResearchAreas,
} from "./researchArchive";

const entries = [
  { id: 1, research_area: "Trustworthy AI", content: "Body", pdf_url: null },
  { id: 2, research_area: "Cybersecurity", content: "", pdf_url: "https://example.test/paper.pdf" },
  { id: 3, research_area: "Trustworthy AI", content: "  ", pdf_url: null },
];

test("builds a compact alphabetized research-area filter list", () => {
  expect(getResearchAreas(entries)).toEqual([
    ALL_AREAS,
    "Cybersecurity",
    "Trustworthy AI",
  ]);
});

test("filters by one area and keeps All unfiltered", () => {
  expect(filterResearchEntries(entries, "Trustworthy AI")).toHaveLength(2);
  expect(filterResearchEntries(entries, ALL_AREAS)).toEqual(entries);
});

test("derives only valid actions", () => {
  expect(getEntryActions(entries[0])).toEqual({ canRead: true, canViewPdf: false });
  expect(getEntryActions(entries[1])).toEqual({ canRead: false, canViewPdf: true });
  expect(getEntryActions(entries[2])).toEqual({ canRead: false, canViewPdf: false });
});
```

- [ ] **Step 2: Run the helper tests and confirm failure**

Run:

```bash
cd portfolio-frontend
npm test -- --watchAll=false src/researchArchive.test.js
```

Expected: failure because `researchArchive.js` does not exist.

- [ ] **Step 3: Implement the pure helpers**

```javascript
export const ALL_AREAS = "All";

export const getResearchAreas = (entries) => [
  ALL_AREAS,
  ...Array.from(
    new Set(entries.map((entry) => entry.research_area).filter(Boolean))
  ).sort((left, right) => left.localeCompare(right)),
];

export const filterResearchEntries = (entries, area) =>
  area === ALL_AREAS
    ? entries
    : entries.filter((entry) => entry.research_area === area);

export const getEntryActions = (entry) => ({
  canRead: Boolean(entry.content && entry.content.trim()),
  canViewPdf: Boolean(entry.pdf_url),
});
```

- [ ] **Step 4: Run helper tests**

Run:

```bash
cd portfolio-frontend
npm test -- --watchAll=false src/researchArchive.test.js
```

Expected: all helper tests pass.

- [ ] **Step 5: Commit the helper boundary**

```bash
git add portfolio-frontend/src/researchArchive.js portfolio-frontend/src/researchArchive.test.js
git commit -m "Add research archive filtering helpers"
```

---

### Task 4: Build the Accessible Archive Interface

**Files:**
- Modify: `portfolio-frontend/package.json`
- Modify: `portfolio-frontend/package-lock.json`
- Create: `portfolio-frontend/src/setupTests.js`
- Modify: `portfolio-frontend/src/pages/Blog.jsx`
- Create: `portfolio-frontend/src/pages/Blog.css`
- Create: `portfolio-frontend/src/pages/Blog.test.jsx`

**Interfaces:**
- Consumes: `${API_BASE_URL}/blog/` and the Task 3 helper functions.
- Produces: `Blog` React component retaining its existing default export and `/blog` route compatibility.
- State: `entries`, `selectedArea`, `expandedEntryId`, `loading`, and `error`.

- [ ] **Step 1: Add explicit test dependencies**

Run:

```bash
cd portfolio-frontend
npm install --save-dev @testing-library/jest-dom@6.6.3 @testing-library/react@16.3.0 @testing-library/user-event@14.6.1
```

Create `src/setupTests.js`:

```javascript
import "@testing-library/jest-dom";
```

- [ ] **Step 2: Write failing component tests**

Mock `fetch` and cover the approved visible behavior:

```javascript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

const records = [
  {
    id: 1,
    title: "Faithfulness in Language Models",
    description: "A proposal for evaluating explanation faithfulness.",
    content: "Full proposal text.",
    content_type: "Proposal",
    status: "In Progress",
    research_area: "Trustworthy AI",
    created_at: "2026-08-01T00:00:00Z",
    pdf_url: "https://example.test/faithfulness.pdf",
  },
  {
    id: 2,
    title: "Network Anomaly Notes",
    description: "Early observations from IoT traffic experiments.",
    content: "Research note body.",
    content_type: "Research Note",
    status: "Draft",
    research_area: "Cybersecurity",
    created_at: "2026-07-01T00:00:00Z",
    pdf_url: null,
  },
];

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => records,
  });
});

test("renders the archive labels and valid actions", async () => {
  render(<Blog />);
  expect(await screen.findByText("Faithfulness in Language Models")).toBeInTheDocument();
  expect(screen.getByText("Proposal")).toBeInTheDocument();
  expect(screen.getByText("In Progress")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Read Faithfulness in Language Models" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View PDF for Faithfulness in Language Models" })).toHaveAttribute(
    "href",
    "https://example.test/faithfulness.pdf"
  );
});

test("filters by research area", async () => {
  const user = userEvent.setup();
  render(<Blog />);
  await screen.findByText("Faithfulness in Language Models");
  await user.click(screen.getByRole("button", { name: "Cybersecurity" }));
  expect(screen.getByText("Network Anomaly Notes")).toBeInTheDocument();
  expect(screen.queryByText("Faithfulness in Language Models")).not.toBeInTheDocument();
});

test("reads and closes content inline", async () => {
  const user = userEvent.setup();
  render(<Blog />);
  await user.click(await screen.findByRole("button", { name: "Read Faithfulness in Language Models" }));
  expect(screen.getByText("Full proposal text.")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Close Faithfulness in Language Models" }));
  expect(screen.queryByText("Full proposal text.")).not.toBeInTheDocument();
});

test("offers retry after a request failure", async () => {
  global.fetch.mockRejectedValueOnce(new Error("offline"));
  render(<Blog />);
  expect(await screen.findByText(/could not load research work/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
});
```

Also add an empty-response test expecting `Research work coming soon.` and a filtered-empty test that offers `Show all`.

- [ ] **Step 3: Run component tests and confirm failure**

Run:

```bash
cd portfolio-frontend
npm test -- --watchAll=false src/pages/Blog.test.jsx
```

Expected: failures because the current component uses cards/modal and has no filters or resilient states.

- [ ] **Step 4: Implement data loading and states**

Refactor `Blog.jsx` around a reusable `loadEntries` callback:

```javascript
const loadEntries = useCallback(async () => {
  setLoading(true);
  setError(false);
  try {
    const response = await fetch(`${API_BASE_URL}/blog/`);
    if (!response.ok) throw new Error(`Research archive request failed: ${response.status}`);
    setEntries(await response.json());
  } catch (requestError) {
    console.error("Error fetching research archive:", requestError);
    setError(true);
  } finally {
    setLoading(false);
  }
}, []);
```

Render an introductory header, one filter row, chronological archive rows, inline expanded content, and explicit loading/error/empty/no-filter-results states. Use semantic buttons for filtering and reading, and use anchors with `target="_blank"` plus `rel="noopener noreferrer"` for PDFs.

- [ ] **Step 5: Add focused responsive styles**

Import `./Blog.css` from `Blog.jsx`. Define component-prefixed classes such as `.research-archive`, `.research-filter`, `.research-entry`, and `.research-entry__actions`. Use CSS variables containing only the established palette, thin borders, minimal shadows, visible `:focus-visible` outlines, and a mobile breakpoint at `640px` that stacks metadata, summary, and actions.

- [ ] **Step 6: Run component and helper tests**

Run:

```bash
cd portfolio-frontend
npm test -- --watchAll=false src/pages/Blog.test.jsx src/researchArchive.test.js
```

Expected: all archive tests pass.

- [ ] **Step 7: Commit the archive interface**

```bash
git add portfolio-frontend/package.json portfolio-frontend/package-lock.json portfolio-frontend/src/setupTests.js portfolio-frontend/src/pages/Blog.jsx portfolio-frontend/src/pages/Blog.css portfolio-frontend/src/pages/Blog.test.jsx
git commit -m "Replace blog cards with research archive"
```

---

### Task 5: Rename Navigation Without Breaking Routes

**Files:**
- Modify: `portfolio-frontend/src/App.jsx`
- Create: `portfolio-frontend/src/App.test.jsx`

**Interfaces:**
- Consumes: existing `Blog` default export.
- Preserves: route path `/blog`.
- Produces: visible navigation label `Research Areas & Interests` linking to `/blog`.

- [ ] **Step 1: Write the failing navigation test**

Render the app in a test router context and assert the label and destination. If `BrowserRouter` prevents wrapping, mock only the page components and render `App` directly:

```javascript
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renames Blog while preserving its route", () => {
  render(<App />);
  expect(
    screen.getByRole("link", { name: "Research Areas & Interests" })
  ).toHaveAttribute("href", "/blog");
});
```

- [ ] **Step 2: Run the test and confirm failure**

Run:

```bash
cd portfolio-frontend
npm test -- --watchAll=false src/App.test.jsx
```

Expected: failure because the current navigation label is `Blog`.

- [ ] **Step 3: Replace string-derived navigation with explicit records**

In `App.jsx`, use:

```javascript
const navigationItems = [
  { label: "Education", path: "/education" },
  { label: "Projects", path: "/projects" },
  { label: "Research Areas & Interests", path: "/blog" },
  { label: "Certifications", path: "/certifications" },
  { label: "Hobby", path: "/hobby" },
  { label: "Contact", path: "/contact" },
];
```

Map `label` and `path` directly rather than deriving the URL from the displayed text. Keep `<Route path="/blog" element={<Blog />} />` unchanged.

- [ ] **Step 4: Run the navigation and archive tests**

Run:

```bash
cd portfolio-frontend
npm test -- --watchAll=false src/App.test.jsx src/pages/Blog.test.jsx src/researchArchive.test.js
```

Expected: all selected suites pass.

- [ ] **Step 5: Commit the compatibility change**

```bash
git add portfolio-frontend/src/App.jsx portfolio-frontend/src/App.test.jsx
git commit -m "Rename blog navigation to research archive"
```

---

### Task 6: Verify, Back Up, Migrate, and Deploy

**Files:**
- No committed source file required unless verification exposes a defect.
- Create outside Git: timestamped production `BlogPost` JSON backup before migration.

**Interfaces:**
- Consumes: completed backend migration and frontend archive.
- Produces: verified local build and safely migrated deployed database.

- [ ] **Step 1: Run the complete local backend verification**

```bash
cd portfolio-backend
DATABASE_URL=sqlite:////private/tmp/tfolio-research-final.sqlite3 ../venv/bin/python manage.py test -v 2
DATABASE_URL=sqlite:////private/tmp/tfolio-research-final.sqlite3 ../venv/bin/python manage.py check
DATABASE_URL=sqlite:////private/tmp/tfolio-research-final.sqlite3 ../venv/bin/python manage.py makemigrations --check --dry-run
```

Expected: every backend test passes, the system check reports no issues, and no migration changes are detected.

- [ ] **Step 2: Run the complete frontend verification**

```bash
cd portfolio-frontend
npm test -- --watchAll=false
npm run build
```

Expected: every frontend test passes and the optimized production build compiles successfully.

- [ ] **Step 3: Inspect the final diff for safety**

```bash
git diff --check origin/main...HEAD
git status --short
```

Confirm no private key, database file, fixture, environment file, media upload, generated cache, or build directory is staged or committed.

- [ ] **Step 4: Back up production research/blog records**

Using the deployed `DATABASE_URL` only in the environment, export the existing `portfolio.BlogPost` rows to a timestamped JSON file under the user-facing recovery outputs directory. Do not print the database URL or secret values. Record the file's row count and SHA-256 digest.

- [ ] **Step 5: Apply the production migration before the frontend switch**

Deploy the backend revision, run `python manage.py migrate --noinput`, and verify `/api/blog/` returns HTTP 200 with every pre-migration row still present plus the new archive fields. Do not proceed if row counts decrease.

- [ ] **Step 6: Deploy and manually verify the frontend**

Deploy the frontend revision only after the backend API is compatible. Check:

- Desktop and mobile archive layout
- All and per-area filters
- Paper, Proposal, Blog, and Research Note labels
- Draft, In Progress, Completed, and Published labels
- Inline Read open/close behavior
- PDF links where files exist
- Empty and failed-request messages
- `/blog` direct navigation and browser refresh
- Unrelated Projects, Education, Certifications, Hobby, and Contact routes

- [ ] **Step 7: Record deployment evidence**

Capture the deployed backend revision, frontend revision, migration output, API row count, and checked public URLs in the implementation handoff. If any live verification fails, stop and retain the backup rather than modifying production data ad hoc.

---

## Final Acceptance Checklist

- [ ] Existing Blog records remain present and readable.
- [ ] The visible page and navigation say `Research Areas & Interests`.
- [ ] `/blog` and `/api/blog/` remain valid.
- [ ] The archive is chronological and filtered by one research area at a time.
- [ ] Every visible action has a valid destination.
- [ ] The existing portfolio palette and shell remain recognizable.
- [ ] Desktop and mobile checks pass.
- [ ] Full backend tests, frontend tests, and production build pass.
- [ ] Production data is backed up before migration.
- [ ] No secrets, database files, fixtures, uploaded PDFs, caches, or build outputs are committed.
