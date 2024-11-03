from django.urls import path
from .views import FileUploadView, UploadedFileListView, UploadedFileFilterView

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('files/', UploadedFileListView.as_view(), name='uploaded-file-list'),
    path('files/search/', UploadedFileFilterView.as_view(), name='file-filter')
]