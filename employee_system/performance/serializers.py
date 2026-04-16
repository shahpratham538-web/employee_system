from rest_framework import serializers
from .models import Objective, Review
from employees.models import Employee

class ObjectiveSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.username', read_only=True)

    class Meta:
        model = Objective
        fields = '__all__'
        read_only_fields = ['employee', 'progress']

class ReviewSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.username', read_only=True)
    reviewer_name = serializers.CharField(source='reviewer.user.username', read_only=True)

    class Meta:
        model = Review
        fields = '__all__'
