from rest_framework.permissions import BasePermission

class IsAdminOrHR(BasePermission):

    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            return False

        # Allow GET requests for all authenticated users
        if request.method == 'GET':
            return True

        # Restrict write operations
        return user.role in ['ADMIN', 'HR']