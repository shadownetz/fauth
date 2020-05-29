from django.shortcuts import render
from django.views import View
from django.forms import modelformset_factory
from .forms import *
from .models import User


def index(request):
    return render(request, 'home/index.html', {})


class Login(View):

    def get(self, request):
        return render(request, 'home/login.html', {})

    def post(self, request):
        return


class Register(View):

    def get(self, request):
        register_form = RegisterForm()
        # image_form = modelformset_factory(UserImage, UserImageForm, extra=4, max_num=4, validate_max=True)
        context = {'form': register_form}
        return render(request, 'home/register.html', context)

    def post(self, request):
        return
