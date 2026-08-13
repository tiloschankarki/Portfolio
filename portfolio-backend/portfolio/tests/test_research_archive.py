from django.core.exceptions import ValidationError
from django.db import connection
from django.db.migrations.executor import MigrationExecutor
from django.test import TestCase, TransactionTestCase
from django.utils import timezone
from rest_framework.test import APIClient

from datetime import timedelta
from importlib import import_module

from portfolio.models.blog import BlogPost


class IoTPaperMigrationTests(TransactionTestCase):
    migrate_from = [("portfolio", "0006_research_archive_fields")]
    migrate_to = [("portfolio", "0007_add_iot_malware_research_paper")]
    title = "IoT Malware Detection: Reproducing and Improving CTU-IoT-23 Results"

    def test_migration_creates_one_complete_iot_paper(self):
        executor = MigrationExecutor(connection)
        executor.migrate(self.migrate_from)
        executor = MigrationExecutor(connection)
        executor.migrate(self.migrate_to)
        apps = executor.loader.project_state(self.migrate_to).apps
        HistoricalBlogPost = apps.get_model("portfolio", "BlogPost")

        matches = HistoricalBlogPost.objects.filter(title=self.title)
        self.assertEqual(matches.count(), 1)
        paper = matches.get()
        self.assertEqual(paper.content_type, "Paper")
        self.assertEqual(paper.status, "Completed")
        self.assertEqual(
            paper.research_area, "Cybersecurity & Machine Learning"
        )
        self.assertEqual(paper.category, "AI/ML")
        self.assertEqual(paper.pdf_url, "")
        for phrase in (
            "CTU-IoT-23",
            "decision-tree",
            "random-forest",
            "improves the reported evaluation metrics",
            "clearer interactive visualizations",
        ):
            self.assertIn(phrase, paper.content)

        migration = import_module(
            "portfolio.migrations.0007_add_iot_malware_research_paper"
        )
        migration.add_iot_malware_paper(apps, None)
        migration.add_iot_malware_paper(apps, None)
        self.assertEqual(
            HistoricalBlogPost.objects.filter(title=self.title).count(), 1
        )

    def test_title_collision_is_preserved_forward_and_backward(self):
        executor = MigrationExecutor(connection)
        executor.migrate(self.migrate_from)
        apps = executor.loader.project_state(self.migrate_from).apps
        HistoricalBlogPost = apps.get_model("portfolio", "BlogPost")
        collision = HistoricalBlogPost.objects.create(
            title=self.title,
            description="User-authored record",
            content="Original research content",
            category="Engineering",
            content_type="Research Note",
            status="Draft",
            research_area="Personal",
            pdf_url="",
            reading_time=3,
        )

        executor = MigrationExecutor(connection)
        executor.migrate(self.migrate_to)
        executor = MigrationExecutor(connection)
        executor.migrate(self.migrate_from)

        preserved = HistoricalBlogPost.objects.get(pk=collision.pk)
        self.assertEqual(preserved.description, "User-authored record")
        self.assertEqual(preserved.content, "Original research content")
        self.assertEqual(
            HistoricalBlogPost.objects.filter(title=self.title).count(), 1
        )


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

    def test_github_pdf_link_can_be_the_only_readable_destination(self):
        post = BlogPost(
            title="Formal proposal",
            description="A proposal summary",
            content="",
            content_type="Proposal",
            status="Draft",
            research_area="Trustworthy AI",
            pdf_url="https://github.com/tiloschankarki/research/blob/main/proposal.pdf",
        )

        post.full_clean()

        self.assertFalse(post.has_web_content)
        self.assertTrue(post.has_pdf)

    def test_non_github_pdf_link_is_rejected(self):
        post = BlogPost(
            title="Bad link",
            description="Invalid PDF location",
            content="",
            pdf_url="https://example.com/proposal.pdf",
        )

        with self.assertRaisesMessage(ValidationError, "GitHub-hosted PDF"):
            post.full_clean()

    def test_github_link_must_point_to_a_pdf(self):
        post = BlogPost(
            title="Bad extension",
            description="Not a PDF",
            content="",
            pdf_url="https://github.com/tiloschankarki/research/blob/main/notes.txt",
        )

        with self.assertRaisesMessage(ValidationError, "end in .pdf"):
            post.full_clean()


class ResearchArchiveApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_keeps_newest_first_and_exposes_action_flags(self):
        older = BlogPost.objects.create(
            title="Older note",
            description="Older",
            content="Readable",
            content_type="Research Note",
            status="Completed",
            research_area="Data Systems",
        )
        newer = BlogPost.objects.create(
            title="New proposal",
            description="Newer",
            content="Draft body",
            content_type="Proposal",
            status="In Progress",
            research_area="Trustworthy AI",
        )
        BlogPost.objects.filter(pk=older.pk).update(
            created_at=timezone.now() - timedelta(days=1)
        )

        response = self.client.get("/api/blog/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["id"], newer.id)
        self.assertEqual(response.data[0]["content_type"], "Proposal")
        self.assertTrue(response.data[0]["has_web_content"])
        self.assertFalse(response.data[0]["has_pdf"])
        self.assertIsNone(response.data[0]["pdf_url"])

    def test_api_keeps_legacy_fields(self):
        BlogPost.objects.create(
            title="Legacy",
            description="Summary",
            content="Body",
        )

        payload = self.client.get("/api/blog/").data[0]

        for field in (
            "title",
            "description",
            "content",
            "category",
            "created_at",
            "reading_time",
        ):
            self.assertIn(field, payload)

    def test_api_returns_the_stored_github_pdf_link(self):
        pdf_url = (
            "https://github.com/tiloschankarki/research/"
            "blob/main/papers/proposal.pdf"
        )
        BlogPost.objects.create(
            title="Proposal",
            description="Summary",
            content="",
            pdf_url=pdf_url,
        )

        payload = self.client.get("/api/blog/").data[0]

        self.assertEqual(payload["pdf_url"], pdf_url)
        self.assertTrue(payload["has_pdf"])
        self.assertFalse(payload["has_web_content"])
