import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'employee_system.settings')
django.setup()

from accounts.models import User
from employees.models import Employee
from performance.models import Objective, Review

def seed():
    # Find an employee
    employee = Employee.objects.first()
    if not employee:
        print("No employee found! Did you seed employees?")
        return

    # Create objectives
    Objective.objects.get_or_create(
        employee=employee,
        title="Reduce Server Latency by 50%",
        defaults={
            "description": "Optimize standard API response times across the employee-system application.",
            "progress": 65,
            "quarter": "Q1",
            "year": 2026,
        }
    )

    Objective.objects.get_or_create(
        employee=employee,
        title="Implement WebSocket Routing",
        defaults={
            "description": "Establish ASGI protocols in Django settings for Live Notifications.",
            "progress": 15,
            "quarter": "Q1",
            "year": 2026,
        }
    )

    Objective.objects.get_or_create(
        employee=employee,
        title="Improve Test Coverage",
        defaults={
            "description": "Write comprehensive unit tests ensuring logic integrity.",
            "progress": 90,
            "quarter": "Q1",
            "year": 2026,
        }
    )
    
    print(f"✅ Success! OKRs seeded for user: {employee.user.username}")
    print(f"Employee Email: {employee.user.email}")
    print(f"Role: {employee.user.role}")

if __name__ == '__main__':
    seed()
