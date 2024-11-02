from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import UploadedFile, FileDataType
from .serializers import UploadedFileSerializer, UploadedFileDetailSerializer
from rest_framework.pagination import PageNumberPagination
from .utils import infer_and_convert_data_types
import pandas as pd

class FileUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        file_serializer = UploadedFileSerializer(data=request.data)
        
        if file_serializer.is_valid():
            file_instance = file_serializer.save()
            file_path = file_instance.file.path

            try:
                # Read file and infer types
                df = pd.read_csv(file_path)
                df, data_types = infer_and_convert_data_types(df)

                # Save each column's data type in FileDataType
                for column, dtype in data_types.items():
                    FileDataType.objects.create(
                        uploaded_file=file_instance,
                        column_name=column,
                        data_type=dtype
                    )

                return Response(data_types, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomPagination(PageNumberPagination):
    page_size = 5  # Items per page
    page_size_query_param = 'page_size'
    max_page_size = 10

class UploadedFileListView(ListAPIView):
    queryset = UploadedFile.objects.all()
    serializer_class = UploadedFileDetailSerializer
    pagination_class = CustomPagination