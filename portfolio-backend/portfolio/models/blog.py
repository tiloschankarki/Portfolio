from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models


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
    pdf = models.FileField(
        upload_to='research_pdfs/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(['pdf'])],
    )
    created_at = models.DateTimeField(auto_now_add=True)
    reading_time = models.IntegerField(default=5)

    @property
    def has_web_content(self):
        return bool(self.content and self.content.strip())

    @property
    def has_pdf(self):
        return bool(self.pdf)

    def clean(self):
        super().clean()
        if not self.has_web_content and not self.has_pdf:
            raise ValidationError('A research entry requires web content or a PDF.')

    def __str__(self):
        return self.title
