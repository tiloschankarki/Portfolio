# GitHub Project Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add polished, deduplicated GitHub-derived project entries to the live portfolio while preserving existing content and leaving Blog unchanged.

**Architecture:** Extend `Project` with a stable import key and deterministic display order, then keep curated repository copy in a focused catalog module. An idempotent Django management command will update or create approved records, support dry runs, and never delete unrelated projects. The backend API will provide the same serializer shape plus the two new fields, ordered for both the Projects page and homepage.

**Tech Stack:** Django 5.1.6, Django REST Framework 3.15.2, PostgreSQL/Neon, Render, React/Vercel, Python 3.12.8.

## Global Constraints

- Exclude `Portfolio`, `Race-dataset`, `Python-Project`, and `1st-project`.
- Preserve Blog, Education, Certifications, Hobby, Contact, and unrelated project records.
- Enrich a matching project instead of creating a duplicate.
- Public repositories receive valid GitHub links; private repositories receive `repo_link=None`.
- Do not invent metrics, deployments, collaborators, or unsupported features.
- Do not delete existing project records during import.
- Back up live project records before writing to Neon.
- Do not expose secrets or private repository URLs.
- Do not modify GitHub `main`; publish only the `codex/fix-api-endpoint` branch.
- Keep Render on Python 3.12.8 and `DEBUG=False`.

## File Map

- Modify `portfolio/models/project.py`: add `source_key` and `display_order`, plus deterministic model ordering.
- Create `portfolio/migrations/0004_blogpost_category_blogpost_description_and_more.py`: restore the already-applied schema-reconciliation migration missing from the Git branch.
- Create `portfolio/migrations/0005_project_source_key_project_display_order.py`: add project import/order fields.
- Modify `portfolio/views.py`: use `display_order` for project API and homepage project selection.
- Create `portfolio/project_catalog.py`: own the approved, evidence-based project content.
- Create `portfolio/management/commands/sync_portfolio_projects.py`: validate and idempotently apply the catalog.
- Create `portfolio/tests/test_project_ordering.py`: verify API ordering.
- Create `portfolio/tests/test_project_catalog.py`: validate content, exclusions, private-link rules, and unique keys.
- Create `portfolio/tests/test_sync_portfolio_projects.py`: verify dry-run, create, update, deduplication, and non-deletion behavior.
- Create `outputs/project-records-before-expansion.json`: live pre-import project backup.
- Create `outputs/project-expansion-result.json`: import summary and final project snapshot.

---

### Task 1: Restore Migration Continuity and Add Deterministic Project Ordering

**Files:**
- Modify: `portfolio/models/project.py`
- Create: `portfolio/migrations/0004_blogpost_category_blogpost_description_and_more.py`
- Create: `portfolio/migrations/0005_project_source_key_project_display_order.py`
- Modify: `portfolio/views.py`
- Create: `portfolio/tests/__init__.py`
- Create: `portfolio/tests/test_project_ordering.py`

**Interfaces:**
- Produces: `Project.source_key: str | None`, unique when non-null.
- Produces: `Project.display_order: int`, default `100`, indexed.
- Produces: project query order `display_order ASC, created_at DESC, id ASC`.

- [ ] **Step 1: Write the failing API-order tests**

Create `portfolio/tests/test_project_ordering.py`:

```python
from django.test import TestCase
from django.urls import reverse

from portfolio.models.project import Project


class ProjectOrderingTests(TestCase):
    def make_project(self, title, display_order):
        return Project.objects.create(
            title=title,
            description=f"{title} description",
            tech_stack="Python",
            category="AI/ML",
            role="Developer",
            source_key=f"test:{title.lower()}",
            display_order=display_order,
        )

    def test_projects_api_orders_by_display_order(self):
        self.make_project("Later", 20)
        self.make_project("First", 10)

        response = self.client.get(reverse("get_projects"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["title"] for row in response.json()], ["First", "Later"])

    def test_homepage_uses_same_project_priority(self):
        for title, order in [("Fourth", 40), ("Second", 20), ("First", 10), ("Third", 30)]:
            self.make_project(title, order)

        response = self.client.get(reverse("get_homepage_summary"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [row["title"] for row in response.json()["projects"]],
            ["First", "Second", "Third"],
        )
```

