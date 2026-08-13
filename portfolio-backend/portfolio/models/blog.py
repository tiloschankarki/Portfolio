from django.core.exceptions import ValidationError
from django.db import models
from urllib.parse import urlparse


class BlogPost(models.Model):
    CONTENT_TYPES = (
        ('Paper', 'Paper'),
        ('Proposal', 'Proposal'),
        ('Blog', 'Blog'),
        ('Research Note', 'Research Note'),
    )
    STATUSES = (
        ('Draft', 'Draft'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Published', 'Published'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    content = models.TextField(blank=True)
    category = models.CharField(max_length=100, choices=[
        ('Engineering', 'Engineering'),
        ('Best Practices', 'Best Practices'),
        ('AI/ML', 'AI/ML'),
        ('Design', 'Design')
    ], default='Engineering')
    content_type = models.CharField(
        max_length=20,
        choices=CONTENT_TYPES,
        default='Blog',
    )
    status = models.CharField(
        max_length=20,
        choices=STATUSES,
        default='Completed',
    )
    research_area = models.CharField(max_length=120, default='General')
    pdf_url = models.URLField(
        blank=True,
        help_text='Link to a PDF stored on GitHub.',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    reading_time = models.IntegerField(default=5)

    @property
    def has_web_content(self):
        return bool(self.content and self.content.strip())

    @property
    def has_pdf(self):
        return bool(self.pdf_url)

    def clean(self):
        super().clean()
        if not self.has_web_content and not self.has_pdf:
            raise ValidationError('A research entry requires web content or a PDF.')
        if self.pdf_url:
            parsed_url = urlparse(self.pdf_url)
            if parsed_url.hostname not in {'github.com', 'raw.githubusercontent.com'}:
                raise ValidationError({
                    'pdf_url': 'Use a GitHub-hosted PDF link.',
                })
            if not parsed_url.path.lower().endswith('.pdf'):
                raise ValidationError({
                    'pdf_url': 'The GitHub PDF link must end in .pdf.',
                })

    def __str__(self):
        return self.title
