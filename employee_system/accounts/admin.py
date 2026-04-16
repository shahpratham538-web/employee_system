from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'is_verified')}),      # Add the new fields to the admin form
    )

    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')


admin.site.register(User, CustomUserAdmin)