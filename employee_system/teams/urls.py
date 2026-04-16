from django.urls import path
from .views import TeamListCreateView, TeamDetailView, ManageTeamMembersView

urlpatterns = [
    path('', TeamListCreateView.as_view(), name='team-list-create'),
    path('<int:pk>/', TeamDetailView.as_view(), name='team-detail'),
    path('<int:team_id>/members/<str:action>/', ManageTeamMembersView.as_view(), name='manage-team-members'),
]
