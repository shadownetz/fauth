from django.shortcuts import render, redirect, reverse
from django.views import View
from .forms import *
import base64
from .utils import get_file


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
        # image_form = UserImageForm()
        # image_form = modelformset_factory(UserImage, UserImageForm, extra=4, max_num=4, validate_max=True)
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
                UserImage.objects.create(user=user, image=get_file(image, image_name))
                request.session['register_success'] = True
                return redirect(reverse('home:index'))
        return render(request, 'home/register.html', {'form': register_form})
