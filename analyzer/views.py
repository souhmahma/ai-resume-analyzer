from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from resumes.models import Resume
from .models import ResumeAnalysis
from .serializers import AnalysisSerializer
from .tasks import generate_cover_letter_task, generate_interview_questions_task
import logging

logger = logging.getLogger(__name__)


class AnalysisDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, resume_id):
        resume = get_object_or_404(Resume, id=resume_id, user=request.user)

        if not hasattr(resume, "analysis"):
            return Response(
                {
                    "error": True,
                    "code": "NOT_READY",
                    "message": "Analysis is not ready yet.",
                    "status": resume.status,
                },
                status=status.HTTP_202_ACCEPTED,
            )

        serializer = AnalysisSerializer(resume.analysis)
        return Response(serializer.data)


class GenerateCoverLetterView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, resume_id):
        resume = get_object_or_404(Resume, id=resume_id, user=request.user)
        company = request.data.get("company", "")

        if not hasattr(resume, "analysis"):
            return Response(
                {"error": True, "message": "Resume must be analyzed first."}, status=status.HTTP_400_BAD_REQUEST
            )

        if resume.analysis.cover_letter:
            return Response(
                {
                    "cover_letter": resume.analysis.cover_letter,
                    "cached": True,
                }
            )

        generate_cover_letter_task.delay(resume_id, company)

        return Response(
            {
                "message": "Cover letter generation started.",
                "status": "generating",
            },
            status=status.HTTP_202_ACCEPTED,
        )


class CoverLetterStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, resume_id):
        resume = get_object_or_404(Resume, id=resume_id, user=request.user)

        if not hasattr(resume, "analysis"):
            return Response({"ready": False})

        analysis = resume.analysis
        if analysis.cover_letter:
            return Response(
                {
                    "ready": True,
                    "cover_letter": analysis.cover_letter,
                }
            )
        return Response({"ready": False})


class GenerateInterviewQuestionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, resume_id):
        resume = get_object_or_404(Resume, id=resume_id, user=request.user)

        if not hasattr(resume, "analysis"):
            return Response(
                {"error": True, "message": "Resume must be analyzed first."}, status=status.HTTP_400_BAD_REQUEST
            )

        if resume.analysis.interview_questions:
            return Response(
                {
                    "questions": resume.analysis.interview_questions,
                    "cached": True,
                }
            )

        generate_interview_questions_task.delay(resume_id)

        return Response(
            {
                "message": "Interview questions generation started.",
                "status": "generating",
            },
            status=status.HTTP_202_ACCEPTED,
        )


class InterviewQuestionsStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, resume_id):
        resume = get_object_or_404(Resume, id=resume_id, user=request.user)

        if not hasattr(resume, "analysis"):
            return Response({"ready": False})

        analysis = resume.analysis
        if analysis.interview_questions:
            return Response(
                {
                    "ready": True,
                    "questions": analysis.interview_questions,
                }
            )
        return Response({"ready": False})


class RegenerateAnalysisView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, resume_id):
        from analyzer.tasks import analyze_resume_task

        resume = get_object_or_404(Resume, id=resume_id, user=request.user)

        if not resume.raw_text:
            return Response(
                {"error": True, "message": "No text found in this resume."}, status=status.HTTP_400_BAD_REQUEST
            )

        resume.status = Resume.Status.ANALYZING
        resume.save()

        analyze_resume_task.delay(resume_id)

        return Response(
            {
                "message": "Re-analysis started.",
                "status": "analyzing",
            }
        )
