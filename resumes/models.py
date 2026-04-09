from django.db import models
from accounts.models import User
import uuid
import os

def resume_upload_path(instance, filename):
    ext  = filename.split('.')[-1]
    name = f"{uuid.uuid4()}.{ext}"
    return f"resumes/{instance.user.id}/{name}"

class Resume(models.Model):
    class Status(models.TextChoices):
        UPLOADED  = 'uploaded',  'Uploaded'
        PARSING   = 'parsing',   'Parsing'
        ANALYZING = 'analyzing', 'Analyzing'
        DONE      = 'done',      'Done'
        FAILED    = 'failed',    'Failed'

    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes')
    file       = models.FileField(upload_to=resume_upload_path)
    filename   = models.CharField(max_length=255)
    file_size  = models.PositiveIntegerField(default=0)
    file_type  = models.CharField(max_length=10)
    raw_text   = models.TextField(blank=True)
    status     = models.CharField(max_length=20, choices=Status.choices, default=Status.UPLOADED)
    job_title  = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} — {self.filename}"

    @property
    def file_size_mb(self):
        return round(self.file_size / (1024 * 1024), 2)

    def delete(self, *args, **kwargs):
        if self.file:
            if os.path.isfile(self.file.path):
                os.remove(self.file.path)
        super().delete(*args, **kwargs)