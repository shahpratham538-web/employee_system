from django.db import models
from employees.models import Employee

class Objective(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='objectives')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    progress = models.IntegerField(default=0) # 0 to 100
    quarter = models.CharField(max_length=2, choices=[('Q1','Q1'),('Q2','Q2'),('Q3','Q3'),('Q4','Q4')])
    year = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.employee.user.username} ({self.progress}%)"

class Review(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='received_reviews')
    reviewer = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='given_reviews')
    score = models.IntegerField(choices=[(i, i) for i in range(1, 6)]) # 1 to 5
    comments = models.TextField()
    date_given = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.employee.user.username} - Score: {self.score}"
