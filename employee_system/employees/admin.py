from django.contrib import admin
from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('employee_id', 'user', 'department', 'designation', 'salary', 'is_active')
    search_fields = ('employee_id', 'user__username')
    list_filter = ('department', 'is_active')