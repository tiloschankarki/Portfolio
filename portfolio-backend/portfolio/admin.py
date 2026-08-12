from django.contrib import admin
from .models.project import Project
from .models.certification import Certification
from .models.blog import BlogPost
from .models.education import Coursework, DegreeProgress  # Updated
from .models.contact import ContactMessage
from .models.hobby import Hobby

admin.site.register(Project)
admin.site.register(Certification)
admin.site.register(Coursework)
admin.site.register(DegreeProgress)
admin.site.register(ContactMessage)
admin.site.register(Hobby)


@admin.register(BlogPost)
class ResearchEntryAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'content_type',
        'status',
        'research_area',
        'created_at',
    )
    list_filter = ('content_type', 'status', 'research_area')
    search_fields = ('title', 'description', 'content')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Research entry', {
            'fields': ('title', 'description', 'research_area'),
        }),
        ('Classification', {
            'fields': ('content_type', 'status'),
        }),
        ('Reading options', {
            'fields': ('content', 'reading_time', 'pdf_url'),
        }),
        ('Legacy metadata', {
            'fields': ('category',),
            'classes': ('collapse',),
        }),
        ('Dates', {
            'fields': ('created_at',),
        }),
    )
