from rest_framework import serializers
from .models.project import Project
from .models.certification import Certification
from .models.blog import BlogPost
from .models.education import Coursework, DegreeProgress
from .models.contact import ContactMessage
from .models.hobby import Hobby

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = '__all__'


class BlogPostSerializer(serializers.ModelSerializer):
    pdf_url = serializers.SerializerMethodField()
    has_web_content = serializers.ReadOnlyField()
    has_pdf = serializers.ReadOnlyField()

    class Meta:
        model = BlogPost
        fields = '__all__'

    def get_pdf_url(self, obj):
        if not obj.pdf:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(obj.pdf.url) if request else obj.pdf.url

class CourseworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coursework
        fields = '__all__'

class DegreeProgressSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()
    class Meta:
        model = DegreeProgress
        fields = '__all__'
    def get_progress(self, obj):
        return round(obj.progress_percentage(), 2)
    
class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'

class HobbySerializer(serializers.ModelSerializer):
    class Meta:
        model = Hobby
        fields = '__all__'
