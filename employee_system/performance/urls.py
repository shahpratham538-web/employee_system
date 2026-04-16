from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ObjectiveViewSet, ReviewViewSet

router = DefaultRouter()
router.register('objectives', ObjectiveViewSet, basename='objectives')
router.register('reviews', ReviewViewSet, basename='reviews')

urlpatterns = [
    path('', include(router.urls)),
]
