from django.urls import path, include
from . import views
from . import apis
from dashboard import apis as dashboard_apis

app_name = 'home'

urlpatterns = [
    path('', views.index, name="index"),
    path('login', views.sign_in, name="login"),
    path('register', views.Register.as_view(), name="register"),
    path('register/confirmation', views.post_registration, name='post_register'),
    path('dashboard/', include('dashboard.urls')),

    path('api/email/exist', apis.email_exist, name="api_email_exist"),
    path('api/image/singleface', apis.validate_passport, name="api_image_single_face"),
    path('api/image/user/exist', apis.user_image_exist, name="api_user_image_exist"),

    path('api/image/candidate/exist', dashboard_apis.candidate_image_exist, name="api_candidate_image_exist"),
    path('api/candidate/create', dashboard_apis.add_candidate, name="api_add_candidate"),
    path('api/candidate/single', dashboard_apis.fetch_candidate_info, name="api_fetch_candidate_info"),
    path('api/candidate/all', dashboard_apis.fetch_candidates, name="api_fetch_candidates"),
    path('api/candidate/update', dashboard_apis.update_candidate, name="api_update_candidate"),
]