- [ ] **Step 2: Run the tests and confirm the missing-field failure**

Run: `portfolio-backend/../venv/bin/python portfolio-backend/manage.py test portfolio.tests.test_project_ordering -v 2`

Expected: ERROR because `Project` has no `source_key` or `display_order` field.

- [ ] **Step 3: Restore migration `0004` exactly from the recovery artifact**

Copy the reviewed migration from:

`work/portfolio_recovery/prepared/Portfolio-Recovered/portfolio-backend/portfolio/migrations/0004_blogpost_category_blogpost_description_and_more.py`

The migration must contain only the two `BlogPost` additions and two `Hobby` alterations already applied to Neon. Do not regenerate or edit its operations.

- [ ] **Step 4: Add the project fields and model ordering**

Add to `Project` in `portfolio/models/project.py`:

```python
source_key = models.CharField(max_length=255, unique=True, blank=True, null=True)
display_order = models.PositiveIntegerField(default=100, db_index=True)

class Meta:
    ordering = ("display_order", "-created_at", "id")
```

- [ ] **Step 5: Generate and inspect migration `0005`**

Run: `portfolio-backend/../venv/bin/python portfolio-backend/manage.py makemigrations portfolio --name project_source_key_project_display_order`

Expected: `0005` contains only `Project.source_key`, `Project.display_order`, and the model ordering option. Reject the migration if it contains Blog or Hobby operations.

- [ ] **Step 6: Update both project queries**

In `portfolio/views.py`, define:

```python
PROJECT_ORDER = ("display_order", "-created_at", "id")
```

Use `Project.objects.order_by(*PROJECT_ORDER)` in `get_projects`, and use the same queryset sliced to three records in `get_homepage_summary`.

- [ ] **Step 7: Run migrations and tests locally**

Run:

```bash
portfolio-backend/../venv/bin/python portfolio-backend/manage.py migrate
portfolio-backend/../venv/bin/python portfolio-backend/manage.py test portfolio.tests.test_project_ordering -v 2
portfolio-backend/../venv/bin/python portfolio-backend/manage.py makemigrations --check --dry-run
```

Expected: migrations succeed, both tests pass, and Django reports no model changes.

- [ ] **Step 8: Commit the schema and ordering change**

```bash
git add portfolio-backend/portfolio/models/project.py portfolio-backend/portfolio/views.py portfolio-backend/portfolio/migrations/0004_blogpost_category_blogpost_description_and_more.py portfolio-backend/portfolio/migrations/0005_project_source_key_project_display_order.py portfolio-backend/portfolio/tests
git commit -m "Add deterministic portfolio project ordering"
```

---

### Task 2: Build and Validate the Curated Project Catalog

**Files:**
- Create: `portfolio/project_catalog.py`
- Create: `portfolio/tests/test_project_catalog.py`

**Interfaces:**
- Produces: `PROJECT_CATALOG: tuple[dict[str, object], ...]`.
- Every dictionary contains `source_key`, `title`, `description`, `tech_stack`, `category`, `role`, `skills_learned`, `repo_link`, and `display_order`.
- Produces: `validate_project_catalog(catalog) -> None`, raising `ValueError` for invalid data.

- [ ] **Step 1: Write catalog validation tests**

Create tests asserting:

```python
from django.test import SimpleTestCase

from portfolio.project_catalog import PROJECT_CATALOG, validate_project_catalog


class ProjectCatalogTests(SimpleTestCase):
    def test_catalog_has_expected_source_keys(self):
        self.assertEqual(
            {row["source_key"] for row in PROJECT_CATALOG},
            {
                "github:pynance",
                "github:systemsecurityproject",
                "github:smarthomesocketpr",
                "github:scholargraph",
                "github:whats-the-move",
                "github:learning-amazon-sentiment",
                "github:resume-screener",
                "github:searchenginepr",
            },
        )

    def test_excluded_repositories_are_absent(self):
        serialized = repr(PROJECT_CATALOG).lower()
        for excluded in ("portfolio", "race-dataset", "python-project", "1st-project"):
            self.assertNotIn(f"github:{excluded}", serialized)

    def test_private_projects_have_no_repository_link(self):
        rows = {row["source_key"]: row for row in PROJECT_CATALOG}
        self.assertIsNone(rows["github:whats-the-move"]["repo_link"])
        self.assertIsNone(rows["github:searchenginepr"]["repo_link"])

    def test_catalog_validates(self):
        validate_project_catalog(PROJECT_CATALOG)
```

