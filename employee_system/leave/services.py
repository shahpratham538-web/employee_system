from django.core.exceptions import ValidationError
from datetime import date
from employees.models import Employee 
from .models import Leave

class LeaveService:
    @staticmethod
    def apply_leave(user,start_date,end_date,reason):
        try:
            employee = user.employee_profile
        except Employee.DoesNotExist:
            raise ValidationError("Employee profile not found")
        
        if start_date > end_date:
            raise ValidationError("start date cannot be after end date")

        if start_date < date.today():
            raise ValidationError("Cannot apply leave for past dates")

        leave = Leave.objects.create(
            employee=employee,
            start_date=start_date,
            end_date=end_date,
            reason=reason
        ) 
        # Check overlapping leaves
        overlapping_leaves = Leave.objects.filter(
            employee=employee,
            start_date__lte=end_date,
            end_date__gte=start_date,
            status__in=['PENDING', 'APPROVED']
        ) 

        if overlapping_leaves.exists():
            raise ValidationError("Leave already exists for selected dates")

        return leave 

    @staticmethod
    def approve_leave(user,leave_id):
        if user.role not in ['ADMIN','HR']:
            raise ValidationError("you are not authorized to approve leave")

        try:
            leave = Leave.objects.get(id=leave_id)
        except Leave.DoesNotExist:
            raise ValidationError("leave not found")  

        if leave.status != 'PENDING':
            raise ValidationError("leave already processed")

        leave.status = 'APPROVED'
        # Calculate leave days
        leave_days = (leave.end_date - leave.start_date).days + 1

        if leave.employee.leave_balance < leave_days:
            raise ValidationError("Not enough leave balance")

        leave.employee.leave_balance -= leave_days
        leave.employee.save()
        leave.save()
        return leave

    @staticmethod
    def reject_leave(user,leave_id):
        if user.role not in ['ADMIN','HR']:
            raise ValidationError("you are not authorized to reject leave ")

        try:
            leave = Leave.objects.get(id=leave_id)
        except Leave.DoesNotExist:
            raise ValidationError("leave not found ")

        if leave.status != 'PENDING':
            raise ValidationError("leave already processed ")

        leave.status = 'REJECTED'
        leave.save()
        return leave 


