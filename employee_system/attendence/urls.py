from django.urls import path 
from .views import CheckInView,CheckOutView,AttendanceListView
from .views import AttendanceReportView

urlpatterns = [
    path('check-in/', CheckInView.as_view(), name='check-in'),
    path('check-out/', CheckOutView.as_view(), name='check-out'),
    path('', AttendanceListView.as_view(), name='attendance-list'),
    path('report/', AttendanceReportView.as_view(), name='attendance-report'),
]