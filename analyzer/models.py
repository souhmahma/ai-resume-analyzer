from django.db import models
from resumes.models import Resume

class ResumeAnalysis(models.Model):
    resume        = models.OneToOneField(Resume, on_delete=models.CASCADE, related_name='analysis')
    overall_score = models.PositiveIntegerField(default=0)

    # Section scores
    content_score    = models.PositiveIntegerField(default=0)
    structure_score  = models.PositiveIntegerField(default=0)
    skills_score     = models.PositiveIntegerField(default=0)
    experience_score = models.PositiveIntegerField(default=0)
    language_score   = models.PositiveIntegerField(default=0)

    # AI outputs
    summary          = models.TextField(blank=True)
    strengths        = models.JSONField(default=list)
    weaknesses       = models.JSONField(default=list)
    suggestions      = models.JSONField(default=list)
    keywords_found   = models.JSONField(default=list)
    keywords_missing = models.JSONField(default=list)
    skills_detected  = models.JSONField(default=list)

    # Generated content
    cover_letter     = models.TextField(blank=True)
    interview_questions = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Analysis for {self.resume.filename} — {self.overall_score}%"

    @property
    def score_label(self):
        if self.overall_score >= 85:
            return 'Excellent'
        elif self.overall_score >= 70:
            return 'Good'
        elif self.overall_score >= 50:
            return 'Average'
        else:
            return 'Needs work'

    @property
    def score_color(self):
        if self.overall_score >= 85:
            return 'green'
        elif self.overall_score >= 70:
            return 'blue'
        elif self.overall_score >= 50:
            return 'yellow'
        else:
            return 'red'