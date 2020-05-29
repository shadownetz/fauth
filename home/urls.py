from django.urls import path
from . import views

app_name = 'home'

urlpatterns = [
    path('', views.index, name="index"),
    path('login', views.Login.as_view(), name="login"),
    path('register', views.Register.as_view(), name="register")
]
