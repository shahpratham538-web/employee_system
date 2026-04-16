from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Team
from .serializers import TeamSerializer
from accounts.models import User
from django.core.exceptions import ValidationError
from django.db.models import Q

class TeamListCreateView(generics.ListCreateAPIView):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'HR', 'MANAGER']:
            return Team.objects.all().order_by('-created_at')
        # Employees only see teams they are in or lead
        return Team.objects.filter(Q(members=user) | Q(leader=user)).distinct().order_by('-created_at')

    def create(self, request, *args, **kwargs):
        if request.user.role not in ['ADMIN', 'HR', 'MANAGER']:
            return Response(
                {"error": "You do not have permission to create teams."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

class TeamDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'HR', 'MANAGER']:
            return Team.objects.all()
        return Team.objects.filter(Q(members=user) | Q(leader=user)).distinct()

    def update(self, request, *args, **kwargs):
        team = self.get_object()
        if request.user.role not in ['ADMIN', 'HR', 'MANAGER'] and request.user != team.leader:
            return Response(
                {"error": "You do not have permission to update this team."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        team = self.get_object()
        if request.user.role not in ['ADMIN', 'HR', 'MANAGER']:
            return Response(
                {"error": "You do not have permission to delete this team."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

class ManageTeamMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, team_id, action):
        try:
            team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            return Response({"error": "Team not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role not in ['ADMIN', 'HR', 'MANAGER'] and request.user != team.leader:
            return Response({"error": "Not authorized to manage this team's members."}, status=status.HTTP_403_FORBIDDEN)

        user_ids = request.data.get('user_ids', [])
        if not isinstance(user_ids, list):
            return Response({"error": "user_ids must be a list."}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(id__in=user_ids)
        
        if action == 'add':
            team.members.add(*users)
            msg = "Members added successfully."
        elif action == 'remove':
            team.members.remove(*users)
            msg = "Members removed successfully."
        else:
            return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)
            
        return Response({"message": msg, "team": TeamSerializer(team, context={'request': request}).data})
