from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError

from .services import LeaveService
from .serializers import LeaveSerializer
from .models import Leave


class ApplyLeaveView(APIView):

    def post(self, request):
        try:
            data = request.data

            leave = LeaveService.apply_leave(
                user=request.user,
                start_date=data.get('start_date'),
                end_date=data.get('end_date'),
                reason=data.get('reason')
            )

            serializer = LeaveSerializer(leave)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LeaveListView(APIView):

    def get(self, request):
        user = request.user

        # Admin/HR → all leaves
        if user.role in ['ADMIN', 'HR']:
            leaves = Leave.objects.all()

        # Employee → own leaves only
        else:
            leaves = Leave.objects.select_related('employee__user').filter(employee__user=user)

        serializer = LeaveSerializer(leaves, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ApproveLeaveView(APIView):

    def put(self, request, leave_id):
        try:
            leave = LeaveService.approve_leave(request.user, leave_id)
            serializer = LeaveSerializer(leave)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RejectLeaveView(APIView):

    def put(self, request, leave_id):
        try:
            leave = LeaveService.reject_leave(request.user, leave_id)
            serializer = LeaveSerializer(leave)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)