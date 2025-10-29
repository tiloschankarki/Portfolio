from django.db import models

class PageInteraction(models.Model):
    date = models.DateField(auto_now_add=True)
    views = models.IntegerField(default=0)
    page_name = models.CharField(max_length=255)


    def __str__(self):
        return f"{self.date} - {self.views} views"
