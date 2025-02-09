from django.db import models

class Coursework(models.Model):
    course_name = models.CharField(max_length=200)
    institution = models.CharField(max_length=255)
    completion_date = models.DateField()

    def __str__(self):
        return f"{self.course_name} - {self.institution}"
