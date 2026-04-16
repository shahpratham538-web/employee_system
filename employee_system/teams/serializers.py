from rest_framework import serializers
from .models import Team
from accounts.models import User

class TeamMemberSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'name', 'role', 'profile_picture_url')

    def get_name(self, obj):
        if obj.first_name or obj.last_name:
            return f"{obj.first_name} {obj.last_name}".strip()
        return obj.username

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None

class TeamSerializer(serializers.ModelSerializer):
    leader_details = TeamMemberSerializer(source='leader', read_only=True)
    members_details = TeamMemberSerializer(source='members', many=True, read_only=True)

    class Meta:
        model = Team
        fields = ('id', 'name', 'description', 'tasks', 'leader', 'leader_details', 'members', 'members_details', 'created_at')
        read_only_fields = ('id', 'created_at')

    def create(self, validated_data):
        members = validated_data.pop('members', [])
        team = Team.objects.create(**validated_data)
        team.members.set(members)
        return team
