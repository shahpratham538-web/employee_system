from django.urls import path
from .views import (
    ApplyLeaveView,
    LeaveListView,
    ApproveLeaveView,
    RejectLeaveView
)

urlpatterns = [
    path('apply/', ApplyLeaveView.as_view(), name='apply-leave'),
    path('', LeaveListView.as_view(), name='leave-list'),
    path('<int:leave_id>/approve/', ApproveLeaveView.as_view(), name='approve-leave'),
    path('<int:leave_id>/reject/', RejectLeaveView.as_view(), name='reject-leave'),
]