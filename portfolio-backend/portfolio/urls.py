from django.urls import path
from .views import (
    get_projects,
    get_certifications,
    get_blog_posts,
    get_education,
    contact_messages,       #replaces get_contact_messages
    get_hobbies,
    get_homepage_summary,   #new for landing page
)

urlpatterns = [
    path('projects/', get_projects, name='get_projects'),
    path('certifications/', get_certifications, name='get_certifications'),
    path('blog/', get_blog_posts, name='get_blog_posts'),
    path('education/', get_education, name='get_education'),
    path('contact/', contact_messages, name='contact_messages'),  # ✅ GET + POST
    path('hobbies/', get_hobbies, name='get_hobbies'),

    # New route for landing page combined data
    path('homepage/', get_homepage_summary, name='get_homepage_summary'),
]
