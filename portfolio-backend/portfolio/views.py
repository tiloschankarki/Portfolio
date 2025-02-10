from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models.project import Project
from .models.certification import Certification
from .models.blog import BlogPost
from .models.education import Coursework, DegreeProgress
from .models.contact import ContactMessage
from .models.hobby import Hobby
from .serializers import (
    ProjectSerializer, CertificationSerializer, BlogPostSerializer,
    CourseworkSerializer, DegreeProgressSerializer, ContactMessageSerializer, HobbySerializer
)

@api_view(['GET'])
def get_projects(request):
    projects = Project.objects.all().order_by('-created_at')
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_certifications(request):
    certifications = Certification.objects.all().order_by('-issue_date')
    serializer = CertificationSerializer(certifications, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_blog_posts(request):
    blog_posts = BlogPost.objects.all().order_by('-created_at')
    serializer = BlogPostSerializer(blog_posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_education(request):
    coursework = Coursework.objects.all().order_by('-completion_date')
    degree_progress = DegreeProgress.objects.all()

    coursework_serializer = CourseworkSerializer(coursework, many=True)
    degree_progress_serializer = DegreeProgressSerializer(degree_progress, many=True)

    return Response({
        "coursework": coursework_serializer.data,
        "degree_progress": degree_progress_serializer.data
    })


@api_view(['GET'])
def get_contact_messages(request):
    contact_messages = ContactMessage.objects.all().order_by('-sent_at')
    serializer = ContactMessageSerializer(contact_messages, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_hobbies(request):
    hobbies = Hobby.objects.all()
    serializer = HobbySerializer(hobbies, many=True)
    return Response(serializer.data)