- [ ] **Step 2: Run tests and verify the missing-module failure**

Run: `portfolio-backend/../venv/bin/python portfolio-backend/manage.py test portfolio.tests.test_project_catalog -v 2`

Expected: ERROR with `ModuleNotFoundError: portfolio.project_catalog`.

- [ ] **Step 3: Create the exact curated catalog**

Use these entries in `PROJECT_CATALOG`:

| Order | Source key | Title | Category | Repository |
|---:|---|---|---|---|
| 10 | `github:scholargraph` | ScholarGraph | Web App | `https://github.com/tiloschankarki/ScholarGraph` |
| 20 | `github:systemsecurityproject` | IoT Malware Detection | AI/ML | `https://github.com/tiloschankarki/SystemSecurityProject` |
| 30 | `github:pynance` | Pynance | Web App | `https://github.com/tiloschankarki/Pynance` |
| 40 | `github:learning-amazon-sentiment` | Amazon Review Sentiment Analysis | AI/ML | `https://github.com/tiloschankarki/Learning-Amazon-Sentiment` |
| 50 | `github:resume-screener` | Resume Screener | AI/ML | `https://github.com/tiloschankarki/Resume-Screener` |
| 60 | `github:searchenginepr` | Search Engine Data Mining Project (`SearchEnginePr`) | AI/ML | `None` |
| 70 | `github:smarthomesocketpr` | Smart Home Socket Communication | Web App | `https://github.com/tiloschankarki/SmartHomeSocketPr` |
| 80 | `github:whats-the-move` | What's the Move? | Web App | `None` |

Use the following evidence-based descriptions:

```python
DESCRIPTIONS = {
    "github:scholargraph": "A decentralized academic knowledge graph that connects papers, authors, institutions, publishers, and datasets in Neo4j while anchoring research identifiers on Polygon for transparent verification.",
    "github:systemsecurityproject": "An IoT intrusion-detection system trained on CTU-IoT-23 network traffic. It compares decision-tree and random-forest models with scenario-based evaluation to test whether detection generalizes to unseen attacks and devices.",
    "github:pynance": "A web-based personal finance system for recording income and expenses, visualizing cash-flow trends, tracking savings goals, and importing transaction data from CSV files.",
    "github:learning-amazon-sentiment": "A machine-learning study that classifies more than 100,000 Amazon appliance reviews using TF-IDF features and compares logistic regression, support-vector machine, and Naive Bayes classifiers.",
    "github:resume-screener": "A Python and Streamlit tool that parses resumes and job listings, extracts relevant information, and supports structured comparison during a job search.",
    "github:searchenginepr": "A Python data-mining project focused on building and evaluating search and information-retrieval techniques.",
    "github:smarthomesocketpr": "A Python socket-programming project implementing TCP and UDP client-server communication, with logging and a written technical report.",
    "github:whats-the-move": "A collaborative Flask travel-planning application with shared rooms, destination voting, itineraries, nearby points of interest, photo sharing, music, and an AI travel guide.",
}
```

Use these stacks and roles:

- ScholarGraph: `React, Node.js, Neo4j, Solidity, Polygon`; role `Full-stack and blockchain developer`.
- IoT Malware Detection: `Python, pandas, scikit-learn, Streamlit, Plotly`; role `Machine-learning and security engineer`.
- Pynance: `Python, Flask, SQLAlchemy, JavaScript, Plotly`; role `Full-stack developer`.
- Amazon Review Sentiment Analysis: `Python, Jupyter, pandas, TF-IDF, scikit-learn`; role `Machine-learning developer`.
- Resume Screener: `Python, Streamlit, PyMuPDF, Beautiful Soup, pandas`; role `Application developer`.
- Search Engine Data Mining Project: `Python, Data Mining, Information Retrieval`; role `Data-mining developer`.
- Smart Home Socket Communication: `Python, TCP, UDP, Socket Programming`; role `Systems developer`.
- What's the Move?: `Python, Flask, JavaScript, Firebase, Google Cloud Run, OpenAI API`; role `Full-stack developer`.

