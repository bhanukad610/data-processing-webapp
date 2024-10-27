from django.urls import path
from .views import FileUploadView, UploadedFileListView

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('files/', UploadedFileListView.as_view(), name='uploaded-file-list')
]