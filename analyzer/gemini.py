from google import genai
from google.genai import types
from django.conf import settings
import json
import logging
import re

logger = logging.getLogger(__name__)

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def clean_json_response(text):
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*',     '', text)
    return text.strip()

def analyze_resume(raw_text, job_title=''):
    job_context = f"for a {job_title} position" if job_title else ""

    prompt = f"""
You are an expert HR consultant and resume coach.
Analyze the following resume {job_context} and return a detailed JSON analysis.

RESUME TEXT:
{raw_text}

Return ONLY a valid JSON object with this exact structure:
{{
    "overall_score"  : <integer 0-100>,
    "content_score"  : <integer 0-100>,
    "structure_score": <integer 0-100>,
    "skills_score"   : <integer 0-100>,
    "experience_score": <integer 0-100>,
    "language_score" : <integer 0-100>,
    "summary"        : "<2-3 sentences about this resume>",
    "strengths"      : ["<strength 1>", "<strength 2>", "<strength 3>"],
    "weaknesses"     : ["<weakness 1>", "<weakness 2>"],
    "suggestions"    : [
        {{
            "category"  : "<Content/Structure/Skills/Language>",
            "priority"  : "<high/medium/low>",
            "suggestion": "<specific actionable suggestion>",
            "example"   : "<concrete example>"
        }}
    ],
    "keywords_found"  : ["<keyword1>", "<keyword2>"],
    "keywords_missing": ["<keyword1>", "<keyword2>"],
    "skills_detected" : ["<skill1>", "<skill2>"]
}}

Return ONLY the JSON, nothing else.
"""

    try:
        response = client.models.generate_content(
            model    = 'gemini-2.5-flash-lite',
            contents = prompt,
        )

        cleaned = clean_json_response(response.text)
        data    = json.loads(cleaned)

        # Clamp scores to 0-100
        score_fields = [
            'overall_score', 'content_score', 'structure_score',
            'skills_score', 'experience_score', 'language_score'
        ]
        for field in score_fields:
            data[field] = max(0, min(100, int(data.get(field, 0))))

        return data

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {e}\nRaw: {response.text[:500]}")
        raise ValueError("AI returned invalid response. Please try again.")
    except Exception as e:
        logger.error(f"Gemini API error: {e}", exc_info=True)
        raise ValueError(f"AI analysis failed: {str(e)}")


def generate_cover_letter(raw_text, job_title='', company=''):
    prompt = f"""
Write a professional cover letter based on this resume.
{"Target position: " + job_title if job_title else ""}
{"Target company: " + company if company else ""}

RESUME:
{raw_text}

Write a compelling 3-4 paragraph cover letter.
Return ONLY the cover letter text, nothing else.
"""

    try:
        response = client.models.generate_content(
            model    = 'gemini-2.5-flash-lite',
            contents = prompt,
        )
        return response.text.strip()
    except Exception as e:
        logger.error(f"Cover letter error: {e}")
        raise ValueError("Could not generate cover letter.")


def generate_interview_questions(raw_text, job_title=''):
    prompt = f"""
Generate 10 realistic interview questions based on this resume.
{"Position: " + job_title if job_title else ""}

RESUME:
{raw_text}

Return ONLY a valid JSON array:
[
    {{
        "category"  : "<Technical/Behavioral/Experience/Situational>",
        "difficulty": "<easy/medium/hard>",
        "question"  : "<the interview question>",
        "hint"      : "<what a good answer should cover>"
    }}
]

Return ONLY the JSON array, nothing else.
"""

    try:
        response = client.models.generate_content(
            model    = 'gemini-2.5-flash-lite',
            contents = prompt,
        )
        cleaned = clean_json_response(response.text)
        data    = json.loads(cleaned)
        return data if isinstance(data, list) else []
    except Exception as e:
        logger.error(f"Interview questions error: {e}")
        raise ValueError("Could not generate interview questions.")
