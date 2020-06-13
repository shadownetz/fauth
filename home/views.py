from typing import final
from django.shortcuts import render, redirect, reverse
from django.views import View
from .forms import *
from fauth.face import FauthImage


def index(request):
    context = {}
    try:
        if request.session['register_success'] is True:
            context['register_success'] = True
            del request.session['register_success']
    except KeyError:
        pass
    return render(request, 'home/index.html', context)


class Login(View):

    def get(self, request):
        return render(request, 'home/login.html', {})

    def post(self, request):
        return


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
                request.session['register_success'] = True
                return redirect(reverse('home:index'))
        return render(request, 'home/register.html', {'form': register_form})
