from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from datetime import timedelta

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
