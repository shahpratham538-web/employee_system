from django.urls import path 
from .views import EmployeeCreateView, EmployeeListView,EmployeeDetailView
 
urlpatterns = [
     path('create/', EmployeeCreateView.as_view(), name='create-employee'),
     path('', EmployeeListView.as_view(), name='list-employees'),
     path('<str:employee_id>/',EmployeeDetailView.as_view(),name='employee-detail'),
]
