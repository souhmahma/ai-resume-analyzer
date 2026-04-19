from rest_framework import serializers
from .models import Resume
from .utils import validate_resume_file


class ResumeUploadSerializer(serializers.ModelSerializer):
    file = serializers.FileField()

    class Meta:
        model = Resume
        fields = ["id", "file", "job_title"]

    def validate_file(self, value):
        try:
            validate_resume_file(value)
        except ValueError as e:
            raise serializers.ValidationError(str(e))
        return value


class ResumeSerializer(serializers.ModelSerializer):
    file_size_mb = serializers.ReadOnlyField()
    has_analysis = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = [
            "id",
            "filename",
            "file_size",
            "file_size_mb",
            "file_type",
            "status",
            "job_title",
            "has_analysis",
            "created_at",
            "updated_at",
        ]

    def get_has_analysis(self, obj):
        return hasattr(obj, "analysis")


class ResumeListSerializer(serializers.ModelSerializer):
    has_analysis = serializers.SerializerMethodField()
    score = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = ["id", "filename", "file_type", "status", "job_title", "has_analysis", "score", "created_at"]

    def get_has_analysis(self, obj):
        return hasattr(obj, "analysis")

    def get_score(self, obj):
        if hasattr(obj, "analysis"):
            return obj.analysis.overall_score
        return None
