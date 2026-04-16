from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from employees.models import Employee

User = get_user_model()


@receiver(post_save, sender=User)
def create_employee_profile(sender, instance, created, **kwargs):
    
    if created:
        # Only create for EMPLOYEE role
        if instance.role == 'EMPLOYEE':
            Employee.objects.create(
                user=instance,
                employee_id=f"EMP{instance.id}",
                designation="New Employee",
                salary=0,
                joining_date=instance.date_joined.date()
            )