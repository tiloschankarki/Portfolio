from django.db import models

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    message_type = models.CharField(max_length=50, choices=[
        ('Job Inquiry', 'Job Inquiry'),
        ('Collaboration', 'Collaboration'),
        ('General Inquiry', 'General Inquiry')
    ])
    linkedin_url = models.URLField(blank=True, null=True)
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} - {self.message_type}"
