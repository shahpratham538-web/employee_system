from django.db import models
from accounts.models import User

class Team(models.Model):
    name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True, default='')
    
    # The leader can be an Admin, HR, Manager or even an Employee
    leader = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='led_teams'
    )
    
    # Members of the team
    members = models.ManyToManyField(
        User, 
        related_name='teams', 
        blank=True
    )
    
    # Tasks or current goals assigned to the team
    tasks = models.TextField(blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
