from django.contrib import admin
from .models.project import Project
from .models.certification import Certification
from .models.blog import BlogPost
from .models.education import Coursework, DegreeProgress  # Updated
from .models.contact import ContactMessage
from .models.hobby import Hobby

admin.site.register(Project)
admin.site.register(Certification)
admin.site.register(BlogPost)
admin.site.register(Coursework)
admin.site.register(DegreeProgress)
admin.site.register(ContactMessage)
admin.site.register(Hobby)
