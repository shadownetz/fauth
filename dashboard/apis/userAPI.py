from django.http import JsonResponse
from home.models import User, UserImage
from dashboard.models import UserSetting
from home.utils import compare_user_faces_from_db
import datetime
from fauth.face import FauthImage
import json


def fetch_user_info(request):
    response = {
        'status': False,
        'data': {}
    }
    if request.method == 'POST':
        try:
            user_id = int(request.POST['id'])
            user = User.objects.get(pk=user_id)
            user_image = UserImage.objects.get(user=user)
            response['data']['name'] = user.name
            response['data']['email'] = user.email
            response['data']['phone'] = user.phone
            response['data']['last_login'] = user.last_login
            response['data']['date_created'] = user.date_created
            response['data']['avatar'] = user_image.image.url
            response['status'] = True
        except Exception:
            pass
    return JsonResponse(data=response)


def update_user_info(request):
    response = {
        'status': False,
        'data': {}
    }
    if request.method == 'POST':
        try:
            user_id = request.POST['id']
            user = User.objects.get(pk=user_id)
            if request.POST['name']:
                user.name = request.POST['name']
            if request.POST['email']:
                user.email = request.POST['email']
            if request.POST['phone']:
                user.phone = request.POST['phone']
            if request.POST['password'] and len(request.POST['password']) == 4:
                user.set_password(request.POST['password'])
            user.save()
            response['status'] = True
        except Exception:
            pass
    return JsonResponse(data=response)


def fetch_admins(request):
    response = {
        "status": True,
        "data": []
    }
    if request.method == 'GET':
        users = User.objects.filter(is_staff=True)
        for user in users:
            user_data = {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "is_active": user.is_active,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                "last_login": user.last_login,
                "date_created": user.date_created,
            }
            try:
                user_image = UserImage.objects.get(user=user)
            except UserImage.DoesNotExist:
                print("user image does not exist")
            else:
                user_data["avatar"] = user_image.image.url
            response["data"].append(user_data)
    return JsonResponse(data=response)


def update_admin(request):
    response = {
        'status': False,
        'message': ''
    }
    if request.method == 'POST':
        try:
            image_ref = None
            admin = User.objects.get(pk=request.POST['id'])
            _image = request.POST['image']
            if _image:
                face_exist = compare_user_faces_from_db(_image)
                if not face_exist['err_message']:
                    image_name = request.POST['email'].split("@")[0] or str(datetime.datetime.now())
                    fauthImage = FauthImage(_image, name=image_name)
                    _image = fauthImage.get_file()
                    image_ref = UserImage.objects.get(user=admin)
                    image_ref.image = _image
                else:
                    raise ValueError
        except User.DoesNotExist:
            response['message'] = 'This Admin does not exist'
        except ValueError:
            response['message'] = "Profile Image Error. No face found in uploaded image"
        else:
            admin.name = request.POST['name']
            admin.email = request.POST['email']
            admin.phone = request.POST['phone']
            admin.is_active = json.loads(request.POST['is_active'])
            admin.is_staff = json.loads(request.POST['is_staff'])
            admin.is_superuser = json.loads(request.POST['is_superuser'])
            admin.save()
            if image_ref:
                image_ref.save()
            response['status'] = True
    return JsonResponse(data=response)


def delete_admin(request):
    response = {
        'status': False,
        'message': ''
    }
    if request.method == 'POST':
        admin_id = request.POST['id']
        try:
            user = User.objects.get(pk=admin_id)
            user.delete()
            response['status'] = True
        except User.DoesNotExist:
            response['message'] = 'Admin does not exist'
    return JsonResponse(data=response)


def fetch_user_settings(request):
    response = {
        "status": False,
        "data": {},
    }
    if request.method == 'POST':
        try:
            user = User.objects.get(pk=request.POST['userId'])
            user_settings = UserSetting.objects.get(user=user)
        except User.DoesNotExist:
            response['message'] = "Unknown User"
        except UserSetting.DoesNotExist:
            response['message'] = "Nothing to update, user settings does not exist"
        else:
            response['data']['emailAuth'] = user_settings.emailAuth
            response['status'] = True
    return JsonResponse(data=response)


def update_user_settings(request):
    response = {
        "status": False,
        "data": None,
        "message": ""
    }
    if request.method == 'POST':
        try:
            user = User.objects.get(pk=request.POST['userId'])
            user_settings = UserSetting.objects.get(user=user)
        except User.DoesNotExist:
            response['message'] = "Unknown User"
        except UserSetting.DoesNotExist:
            response['message'] = "Nothing to update, user settings does not exist"
        else:
            user_settings.emailAuth = json.loads(request.POST['emailAuth'])
            user_settings.save()
            response['status'] = True
    return JsonResponse(data=response)
