from django.db import models

class Hobby(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='hobbies/')
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title
