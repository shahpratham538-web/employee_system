from django.db import models
from employees.models import Employee


class Attendance(models.Model):

    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )

    date = models.DateField()

    check_in = models.DateTimeField(null=True, blank=True)
    check_out = models.DateTimeField(null=True, blank=True)

    working_hours = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    is_late = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.employee.employee_id} - {self.date}"
