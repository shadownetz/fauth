from django.http import JsonResponse
from .models import User


def email_exist(request):
    data = {'status': False}
    if request.method == 'POST':
        email = request.POST['email']
        data['status'] = User.objects.filter(email=email).exists()
    return JsonResponse(data=data)
