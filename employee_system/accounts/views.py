from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer, RegisterSerializer, UserProfileSerializer
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from employees.models import Employee
from attendence.models import Attendance
from leave.models import Leave
from attendence.serializers import AttendanceSerializer
from leave.serializers import LeaveSerializer
from datetime import date

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class UserProfileView(APIView):
    """Get or update the authenticated user's profile."""
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        serializer = UserProfileSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfilePictureUploadView(APIView):
    """Dedicated endpoint for uploading profile pictures."""
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        if 'profile_picture' not in request.FILES:
            return Response(
                {"error": "No image file provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        # Delete old picture if exists
        if user.profile_picture:
            user.profile_picture.delete(save=False)

        user.profile_picture = request.FILES['profile_picture']
        user.save()

        serializer = UserProfileSerializer(user, context={'request': request})
        return Response(serializer.data)

    def delete(self, request):
        user = request.user
        if user.profile_picture:
            user.profile_picture.delete(save=True)
        return Response({"message": "Profile picture removed."})

class UserListView(generics.ListAPIView):
    """Endpoint for managers/admins to list users for team assignment."""
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        # Could filter by active users if preferred
        return User.objects.all().order_by('username')


class DashboardSummaryView(APIView):
    """Provides an optimized summary of dashboard statistics."""
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        today = date.today()
        
        total_employees = Employee.objects.count()
        today_attendance_qs = Attendance.objects.filter(date=today)
        today_attendance_count = today_attendance_qs.count()
        pending_leaves_count = Leave.objects.filter(status='PENDING').count()
        
        recent_attendance = Attendance.objects.order_by('-created_at')[:5]
        recent_leaves = Leave.objects.order_by('-applied_at')[:5]
        
        att_data = AttendanceSerializer(recent_attendance, many=True).data
        leave_data = LeaveSerializer(recent_leaves, many=True).data
        
        return Response({
            "stats": {
                "totalEmployees": total_employees,
                "todayAttendance": today_attendance_count,
                "pendingLeaves": pending_leaves_count
            },
            "recentAttendance": att_data,
            "recentLeaves": leave_data
        })