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
