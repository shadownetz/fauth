from django.urls import path, include
from . import views
from . import apis
from dashboard.apis import candidateApi
from dashboard.apis import userAPI

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

    path('api/image/candidate/exist', candidateApi.candidate_image_exist, name="api_candidate_image_exist"),
    path('api/candidate/create', candidateApi.add_candidate, name="api_add_candidate"),
    path('api/candidate/single', candidateApi.fetch_candidate_info, name="api_fetch_candidate_info"),
    path('api/candidate/all', candidateApi.fetch_candidates, name="api_fetch_candidates"),
    path('api/candidate/update', candidateApi.update_candidate, name="api_update_candidate"),
    path('api/candidate/delete', candidateApi.delete_candidate, name="api_delete_candidate"),
    path('api/candidate/images', candidateApi.fetch_images, name="api_fetch_candidate_images"),
    path('api/candidate/images/delete', candidateApi.delete_image, name="api_delete_candidate_images"),
    path('api/candidate/images/upload', candidateApi.add_image, name="api_add_candidate_image"),

    path('api/user/get', userAPI.fetch_user_info, name="api_fetch_user_details"),
    path('api/user/update', userAPI.update_user_info, name="api_update_user_details"),
    path('api/admin/fetch', userAPI.fetch_admins, name="api_fetch_admin_details"),
    path('api/admin/update', userAPI.update_admin, name="api_update_admin_details"),
    path('api/admin/delete', userAPI.delete_admin, name="api_delete_admin_details"),
]
