from django.db import models

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    content = models.TextField()
    category = models.CharField(max_length=100, choices=[
        ('Engineering', 'Engineering'),
        ('Best Practices', 'Best Practices'),
        ('AI/ML', 'AI/ML'),
        ('Design', 'Design')
    ], default='Engineering')
    created_at = models.DateTimeField(auto_now_add=True)
    reading_time = models.IntegerField(default=5)

    def __str__(self):
        return self.title
