from celery import shared_task
from celery.utils.log import get_task_logger
import logging

logger = get_task_logger(__name__)

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def analyze_resume_task(self, resume_id):
    from resumes.models import Resume
    from .models import ResumeAnalysis
    from .gemini import analyze_resume

    try:
        resume = Resume.objects.get(id=resume_id)
        logger.info(f"Starting analysis for resume #{resume_id}")

        if not resume.raw_text:
            logger.error(f"No text found for resume #{resume_id}")
            resume.status = Resume.Status.FAILED
            resume.save()
            return

        analysis_data = analyze_resume(resume.raw_text, resume.job_title)

        ResumeAnalysis.objects.update_or_create(
            resume   = resume,
            defaults = {
                'overall_score'   : analysis_data['overall_score'],
                'content_score'   : analysis_data['content_score'],
                'structure_score' : analysis_data['structure_score'],
                'skills_score'    : analysis_data['skills_score'],
                'experience_score': analysis_data['experience_score'],
                'language_score'  : analysis_data['language_score'],
                'summary'         : analysis_data['summary'],
                'strengths'       : analysis_data['strengths'],
                'weaknesses'      : analysis_data['weaknesses'],
                'suggestions'     : analysis_data['suggestions'],
                'keywords_found'  : analysis_data['keywords_found'],
                'keywords_missing': analysis_data['keywords_missing'],
                'skills_detected' : analysis_data['skills_detected'],
            }
        )

        resume.status = Resume.Status.DONE
        resume.save()
        logger.info(f"Analysis complete for resume #{resume_id} — score: {analysis_data['overall_score']}")
        return f"Resume #{resume_id} analyzed — score: {analysis_data['overall_score']}"

    except Resume.DoesNotExist:
        logger.error(f"Resume #{resume_id} not found")

    except ValueError as e:
        logger.error(f"Analysis error: {e}")
        try:
            resume.status = Resume.Status.FAILED
            resume.save()
        except Exception:
            pass

    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise self.retry(exc=e)


@shared_task(bind=True, max_retries=2)
def generate_cover_letter_task(self, resume_id, company=''):
    from resumes.models import Resume
    from .models import ResumeAnalysis
    from .gemini import generate_cover_letter

    try:
        resume   = Resume.objects.get(id=resume_id)
        analysis = resume.analysis

        cover_letter = generate_cover_letter(
            resume.raw_text,
            resume.job_title,
            company
        )

        analysis.cover_letter = cover_letter
        analysis.save()
        return f"Cover letter generated for resume #{resume_id}"

    except Exception as e:
        logger.error(f"Cover letter task error: {e}")
        raise self.retry(exc=e)


@shared_task(bind=True, max_retries=2)
def generate_interview_questions_task(self, resume_id):
    from resumes.models import Resume
    from .models import ResumeAnalysis
    from .gemini import generate_interview_questions

    try:
        resume   = Resume.objects.get(id=resume_id)
        analysis = resume.analysis

        questions = generate_interview_questions(
            resume.raw_text,
            resume.job_title
        )

        analysis.interview_questions = questions
        analysis.save()
        return f"Interview questions generated for resume #{resume_id}"

    except Exception as e:
        logger.error(f"Interview questions task error: {e}")
        raise self.retry(exc=e)