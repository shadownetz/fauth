from django.urls import path, re_path
from . import views
from home import views as dashboard_views

app_name = 'dashboard'

urlpatterns = [
    path('logout', dashboard_views.signout, name="logout"),
    re_path(r'.*', views.index, name='index'),
]