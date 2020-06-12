from django.urls import path
from . import views
from . import apis

app_name = 'home'

urlpatterns = [
    path('', views.index, name="index"),
    path('login', views.Login.as_view(), name="login"),
    path('register', views.Register.as_view(), name="register"),
    path('api/email/exist', apis.email_exist, name="api_email_exist"),
    path('api/image/singleface', apis.validate_passport, name="api_image_single_face")
]
