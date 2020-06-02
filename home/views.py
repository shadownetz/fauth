from django.shortcuts import render, redirect, reverse
from django.views import View
from .forms import *
from django.http import JsonResponse


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
        image_form = UserImageForm()
        # image_form = modelformset_factory(UserImage, UserImageForm, extra=4, max_num=4, validate_max=True)
        context = {
            'form': register_form,
            'image_form': image_form}
        return render(request, 'home/register.html', context)

    def post(self, request):
        register_form = RegisterForm(request.POST)
        images_form = UserImageForm(request.FILES)
        if register_form.is_valid() and images_form.is_valid():
            register_form.save()
            images_form.save()
            request.session['register_success'] = True
        return redirect(reverse('home:index'))
