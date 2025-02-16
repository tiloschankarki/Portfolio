from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    tech_stack = models.CharField(max_length=255)
    category = models.CharField(max_length=100, choices=[
        ('Web App', 'Web App'),
        ('Mobile App', 'Mobile App'),
        ('AI/ML', 'AI/ML'),
        ('Game Development', 'Game Development'),
        ('DSA', 'DSA')
    ])
    role = models.CharField(max_length=255)  # Example: Backend Developer
    skills_learned = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    repo_link = models.URLField(max_length=500, blank=True, null=True)  # 🔹 New field
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
