from . import views
from django.urls import path

urlpatterns = [
    path("",views.backendView,name="api"),
    path("data/",views.postView,name="data")
]