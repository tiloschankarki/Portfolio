from django.db import models

class Certification(models.Model):
    name = models.CharField(max_length=200)
    organization = models.CharField(max_length=255)
    issue_date = models.DateField()
    skills_covered = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.organization}"