Set `skills_learned` to a concise comma-separated summary derived from each stack and description.

- [ ] **Step 4: Implement strict catalog validation**

`validate_project_catalog` must reject duplicate `source_key` values, duplicate `display_order` values, missing required fields, invalid categories, and repository URLs outside `https://github.com/tiloschankarki/`. It must explicitly permit `repo_link=None`.

- [ ] **Step 5: Run catalog tests**

Run: `portfolio-backend/../venv/bin/python portfolio-backend/manage.py test portfolio.tests.test_project_catalog -v 2`

Expected: all catalog tests pass.

- [ ] **Step 6: Commit the catalog**

```bash
git add portfolio-backend/portfolio/project_catalog.py portfolio-backend/portfolio/tests/test_project_catalog.py
git commit -m "Add curated GitHub project catalog"
```

---

### Task 3: Implement the Idempotent Import Command

**Files:**
- Create: `portfolio/management/__init__.py`
- Create: `portfolio/management/commands/__init__.py`
- Create: `portfolio/management/commands/sync_portfolio_projects.py`
- Create: `portfolio/tests/test_sync_portfolio_projects.py`

**Interfaces:**
- Produces CLI: `python manage.py sync_portfolio_projects [--dry-run]`.
- Produces summary line: `created=N updated=N unchanged=N`.
- Uses `source_key` as the stable upsert key.
- Special-case deduplication: if `github:whats-the-move` is missing, match the existing title case-insensitively before creating.

- [ ] **Step 1: Write failing command tests**

Tests must cover:

```python
from io import StringIO

from django.core.management import call_command
from django.test import TestCase

from portfolio.models.project import Project


class SyncPortfolioProjectsTests(TestCase):
    def test_dry_run_writes_nothing(self):
        call_command("sync_portfolio_projects", "--dry-run", stdout=StringIO())
        self.assertEqual(Project.objects.count(), 0)

    def test_second_run_is_idempotent(self):
        call_command("sync_portfolio_projects", stdout=StringIO())
        first_ids = list(Project.objects.order_by("source_key").values_list("id", flat=True))
        output = StringIO()
        call_command("sync_portfolio_projects", stdout=output)
        self.assertEqual(
            list(Project.objects.order_by("source_key").values_list("id", flat=True)),
            first_ids,
        )
        self.assertIn("created=0", output.getvalue())

    def test_existing_whats_the_move_is_enriched_not_duplicated(self):
        Project.objects.create(
            title="What's the move?",
            description="Existing",
            tech_stack="Python",
            category="Web App",
            role="Developer",
        )
        call_command("sync_portfolio_projects", stdout=StringIO())
        matches = Project.objects.filter(source_key="github:whats-the-move")
        self.assertEqual(matches.count(), 1)
        self.assertEqual(Project.objects.filter(title__iexact="What's the Move?").count(), 1)

    def test_unrelated_project_is_preserved(self):
        original = Project.objects.create(
            title="Unrelated Project",
            description="Keep me",
            tech_stack="C++",
            category="DSA",
            role="Developer",
        )
        call_command("sync_portfolio_projects", stdout=StringIO())
        self.assertTrue(Project.objects.filter(pk=original.pk).exists())
```

- [ ] **Step 2: Run tests and confirm command-not-found failure**

Run: `portfolio-backend/../venv/bin/python portfolio-backend/manage.py test portfolio.tests.test_sync_portfolio_projects -v 2`

Expected: ERROR stating `Unknown command: 'sync_portfolio_projects'`.

- [ ] **Step 3: Implement validation, dry-run, and atomic upsert**

The command must call `validate_project_catalog`, wrap writes in `transaction.atomic()`, and use `update_or_create(source_key=...)`. Before the upsert for `github:whats-the-move`, find `Project.objects.filter(title__iexact="What's the move?").first()` and assign its `source_key` so the existing record is reused. In dry-run mode, calculate actions without calling `save`, `create`, `update`, or `delete`.

- [ ] **Step 4: Run command tests and the full Django suite**

Run:

