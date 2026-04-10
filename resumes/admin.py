from django.contrib import admin
from .models import Resume

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display  = ['filename', 'user', 'file_type', 'status', 'created_at']
    list_filter   = ['status', 'file_type']
    search_fields = ['filename', 'user__username', 'user__email']
    ordering      = ['-created_at']
    readonly_fields = ['raw_text', 'created_at', 'updated_at']