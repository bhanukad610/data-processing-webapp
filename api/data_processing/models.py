from django.db import models

class UploadedFile(models.Model):
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name


class FileDataType(models.Model):
    uploaded_file = models.ForeignKey(UploadedFile, on_delete=models.CASCADE, related_name="data_types")
    column_name = models.CharField(max_length=255)
    data_type = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.column_name}: {self.data_type}"