from django.db import transaction
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from .models import Employee
from department.models import Department

User = get_user_model()


class EmployeeService:

    @staticmethod
    @transaction.atomic
    def create_employee(user_id, employee_id, department_id, designation, salary, joining_date):
        
        # Check if user exists
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise ValidationError("User does not exist")

        # Check if department exists
        try:
            department = Department.objects.get(id=department_id)
        except Department.DoesNotExist:
            raise ValidationError("Department does not exist")

        # Prevent duplicate employee_id
        if Employee.objects.filter(employee_id=employee_id).exists():
            raise ValidationError("Employee ID already exists")

        # Create employee
        employee = Employee.objects.create(
            user=user,
            employee_id=employee_id,
            department=department,
            designation=designation,
            salary=salary,
            joining_date=joining_date
        )

        return employee


    @staticmethod
    def get_employee_by_id(employee_id):
        try:
            return Employee.objects.get(employee_id=employee_id, is_active=True)
        except Employee.DoesNotExist:
            raise ValidationError("Employee not found")


    @staticmethod
    def deactivate_employee(employee_id):
        try:
            employee = Employee.objects.get(employee_id=employee_id)
        except Employee.DoesNotExist:
            raise ValidationError("Employee not found")

        employee.is_active = False
        employee.save()

        return employee

    @staticmethod
    def update_employee(employee_id, **kwargs):
        try:
            employee = Employee.objects.get(employee_id=employee_id,is_active=True)
        except Employee.DoesNotExist:
            raise ValidationError("Employee not found")

        if 'department'in kwargs:
            try:
                department = Department.objects.get(id=kwargs['department'])
                employee.department = department 
            except Department.DoesNotExist:
                raise ValidationError("Department not found")

        if 'designation' in kwargs:
            employee.designation = kwargs['designation']

        if 'salary' in kwargs:
            employee.salary = kwargs['salary']

        if 'joining_date' in kwargs:
            employee.joining_date = kwargs['joining_date']

        employee.save()
        return employee            
    
    @staticmethod   
    def deactivate_employee(employee_id):
        try:
            employee = Employee.objects.get(employee_id=employee_id, is_active=True)
        except Employee.DoesNotExist:
            raise ValidationError("Employee not found or already inactive")

        employee.is_active = False
        employee.save()

        return employee