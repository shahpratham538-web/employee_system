from django.urls import path
from .views import PayrollView

urlpatterns = [
    path('<int:employee_id>/', PayrollView.as_view(), name='payroll_detail'),
]