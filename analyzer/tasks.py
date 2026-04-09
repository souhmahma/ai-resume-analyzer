from celery import shared_task
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def analyze_resume_task(self, resume_id):
    from resumes.models import Resume
    try:
        resume = Resume.objects.get(id=resume_id)
        logger.info(f"Analysis task received for resume #{resume_id}")
        return f"Resume #{resume_id} queued for analysis"

    except Resume.DoesNotExist:
        logger.error(f"Resume #{resume_id} not found")
        
    except Exception as e:
        logger.error(f"Analysis error: {e}", exc_info=True)
        raise self.retry(exc=e, countdown=60)