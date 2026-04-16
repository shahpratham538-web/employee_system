"""
URL configuration for employee_system project.
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import CustomTokenObtainPairView, RegisterView, UserProfileView, ProfilePictureUploadView, UserListView, DashboardSummaryView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/employees/',include('employees.urls')),
    path('api/attendance/',include('attendence.urls')),
    path('api/teams/',include('teams.urls')),
    path('api/auth/register/', RegisterView.as_view(), name='auth_register'),
    path('api/users/', UserListView.as_view(), name='user-list'),
    path('api/auth/profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/auth/profile/picture/', ProfilePictureUploadView.as_view(), name='profile-picture'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/leave/',include('leave.urls')),
    path('api/payroll/',include('payroll.urls')),
    path('api/performance/',include('performance.urls')),
    path('api/dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard_summary'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
