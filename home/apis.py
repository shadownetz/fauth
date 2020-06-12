from django.http import JsonResponse
from .models import User
from .utils import get_face_encodings_from_base64


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
        faces_encodings = get_face_encodings_from_base64(b64_image)
        if len(faces_encodings) == 1:
            data['status'] = True
        else:
            data['message'] = "Invalid passport image detected! Ensure only a single face appears in photo"
    return JsonResponse(data=data)
