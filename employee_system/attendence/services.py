from django.utils import timezone
from django.core.exceptions import ValidationError
from datetime import datetime
from datetime import date
from django.db.models import Sum
from datetime import time


from employees.models import Employee
from .models import Attendance


class AttendanceService:

    @staticmethod
    def check_in(user):
        # Get employee linked to user
        try:
            employee = user.employee_profile
        except Employee.DoesNotExist:
            raise ValidationError("Employee profile not found")

        today = date.today()

        # Check if attendance already exists for today
        attendance, created = Attendance.objects.get_or_create(
            employee=employee,
            date=today
        )

        # Prevent multiple check-ins
        if attendance.check_in is not None:
            raise ValidationError("Already checked in today")

        attendance.check_in = timezone.now()
        current_time = timezone.location().time()
        if current_time > time(9,30):
            attendance.is_late = True
        attendance.save()

        return attendance

    @staticmethod
    def check_out(user):
        try:
            employee = user.employee_profile
        except Employee.DoesNotExist:
            raise ValidationError("Employee profile not found")

        today = date.today()

        try:
            attendance = Attendance.objects.get(employee=employee, date=today)
        except Attendance.DoesNotExist:
            raise ValidationError("You must check-in first")

        # Prevent multiple check-outs
        if attendance.check_out is not None:
            raise ValidationError("Already checked out today")

        if attendance.check_in is None:
            raise ValidationError("Check-in required before check-out")

        attendance.check_out = timezone.now()

        # Calculate working hours
        duration = attendance.check_out - attendance.check_in
        attendance.working_hours = duration.total_seconds() / 3600

        attendance.save()

        return attendance

    @staticmethod
    def get_monthly_report(user, month, year):

        try:
            employee = user.employee_profile
        except Employee.DoesNotExist:
            raise ValidationError("Employee not found")

        records = Attendance.objects.filter(
            employee=employee,
            date__month=month,
            date__year=year
        )

        total_days = records.count()

        total_hours = records.aggregate(
            total=Sum('working_hours')
        )['total'] or 0

        avg_hours = total_hours / total_days if total_days > 0 else 0

        return {
            "employee_id": employee.employee_id,
            "month": month,
            "year": year,
            "total_days": total_days,
            "total_working_hours": round(total_hours, 2),
            "average_hours_per_day": round(avg_hours, 2)
        }
