import pdfplumber
import docx
import logging

logger = logging.getLogger(__name__)

def clean_text(text):
    if not text:
        return ""
    return text.replace('\x00', '')

def extract_text_from_pdf(file_path):
    try:
        text = ''
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + '\n'
        return text.strip()
    except Exception as e:
        logger.error(f"PDF extraction error: {e}")
        raise ValueError(f"Could not extract text from PDF: {str(e)}")

def extract_text_from_docx(file_path):
    try:
        doc = docx.Document(file_path)
        text = '\n'.join([para.text for para in doc.paragraphs if para.text.strip()])
        return text.strip()
    except Exception as e:
        logger.error(f"DOCX extraction error: {e}")
        raise ValueError(f"Could not extract text from DOCX: {str(e)}")

def extract_text(file_path, file_type):
    raw_content = ""
    if file_type == 'pdf':
        raw_content = extract_text_from_pdf(file_path)
    elif file_type in ['docx', 'doc']:
        raw_content = extract_text_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_type}")
    
    # Très important pour Railway/Postgres : on nettoie le texte
    return clean_text(raw_content)

def validate_resume_file(file):
    MAX_SIZE = 10 * 1024 * 1024  # 10MB
    ALLOWED_TYPES = ['pdf', 'docx', 'doc']

    if file.size > MAX_SIZE:
        raise ValueError(f"File too large. Maximum size is 10MB.")

    ext = file.name.split('.')[-1].lower()
    if ext not in ALLOWED_TYPES:
        raise ValueError(f"Invalid file type. Only PDF and DOCX are allowed.")

    return ext
