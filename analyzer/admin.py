from django.contrib import admin
from .models import ResumeAnalysis


@admin.register(ResumeAnalysis)
class ResumeAnalysisAdmin(admin.ModelAdmin):
    list_display = ["resume", "overall_score", "score_label", "created_at"]
    list_filter = ["overall_score"]
    ordering = ["-overall_score"]
    readonly_fields = [
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
