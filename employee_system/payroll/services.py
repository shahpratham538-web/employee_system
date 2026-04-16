from django.db.models import Sum
from django.core.exceptions import ValidationError
from datetime import datetime

from employees.models import Employee
from attendence.models import Attendance


class PayrollService:

    @staticmethod
    def generate_salary(user, employee_id, month, year):

        # Only Admin/HR allowed OR employee can view own
        if user.role not in ['ADMIN', 'HR']:
            if not hasattr(user, 'employee_profile') or user.employee_profile.employee_id != employee_id:
                raise ValidationError("You are not allowed to view this payroll")

        try:
            employee = Employee.objects.get(employee_id=employee_id)
        except Employee.DoesNotExist:
            raise ValidationError("Employee not found")

        records = Attendance.objects.filter(
            employee=employee,
            date__month=month,
            date__year=year,
            check_out__isnull=False
        )

        days_present = records.count()

        total_hours = records.aggregate(
            total=Sum('working_hours')
        )['total'] or 0

        monthly_salary = employee.salary

        per_day_salary = monthly_salary / 30

        calculated_salary = per_day_salary * days_present

        return {
            "employee_id": employee.employee_id,
            "month": month,
            "year": year,
            "days_present": days_present,
            "total_working_hours": round(total_hours, 2),
            "base_salary": float(monthly_salary),
            "calculated_salary": round(calculated_salary, 2)
        }