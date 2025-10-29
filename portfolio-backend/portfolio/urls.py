from django.urls import path
from .views import (
    get_projects, get_certifications, get_blog_posts,
    get_education, get_contact_messages, get_hobbies
)

urlpatterns = [
    path('projects/', get_projects, name='get_projects'),
    path('certifications/', get_certifications, name='get_certifications'),
    path('blog/', get_blog_posts, name='get_blog_posts'),
    path('education/', get_education, name='get_education'),  # Combined coursework & degree progress
    path('contact/', get_contact_messages, name='get_contact_messages'),
    path('hobbies/', get_hobbies, name='get_hobbies'),
]
