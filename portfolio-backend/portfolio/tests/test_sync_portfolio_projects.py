from io import StringIO

from django.core.management import call_command
from django.test import TestCase

from portfolio.models.project import Project
from portfolio.project_catalog import PROJECT_CATALOG


class SyncPortfolioProjectsTests(TestCase):
    def test_dry_run_writes_nothing(self):
        output = StringIO()

        call_command("sync_portfolio_projects", "--dry-run", stdout=output)

        self.assertEqual(Project.objects.count(), 0)
        self.assertIn("dry-run", output.getvalue())

    def test_second_run_is_idempotent(self):
        call_command("sync_portfolio_projects", stdout=StringIO())
        first_ids = list(
            Project.objects.order_by("source_key").values_list("id", flat=True)
        )
        output = StringIO()

        call_command("sync_portfolio_projects", stdout=output)

        self.assertEqual(
            list(Project.objects.order_by("source_key").values_list("id", flat=True)),
            first_ids,
        )
        self.assertIn("created=0 updated=0 unchanged=8", output.getvalue())

    def test_existing_whats_the_move_is_enriched_not_duplicated(self):
        existing = Project.objects.create(
            title="What's the move?",
            description="Existing",
            tech_stack="Python",
            category="Web App",
            role="Developer",
        )

        call_command("sync_portfolio_projects", stdout=StringIO())

        matches = Project.objects.filter(source_key="github:whats-the-move")
        self.assertEqual(matches.count(), 1)
        self.assertEqual(matches.get().pk, existing.pk)
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
        self.assertEqual(Project.objects.count(), len(PROJECT_CATALOG) + 1)

    def test_existing_source_key_is_updated_in_place(self):
        existing = Project.objects.create(
            source_key="github:pynance",
            title="Old Pynance",
            description="Old description",
            tech_stack="Python",
            category="Web App",
            role="Developer",
        )

        call_command("sync_portfolio_projects", stdout=StringIO())

        existing.refresh_from_db()
        self.assertEqual(existing.title, "Pynance")
        self.assertEqual(existing.display_order, 30)
