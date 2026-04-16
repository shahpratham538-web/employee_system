from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('HR', 'HR'),
        ('MANAGER', 'Manager'),
        ('EMPLOYEE', 'Employee'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='EMPLOYEE')
    is_verified = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True, default='')
    bio = models.TextField(blank=True, default='')

    # So that createsuperuser will prompt for these fields
    REQUIRED_FIELDS = ['email', 'role']

    def save(self, *args, **kwargs):
        # Superusers default to ADMIN role if not set
        if self.is_superuser and not self.role:
            self.role = 'ADMIN'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
