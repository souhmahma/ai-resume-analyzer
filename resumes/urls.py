from django.urls import path
from . import views

urlpatterns = [
    path("resumes/", views.ResumeListView.as_view(), name="resume-list"),
    path("resumes/upload/", views.ResumeUploadView.as_view(), name="resume-upload"),
    path("resumes/<int:pk>/", views.ResumeDetailView.as_view(), name="resume-detail"),
    path("resumes/<int:pk>/status/", views.ResumeStatusView.as_view(), name="resume-status"),
]
