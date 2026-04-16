from django.db import models
from django.conf import settings
from department.models import Department


class Employee(models.Model):

    # Link employee to a user account (One-to-One relationship)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='employee_profile'
    )

    # Employee ID (unique company identifier)
    employee_id = models.CharField(max_length=20, unique=True,db_index=True)

    # Link employee to a department
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,         #department becomes null not employee deleted
        null=True,
        related_name='employees'
    )

    # Job title
    designation = models.CharField(max_length=100)

    # Monthly salary
    salary = models.DecimalField(max_digits=10, decimal_places=2)

    # Date employee joined company
    joining_date = models.DateField()

    # Soft delete flag
    is_active = models.BooleanField(default=True)

    # Timestamp when record created
    created_at = models.DateTimeField(auto_now_add=True)

    # Leave balance fields
    leave_balance = models.PositiveIntegerField(default=15)
    

    def __str__(self):
        return f"{self.user.username} - {self.employee_id}"