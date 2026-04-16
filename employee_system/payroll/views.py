from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.core.exceptions import ValidationError

from .services import PayrollService


class PayrollView(APIView):

    def get(self, request, employee_id):
        try:
            month = int(request.GET.get('month'))
            year = int(request.GET.get('year'))

            data = PayrollService.generate_salary(
                request.user,
                employee_id,
                month,
                year,
            )

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)