from django.core.management.base import BaseCommand
from django.db import transaction

from portfolio.models.project import Project
from portfolio.project_catalog import PROJECT_CATALOG, validate_project_catalog


class Command(BaseCommand):
    help = "Create or update the curated portfolio project catalog."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Report changes without writing to the database.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        catalog = PROJECT_CATALOG
        dry_run = options["dry_run"]
        validate_project_catalog(catalog)

        created = 0
        updated = 0
        unchanged = 0

        for project_data in catalog:
            source_key = project_data["source_key"]
            defaults = {
                key: value
                for key, value in project_data.items()
                if key != "source_key"
            }
            project = Project.objects.filter(source_key=source_key).first()

            if project is None and source_key == "github:whats-the-move":
                project = Project.objects.filter(title__iexact="What's the move?").first()

            if project is None:
                created += 1
                if not dry_run:
                    Project.objects.create(source_key=source_key, **defaults)
                continue

            changes = {
                key: value
                for key, value in defaults.items()
                if getattr(project, key) != value
            }
            if project.source_key != source_key:
                changes["source_key"] = source_key

            if not changes:
                unchanged += 1
                continue

            updated += 1
            if not dry_run:
                for key, value in changes.items():
                    setattr(project, key, value)
                project.save(update_fields=sorted(changes))

        prefix = "dry-run " if dry_run else ""
        self.stdout.write(
            f"{prefix}created={created} updated={updated} unchanged={unchanged}"
        )
