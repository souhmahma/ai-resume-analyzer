from django.urls import path
from . import views

urlpatterns = [
    path('resumes/<int:resume_id>/analysis/',
         views.AnalysisDetailView.as_view(),
         name='analysis-detail'),

    path('resumes/<int:resume_id>/analysis/regenerate/',
         views.RegenerateAnalysisView.as_view(),
         name='analysis-regenerate'),

    path('resumes/<int:resume_id>/cover-letter/',
         views.GenerateCoverLetterView.as_view(),
         name='cover-letter-generate'),

    path('resumes/<int:resume_id>/cover-letter/status/',
         views.CoverLetterStatusView.as_view(),
         name='cover-letter-status'),

    path('resumes/<int:resume_id>/interview/',
         views.GenerateInterviewQuestionsView.as_view(),
         name='interview-generate'),

    path('resumes/<int:resume_id>/interview/status/',
         views.InterviewQuestionsStatusView.as_view(),
         name='interview-status'),
]