# GitHub Project Expansion Design

## Goal

Expand the portfolio's Projects section with polished case studies based on Tiloschan Karki's GitHub repositories. Preserve the existing Blog and all unrelated pages. The result should help professors and technical reviewers quickly understand the breadth, progression, and technical substance of the work.

## Scope

- Keep the existing Projects page and database-driven architecture.
- Exclude the `Portfolio` repository because it is the site currently being viewed.
- Review every other repository and represent each meaningful, distinct project.
- Preserve existing project records unless a repository clearly represents the same work.
- Leave Blog, Education, Certifications, Hobby, Contact, and the homepage structure unchanged.

## Repository Selection and Deduplication

The initial repository inventory includes:

- Pynance
- SystemSecurityProject
- SmartHomeSocketPr
- ScholarGraph
- whats-the-move
- Learning-Amazon-Sentiment
- Resume-Screener
- SearchEnginePr
- Race-dataset
- Python-Project
- 1st-project

For each repository:

1. Compare its purpose with existing project records.
2. If it matches an existing project, enrich that record with the repository-derived title, description, stack, role, skills, and link instead of creating a duplicate.
3. If it is distinct and has enough substance to explain, create a new project record.
4. If an early repository is only a fragment or is already fully represented by a stronger existing record, preserve the stronger record and do not create a redundant card.

`whats-the-move` is expected to enrich the existing "What's the move?" record. `Python-Project` and `1st-project` require comparison with the existing miniature Python, sorting, calculator, and C++ records before deciding whether they warrant separate cards.

## Project Content Standard

Each project card will use the existing Django `Project` fields:

- `title`: polished, human-readable project name
- `description`: concise explanation of the problem, solution, and important outcome
- `tech_stack`: comma-separated technologies supported by repository evidence
- `category`: closest existing category choice
- `role`: Tiloschan's contribution or ownership
- `skills_learned`: technical and engineering lessons demonstrated by the project
- `repo_link`: public GitHub URL when a reviewer can access it; blank for private repositories

Descriptions must not invent metrics, deployment status, collaborators, or technical features that are not supported by the repository, README, existing portfolio data, or user-provided information.

## Public and Private Repositories

Public repositories receive clickable GitHub links. Private repositories remain visible as portfolio case studies, but their `repo_link` remains blank so professors do not encounter inaccessible links. Their descriptions will rely on visible metadata, existing project records, and any locally available source documentation.

## Ordering and Presentation

The strongest and most recent work should appear first. Recommended priority:

1. Research, security, machine-learning, and substantial full-stack systems
2. Applied web and data projects
3. Coursework and focused algorithmic projects
4. Early learning projects that demonstrate progression

The frontend will preserve the current project-card design. Any ordering mechanism added to the backend must be explicit and deterministic rather than relying on database insertion order.

## Data Flow

1. Inspect repository metadata and README/source documentation.
2. Produce a reviewed mapping from repositories to new or existing project records.
3. Apply updates to the Django data model only if deterministic ordering requires a new field.
4. Create a migration if the model changes.
5. Upsert the curated records into Neon without deleting unrelated existing content.
6. Verify the Render API response.
7. Verify project rendering on the Vercel production site.

## Safety and Rollback

- Export the current project records before modifying Neon.
- Use idempotent upserts keyed by a stable identifier rather than blind inserts.
- Do not delete existing records during the import.
- Keep the database backup and the import mapping as recovery artifacts.
- Do not commit secrets or expose private repository URLs.
- Do not modify GitHub `main`; implementation remains on the existing `codex/fix-api-endpoint` branch unless the user later authorizes integration.

## Error Handling

- A repository with insufficient documentation is flagged for manual wording rather than filled with invented claims.
- A private repository without inspectable content receives only a conservative description based on confirmed information.
- A failed database write stops the import and reports which record failed.
- Frontend fetch failures retain the current page structure and are caught by the existing client behavior.

## Verification

- Unit-test any ordering or mapping helper added during implementation.
- Run Django checks, migrations, and backend tests.
- Run frontend tests and a production build if frontend code changes.
- Confirm the API returns every intended project exactly once.
- Confirm public repository buttons point to valid GitHub URLs.
- Confirm private projects do not display broken repository buttons.
- Confirm Blog and all other routes remain unchanged.
- Verify the live Projects page after deployment.

## Success Criteria

- Every meaningful non-Portfolio repository is represented or explicitly deduplicated against an existing project.
- Project descriptions are accurate, concise, and professor-friendly.
- Public and private repository behavior is clear and safe.
- Existing portfolio content is preserved.
- No duplicate project cards are introduced.
- The live Projects page and backend API remain functional.
