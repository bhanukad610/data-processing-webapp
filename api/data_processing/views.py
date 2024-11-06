import logging
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
from django.db.models import Q

logger = logging.getLogger(__name__)

class FileUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        file_serializer = UploadedFileSerializer(data=request.data)
        
        if file_serializer.is_valid():
            file_instance = file_serializer.save()
            file_path = file_instance.file.path

            try:
                # Determine file type and read file
                if file_path.endswith('.csv'):
                    try:
                        df = pd.read_csv(file_path)
                    except pd.errors.EmptyDataError:
                        logger.error(f"File at {file_path} is empty.")
                        return Response({"error": "The uploaded CSV file is empty."}, status=status.HTTP_400_BAD_REQUEST)
                    except pd.errors.ParserError:
                        logger.error(f"Parsing error in CSV file at {file_path}.")
                        return Response({"error": "CSV file could not be parsed."}, status=status.HTTP_400_BAD_REQUEST)
                elif file_path.endswith(('.xls', '.xlsx')):
                    try:
                        df = pd.read_excel(file_path, engine='openpyxl')
                    except ValueError:
                        logger.error(f"File at {file_path} is not a valid Excel file.")
                        return Response({"error": "Invalid Excel file format."}, status=status.HTTP_400_BAD_REQUEST)
                    except KeyError:
                        logger.error(f"Excel file at {file_path} has missing columns or headers.")
                        return Response({"error": "Excel file is missing columns or headers."}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    logger.warning(f"Unsupported file format for file at {file_path}.")
                    return Response({"error": "Unsupported file format. Please upload a CSV or Excel file."}, status=status.HTTP_400_BAD_REQUEST)

                # Infer and convert data types
                try:
                    df, data_types = infer_and_convert_data_types(df)
                except Exception as e:
                    logger.error(f"Data type inference failed for file at {file_path}. Error: {e}")
                    return Response({"error": "Data processing error. Please check your file format and contents."}, status=status.HTTP_400_BAD_REQUEST)

                # Save each column's data type in FileDataType model
                try:
                    for column, dtype in data_types.items():
                        FileDataType.objects.create(
                            uploaded_file=file_instance,
                            column_name=column,
                            data_type=dtype
                        )
                except Exception as e:
                    logger.error(f"Failed to save data types to database for file at {file_path}. Error: {e}")
                    return Response({"error": "Database error. Failed to save data types."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                return Response(data_types, status=status.HTTP_200_OK)
                
            except Exception as e:
                logger.exception(f"Unexpected error occurred while processing file at {file_path}. Error: {e}")
                return Response({"error": "An unexpected error occurred while processing the file."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        logger.error("File upload data is invalid.")
        return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomPagination(PageNumberPagination):
    page_size = 5  # Items per page
    page_size_query_param = 'page_size'
    max_page_size = 10

class UploadedFileListView(ListAPIView):
    queryset = UploadedFile.objects.all()
    serializer_class = UploadedFileDetailSerializer
    pagination_class = CustomPagination

class UploadedFileFilterView(ListAPIView):
    serializer_class = UploadedFileDetailSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = UploadedFile.objects.all().order_by('-uploaded_at')
        search_query = self.request.query_params.get('search', None)
        if search_query:
            # Modify this filter condition based on your needs
            queryset = queryset.filter(
                Q(file__icontains=search_query)
            ).distinct()
        return queryset