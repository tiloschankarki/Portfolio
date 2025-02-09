from django.db import models

class PageInteraction(models.Model):
    date = models.DateField(auto_now_add=True)
    views = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.date} - {self.views} views"
