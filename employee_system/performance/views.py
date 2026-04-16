from rest_framework import viewsets, permissions
from .models import Objective, Review
from .serializers import ObjectiveSerializer, ReviewSerializer
from employees.models import Employee

class ObjectiveViewSet(viewsets.ModelViewSet):
    serializer_class = ObjectiveSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'role') and user.role in ['HR', 'ADMIN']:
            return Objective.objects.all()
        try:
            return Objective.objects.filter(employee=user.employee_profile)
        except:
            return Objective.objects.none()

    def perform_create(self, serializer):
        from rest_framework.exceptions import ValidationError
        try:
            serializer.save(employee=self.request.user.employee_profile)
        except Exception as e:
            raise ValidationError("You must have an employee profile to create an OKR.")

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'role') and user.role in ['HR', 'ADMIN']:
            return Review.objects.all()
        try:
            return Review.objects.filter(employee=user.employee_profile)
        except:
            return Review.objects.none()
