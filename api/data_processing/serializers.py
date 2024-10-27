from rest_framework import serializers
from .models import UploadedFile, FileDataType

class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ['file']

class FileDataTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileDataType
        fields = ['column_name', 'data_type']

class UploadedFileDetailSerializer(serializers.ModelSerializer):
    data_types = FileDataTypeSerializer(many=True)

    class Meta:
        model = UploadedFile
        fields = ['id', 'file', 'uploaded_at', 'data_types']