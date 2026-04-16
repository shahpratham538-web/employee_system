from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from .serializer import EmployeeSerializer
from .services import EmployeeService
from .models import Employee
from .permissions import IsAdminOrHR


class EmployeeCreateView(APIView):
    permission_classes = [IsAdminOrHR]

    def post(self, request):
        try:
            data = request.data

            employee = EmployeeService.create_employee(
                user_id=data.get("user"),
                employee_id=data.get("employee_id"),
                department_id=data.get("department"),
                designation=data.get("designation"),
                salary=data.get("salary"),
                joining_date=data.get("joining_date")
            )

            serializer = EmployeeSerializer(employee)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class EmployeeListView(ListAPIView):
    queryset = Employee.objects.filter(is_active=True)\
        .select_related('user', 'department')
    serializer_class = EmployeeSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['department', 'designation']
    search_fields = ['employee_id', 'user_username']
    ordering_fields = ['joining_date', 'salary']

       

class EmployeeDetailView(APIView):
    permission_classes = [IsAdminOrHR]

    def get(self, request, employee_id):
        try:
            employee = EmployeeService.get_employee_by_id(employee_id)
            user = request.user

            # If not Admin/HR → restrict access
            if user.role not in ['ADMIN', 'HR']:
                if employee.user != user:
                    return Response(
                        {"error": "You can only view your own profile"},
                        status=status.HTTP_403_FORBIDDEN
                    )
            serializer = EmployeeSerializer(employee)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND) 

    def put(self, request, employee_id):
        try:
            employee = EmployeeService.update_employee(
                employee_id,
                **request.data
            )
            serializer = EmployeeSerializer(employee)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, employee_id):
        try:
            EmployeeService.deactivate_employee(employee_id)
            return Response(
                {"message": "Employee deactivated successfully"},
                status=status.HTTP_200_OK
            )

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)      