from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models.project import Project
from .models.certification import Certification
from .models.blog import BlogPost
from .models.education import Coursework, DegreeProgress
from .models.contact import ContactMessage
from .models.hobby import Hobby

from .serializers import (
    ProjectSerializer, CertificationSerializer, BlogPostSerializer,
    CourseworkSerializer, DegreeProgressSerializer,
    ContactMessageSerializer, HobbySerializer
)


# ----------------- PROJECTS -----------------
@api_view(['GET'])
def get_projects(request):
    """Fetch all projects (latest first)."""
    projects = Project.objects.all().order_by('-created_at')
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)


# ----------------- CERTIFICATIONS -----------------
@api_view(['GET'])
def get_certifications(request):
    """Fetch all certifications (latest first)."""
    certifications = Certification.objects.all().order_by('-issue_date')
    serializer = CertificationSerializer(certifications, many=True)
    return Response(serializer.data)


# ----------------- BLOG POSTS -----------------
@api_view(['GET'])
def get_blog_posts(request):
    """Fetch all blog posts (latest first)."""
    blog_posts = BlogPost.objects.all().order_by('-created_at')
    serializer = BlogPostSerializer(blog_posts, many=True)
    return Response(serializer.data)


# ----------------- EDUCATION -----------------
@api_view(['GET'])
def get_education(request):
    """Fetch coursework and degree progress."""
    coursework = Coursework.objects.all().order_by('-completion_date')
    degree_progress = DegreeProgress.objects.first()

    coursework_serializer = CourseworkSerializer(coursework, many=True)
    degree_progress_serializer = (
        DegreeProgressSerializer(degree_progress) if degree_progress else None
    )

    return Response({
        "coursework": coursework_serializer.data,
        "degree_progress": (
            degree_progress_serializer.data if degree_progress_serializer else None
        ),
    })


# ----------------- HOBBIES -----------------
@api_view(['GET'])
def get_hobbies(request):
    """Fetch all hobbies."""
    hobbies = Hobby.objects.all()
    serializer = HobbySerializer(hobbies, many=True)
    return Response(serializer.data)


# ----------------- CONTACT MESSAGES -----------------
@api_view(['GET', 'POST'])
def contact_messages(request):
    """GET: List all contact messages | POST: Submit a new message."""
    if request.method == 'GET':
        messages = ContactMessage.objects.all().order_by('-sent_at')
        serializer = ContactMessageSerializer(messages, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Message received successfully!"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----------------- LANDING PAGE DATA (New!) -----------------
@api_view(['GET'])
def get_homepage_summary(request):
    """
    Fetch a summarized preview of all sections for the landing page.
    This helps render a compact 'showcase' on /home.
    """
    latest_projects = Project.objects.all().order_by('-created_at')[:3]
    recent_blogs = BlogPost.objects.all().order_by('-created_at')[:2]
    certifications = Certification.objects.all().order_by('-issue_date')[:2]
    hobbies = Hobby.objects.all()[:3]

    return Response({
        "projects": ProjectSerializer(latest_projects, many=True).data,
        "blogs": BlogPostSerializer(recent_blogs, many=True).data,
        "certifications": CertificationSerializer(certifications, many=True).data,
        "hobbies": HobbySerializer(hobbies, many=True).data,
    })
