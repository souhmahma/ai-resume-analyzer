import google.generativeai as genai
from django.conf import settings
import json
import logging
import re

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)

def get_model():
    return genai.GenerativeModel('gemini-1.5-flash')

def clean_json_response(text):
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*',     '', text)
    return text.strip()

def analyze_resume(raw_text, job_title=''):
    model = get_model()

    job_context = f"for a {job_title} position" if job_title else ""

    prompt = f"""
You are an expert HR consultant and resume coach.
Analyze the following resume {job_context} and return a detailed JSON analysis.

RESUME TEXT:
{raw_text}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{{
    "overall_score": <integer 0-100>,
    "content_score": <integer 0-100>,
    "structure_score": <integer 0-100>,
    "skills_score": <integer 0-100>,
    "experience_score": <integer 0-100>,
    "language_score": <integer 0-100>,
    "summary": "<2-3 sentences about this resume overall>",
    "strengths": [
        "<strength 1>",
        "<strength 2>",
        "<strength 3>"
    ],
    "weaknesses": [
        "<weakness 1>",
        "<weakness 2>"
    ],
    "suggestions": [
        {{
            "category": "<category like Content/Structure/Skills/Language>",
            "priority": "<high/medium/low>",
            "suggestion": "<specific actionable suggestion>",
            "example": "<concrete example of how to improve>"
        }}
    ],
    "keywords_found": ["<keyword1>", "<keyword2>"],
    "keywords_missing": ["<keyword1>", "<keyword2>"],
    "skills_detected": ["<skill1>", "<skill2>", "<skill3>"]
}}

Scoring rules:
- overall_score: weighted average of all section scores
- content_score: relevance and quality of content
- structure_score: organization, formatting, readability
- skills_score: technical and soft skills presence
- experience_score: work experience quality and relevance
- language_score: grammar, clarity, professional tone

Be specific and actionable in suggestions.
Return ONLY the JSON, nothing else.
"""

    try:
        response = model.generate_content(prompt)
        cleaned  = clean_json_response(response.text)
        data     = json.loads(cleaned)

        required = [
            'overall_score', 'content_score', 'structure_score',
            'skills_score', 'experience_score', 'language_score',
            'summary', 'strengths', 'weaknesses', 'suggestions',
            'keywords_found', 'keywords_missing', 'skills_detected'
        ]
        for field in required:
            if field not in data:
                data[field] = [] if field not in ['overall_score', 'summary'] else (0 if field != 'summary' else '')

        score_fields = [
            'overall_score', 'content_score', 'structure_score',
            'skills_score', 'experience_score', 'language_score'
        ]
        for field in score_fields:
            data[field] = max(0, min(100, int(data.get(field, 0))))

        return data

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {e}\nRaw response: {response.text}")
        raise ValueError("AI returned invalid response. Please try again.")
    except Exception as e:
        logger.error(f"Gemini API error: {e}", exc_info=True)
        raise ValueError(f"AI analysis failed: {str(e)}")


def generate_cover_letter(raw_text, job_title='', company=''):
    """Generate a professional cover letter"""
    model = get_model()

    prompt = f"""
You are an expert career coach. Write a professional, personalized cover letter
based on the resume below.

{"Target position: " + job_title if job_title else ""}
{"Target company: " + company if company else ""}

RESUME:
{raw_text}

Write a compelling cover letter that:
- Is professional and engaging
- Highlights the candidate's strongest points
- Is tailored to the position/company if provided
- Is 3-4 paragraphs long
- Starts with a strong opening hook
- Ends with a clear call to action

Return ONLY the cover letter text, no subject line, no formatting markers.
"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Cover letter error: {e}")
        raise ValueError("Could not generate cover letter. Please try again.")


def generate_interview_questions(raw_text, job_title=''):
    """Generate likely interview questions based on resume"""
    model = get_model()

    prompt = f"""
You are a senior technical interviewer. Based on this resume, generate realistic
interview questions that an interviewer would ask.

{"Position: " + job_title if job_title else ""}

RESUME:
{raw_text}

Return ONLY a valid JSON array with 10 interview questions:
[
    {{
        "category": "<Technical/Behavioral/Experience/Situational>",
        "difficulty": "<easy/medium/hard>",
        "question": "<the interview question>",
        "hint": "<what a good answer should cover>"
    }}
]

Include a mix of:
- Technical questions about their skills
- Behavioral questions (STAR format)
- Questions about specific experiences on the resume
- Situational/problem-solving questions

Return ONLY the JSON array, nothing else.
"""

    try:
        response = model.generate_content(prompt)
        cleaned  = clean_json_response(response.text)
        data     = json.loads(cleaned)
        return data if isinstance(data, list) else []
    except Exception as e:
        logger.error(f"Interview questions error: {e}")
        raise ValueError("Could not generate interview questions.")