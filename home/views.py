from typing import final
from django.shortcuts import render, redirect, reverse
from django.contrib.auth import login, authenticate, logout
from django.views import View
from .forms import *
from dashboard.models import UserSetting
from fauth.face import FauthImage
from .utils import compare_user_faces_from_db


def index(request):
    return render(request, 'home/index.html', {})


def sign_in(request):
    errors = []
    if request.method == 'POST':
        face_auth = request.POST['face_auth_login']
        next_url = request.POST['next']
        if face_auth == 'true':
            image = request.POST['snapshot']
            user = compare_user_faces_from_db(image)
            # user is found
            if not user['err_message']:
                user = User.objects.get(email=user['email'])
                if user.is_active:
                    login(request, user)
                    if next_url:
                        return redirect(next_url)
                    return redirect(reverse('home:dashboard:index'))
                errors.append('Your request is still in processing!')
            # user is not found
            elif not user['err_message'] and not user['email']:
                errors.append('Access Denied!')
            # passport upload error
            else:
                errors.append(user['err_message'])
        else:
            email = request.POST['email']
            password = request.POST['password']
            user = User.objects.get(email=email)
            user_settings = UserSetting.objects.get(user=user)
            if user_settings.emailAuth:
                user = authenticate(request, email=email, password=password)
                if user is not None:
                    login(request, user)
                    if next_url:
                        return redirect(next_url)
                    return redirect(reverse('home:dashboard:index'))
                else:
                    errors.append('Invalid credentials!')
            else:
                errors.append('Email authentication is not enabled for this account')
    return render(request, 'home/login.html', {'errors': errors})


def post_registration(request):
    try:
        user_id = request.session['user_id']
        user = User.objects.get(pk=user_id)
        del request.session['user_id']
        return render(request, 'home/post_register.html', {'user': user})
    except KeyError:
        pass
    return redirect(reverse('home:login'))


def signout(request):
    logout(request)
    return redirect('home:login')

class Register(View):

    def get(self, request):
        register_form = RegisterForm()
        context = {
            'form': register_form,
        }
        return render(request, 'home/register.html', context)

    def post(self, request):
        register_form = RegisterForm(request.POST)
        if register_form.is_valid():
            image = register_form.cleaned_data['snapshot']
            if image:
                user = register_form.save()
                image_name = user.email.split("@")[0]
                fauthImage: final = FauthImage(image, name=image_name)
                image_file = fauthImage.get_file()
                UserImage.objects.create(user=user, image=image_file)
                request.session['user_id'] = user.id
                return redirect(reverse('home:post_register'))
        return render(request, 'home/register.html', {'form': register_form})
