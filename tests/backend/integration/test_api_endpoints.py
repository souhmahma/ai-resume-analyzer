import pytest
import io
from unittest.mock import patch
from rest_framework.test import APIClient

@pytest.fixture
def api_client():
    return APIClient()

def make_mock_pdf(name="test.pdf", content=b"%PDF-1.4 mock content"):
    f = io.BytesIO(content)
    f.name = name
    return f

class TestResumeUpload:
    @pytest.mark.django_db
    @patch("resumes.views.extract_text") 
    @patch("resumes.views.analyze_resume_task.delay")
    def test_upload_pdf_success(self, mock_task, mock_extract, api_client, django_user_model):
        # Configuration des mocks
        mock_extract.return_value = "Ceci est un texte de CV extrait avec succès."
        
        user = django_user_model.objects.create_user(username="uploader", password="pass123")
        api_client.force_authenticate(user=user)

        fake_pdf = make_mock_pdf()
        resp = api_client.post("/api/resumes/upload/", {
            "file": fake_pdf,
            "job_title": "Software Engineer",
        }, format="multipart")

        assert resp.status_code == 201
        assert mock_task.called

class TestAnalysisResponse:
    @pytest.mark.django_db
    @patch("resumes.views.extract_text")
    @patch("resumes.views.analyze_resume_task.delay") 
    def test_response_has_id_and_status(self, mock_task, mock_extract, api_client, django_user_model):
        mock_extract.return_value = "Texte simulé"
        
        user = django_user_model.objects.create_user(username="scoreuser", password="pass")
        api_client.force_authenticate(user=user)

        resp = api_client.post("/api/resumes/upload/", {
            "file": make_mock_pdf(),
            "job_title": "Data Scientist",
        }, format="multipart")

        assert resp.status_code == 201
        data = resp.json()
        assert "id" in data
        assert data["status"] in ["parsing", "analyzing"]