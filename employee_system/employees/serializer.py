from rest_framework import serializers
from .models import Employee
from department.models import Department

class EmployeeSerializer(serializers.ModelSerializer):
    department = serializers.SlugRelatedField(
        queryset=Department.objects.all(),
        slug_field='name',
        allow_null=True
    )
    
    class Meta:
        model = Employee
        fields = '__all__'