```bash
portfolio-backend/../venv/bin/python portfolio-backend/manage.py test portfolio.tests.test_sync_portfolio_projects -v 2
portfolio-backend/../venv/bin/python portfolio-backend/manage.py test -v 2
```

Expected: all tests pass.

- [ ] **Step 5: Commit the import command**

```bash
git add portfolio-backend/portfolio/management portfolio-backend/portfolio/tests/test_sync_portfolio_projects.py
git commit -m "Add idempotent portfolio project importer"
```

---

### Task 4: Back Up and Import the Live Neon Project Data

**Files:**
- Create: `outputs/project-records-before-expansion.json`
- Create: `outputs/project-expansion-result.json`

**Interfaces:**
- Consumes: `sync_portfolio_projects [--dry-run]` from Task 3.
- Produces: recoverable JSON backup and verified final project snapshot.

- [ ] **Step 1: Export the current live projects without exposing credentials**

Load `DATABASE_URL` from the user's existing local backend `.env`, run Django serialization for `portfolio.Project`, and save the output to `outputs/project-records-before-expansion.json`. Do not print the connection string.

Run: `python manage.py dumpdata portfolio.Project --indent 2 --output <absolute-output-path>`

Expected: the backup contains the existing seven project records and no secrets.

- [ ] **Step 2: Verify the backup before mutation**

Parse the JSON and assert that it is a list, contains seven records, and each record has a primary key and title. Record a SHA-256 checksum.

- [ ] **Step 3: Apply migration and run a live dry run**

Run:

```bash
python manage.py migrate --plan
python manage.py migrate
python manage.py sync_portfolio_projects --dry-run
```

Expected: migrations `0004` and `0005` are applied or already recorded, and dry-run reports the intended creates/updates without changing the count.

- [ ] **Step 4: Run the live import once**

Run: `python manage.py sync_portfolio_projects`

Expected: approved missing projects are created, What's the Move is updated in place, and unrelated records remain.

- [ ] **Step 5: Prove idempotence against Neon**

Run: `python manage.py sync_portfolio_projects`

Expected: `created=0 updated=0` and the project count is unchanged.

- [ ] **Step 6: Export the final snapshot and summary**

Save final serialized project records plus the backup checksum, before/after counts, source keys, and excluded repository list to `outputs/project-expansion-result.json`. Do not include environment variables.

---

### Task 5: Publish the Backend Branch and Verify Production

**Files:**
- No new source files.

**Interfaces:**
- Consumes: tested `codex/fix-api-endpoint` branch and migrated Neon data.
- Produces: Render API and Vercel frontend showing the curated order.

- [ ] **Step 1: Run pre-publish verification**

Run:

```bash
python manage.py check --deploy
python manage.py test -v 2
npm test -- --watchAll=false
npm run build
git diff --check
git status --short
```

Expected: tests and builds pass; only intentional files are present. Ignore generated `__pycache__` changes and never stage them.

- [ ] **Step 2: Push only the feature branch**

Run: `git push origin codex/fix-api-endpoint`

Expected: push succeeds; GitHub `main` remains unchanged.

- [ ] **Step 3: Point Render at the tested branch and deploy**

In Render, change the service branch from `main` to `codex/fix-api-endpoint`, retain `PYTHON_VERSION=3.12.8` and `DEBUG=False`, then deploy. Confirm build output reports no unapplied migrations or model drift.

- [ ] **Step 4: Verify the live API**

Request `https://tfolio-backend.onrender.com/api/projects/` and assert:

- HTTP 200.
- Every catalog source key appears exactly once.
- Excluded repositories do not appear as imported entries.
- Display orders are ascending.
- Public links use the approved GitHub URLs.
- What's the Move and Search Engine have null repository links.
- Existing unrelated projects remain.

- [ ] **Step 5: Verify the Vercel production UI**

Open `https://portfolio-phi-two-28.vercel.app/` and `/projects`. Confirm the homepage features ScholarGraph, IoT Malware Detection, and Pynance; the Projects page renders all records once; public cards have GitHub buttons; private cards do not; and Blog remains unchanged.

- [ ] **Step 6: Final safety check**

Confirm Django Admin add/change pages return 200, `/api/blog/` still returns the original blog record, `DEBUG` remains false, and no secret value appears in git diff, logs, or output artifacts.
