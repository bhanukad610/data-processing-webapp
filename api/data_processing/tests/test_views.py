import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile

@pytest.mark.django_db
def test_file_upload():
    client = APIClient()
    # Create a simple CSV file
    file_data = b"column1,column2\nvalue1,value2"
    file = SimpleUploadedFile("test.csv", file_data, content_type="text/csv")
    url = reverse("file-upload")  # Make sure the URL name matches your URL configuration
    response = client.post(url, {"file": file}, format="multipart")

    assert response.status_code == status.HTTP_200_OK
    assert "column1" in response.data
    assert "column2" in response.data

@pytest.mark.django_db
def test_file_list_pagination():
    client = APIClient()
    url = reverse("uploaded-file-list")
    response = client.get(url, {"page": 1})

    assert response.status_code == status.HTTP_200_OK
    assert "results" in response.data
    assert "count" in response.data

@pytest.mark.django_db
def test_file_search():
    client = APIClient()
    url = reverse("file-filter")
    response = client.get(url, {"search": "test"})  # Assume "test" matches some file name

    assert response.status_code == status.HTTP_200_OK
    assert "results" in response.data