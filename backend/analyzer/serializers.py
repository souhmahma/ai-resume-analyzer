from rest_framework import serializers
from .models import ResumeAnalysis


class AnalysisSerializer(serializers.ModelSerializer):
    score_label = serializers.ReadOnlyField()
    score_color = serializers.ReadOnlyField()
    resume_filename = serializers.CharField(source="resume.filename", read_only=True)
    resume_job_title = serializers.CharField(source="resume.job_title", read_only=True)

    class Meta:
        model = ResumeAnalysis
        fields = [
            "id",
            "resume_filename",
            "resume_job_title",
            "overall_score",
            "content_score",
            "structure_score",
            "skills_score",
            "experience_score",
            "language_score",
            "score_label",
            "score_color",
            "summary",
            "strengths",
            "weaknesses",
            "suggestions",
            "keywords_found",
            "keywords_missing",
            "skills_detected",
            "cover_letter",
            "interview_questions",
            "created_at",
        ]
