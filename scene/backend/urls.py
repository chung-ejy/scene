from . import views
from django.urls import path

urlpatterns = [
    path("",views.backendView,name="api"),
    path("search/",views.searchView,name="search"),
    path("data/",views.postView,name="data"),
    path("genres/",views.getGenre,name="genres"),
    # path("youtube/",views.getYoutubeId,name="youtube")
]