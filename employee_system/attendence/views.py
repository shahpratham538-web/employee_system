from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError

from .services import AttendanceService
from .serializers import AttendanceSerializer
from .models import Attendance


class CheckInView(APIView):

    def post(self, request):
        try:
            attendance = AttendanceService.check_in(request.user)
            serializer = AttendanceSerializer(attendance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CheckOutView(APIView):

    def post(self, request):
        try:
            attendance = AttendanceService.check_out(request.user)
            serializer = AttendanceSerializer(attendance)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AttendanceListView(APIView):

    def get(self, request):
        user = request.user

        # Admin/HR → see all
        if user.role in ['ADMIN', 'HR']:
            records = Attendance.objects.all()

        # Employee → see only their records
        else:
            records = Attendance.objects.select_related('employee__user').filter(employee__user=user)

        serializer = AttendanceSerializer(records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AttendanceReportView(APIView):

    def get(self, request):
        month = request.query_params.get('month')
        year = request.query_params.get('year')

        if not month or not year:
            return Response(
                {"error": "Please provide both 'month' and 'year' query parameters."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            month = int(month)
            year = int(year)
            data = AttendanceService.get_monthly_report(request.user, month, year)
            return Response(data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Invalid month or year format"}, status=status.HTTP_400_BAD_REQUEST)
