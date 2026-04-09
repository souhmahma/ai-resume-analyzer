from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    avatar     = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio        = models.TextField(blank=True)
    job_title  = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username

    @property
    def resumes_count(self):
        return self.resumes.count()