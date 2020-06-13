from django.http import JsonResponse
from .models import User
from fauth.face import get_face_locations_from_base64


def email_exist(request):
    data = {'status': False, 'message': 'Bad Request'}
    if request.method == 'POST':
        email = request.POST['email']
        email_status = User.objects.filter(email=email).exists()
        data['status'] = email_status
        if email_status is True:
            data['message'] = "Email address already exist"
    return JsonResponse(data=data)


def validate_passport(request):
    data = {'status': False, 'message': "Bad Request"}
    if request.method == 'POST':
        b64_image = request.POST['image']
        faces = get_face_locations_from_base64(b64_image)
        if len(faces) == 1:
            data['status'] = True
        else:
            data['message'] = "Zero or Multiple face detected in passport!"
    return JsonResponse(data=data)
