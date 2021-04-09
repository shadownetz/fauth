from django.http import JsonResponse
from home.models import User, UserImage


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
            if request.POST['password'] and len(request.POST['password']) >= 8:
                user.set_password(request.POST['password'])
            user.save()
            response['status'] = True
        except Exception:
            pass
    return JsonResponse(data=response)
