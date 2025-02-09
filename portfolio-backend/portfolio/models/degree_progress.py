from django.db import models

class DegreeProgress(models.Model):
    total_credits = models.IntegerField(default=120)  # Example: 120 required credits
    completed_credits = models.IntegerField(default=0)

    def progress_percentage(self):
        return (self.completed_credits / self.total_credits) * 100

    def __str__(self):
        return f"Degree Progress: {self.progress_percentage()}%"
