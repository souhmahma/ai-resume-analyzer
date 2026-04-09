from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import Resume
from .serializers import ResumeUploadSerializer, ResumeSerializer, ResumeListSerializer
from .utils import extract_text, validate_resume_file
from analyzer.tasks import analyze_resume_task
import logging

logger = logging.getLogger(__name__)

class ResumeUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request):
        file      = request.FILES.get('file')
        job_title = request.data.get('job_title', '')

        if not file:
            return Response(
                {'error': True, 'message': 'No file provided.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Validate file
            file_type = validate_resume_file(file)

            # Create resume record
            resume = Resume.objects.create(
                user      = request.user,
                file      = file,
                filename  = file.name,
                file_size = file.size,
                file_type = file_type,
                job_title = job_title,
                status    = Resume.Status.PARSING,
            )

            # Extract text
            try:
                raw_text      = extract_text(resume.file.path, file_type)
                resume.raw_text = raw_text
                resume.status   = Resume.Status.ANALYZING
                resume.save()

                # Trigger async analysis
                analyze_resume_task.delay(resume.id)

            except ValueError as e:
                resume.status = Resume.Status.FAILED
                resume.save()
                return Response(
                    {'error': True, 'message': str(e)},
                    status=status.HTTP_422_UNPROCESSABLE_ENTITY
                )

            return Response({
                'id'     : resume.id,
                'status' : resume.status,
                'message': 'Resume uploaded successfully. Analysis started!',
            }, status=status.HTTP_201_CREATED)

        except ValueError as e:
            return Response(
                {'error': True, 'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Upload error: {e}", exc_info=True)
            return Response(
                {'error': True, 'message': 'Upload failed. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ResumeListView(generics.ListAPIView):
    serializer_class   = ResumeListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(
            user=self.request.user
        ).select_related('analysis').order_by('-created_at')

class ResumeDetailView(generics.RetrieveDestroyAPIView):
    serializer_class   = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        resume = self.get_object()
        resume.delete()
        return Response(
            {'message': 'Resume deleted successfully.'},
            status=status.HTTP_200_OK
        )

class ResumeStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        resume = get_object_or_404(Resume, pk=pk, user=request.user)
        data   = {
            'id'        : resume.id,
            'status'    : resume.status,
            'has_analysis': hasattr(resume, 'analysis'),
        }
        if hasattr(resume, 'analysis'):
            data['score'] = resume.analysis.overall_score
        return Response(data)