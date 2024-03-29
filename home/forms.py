from django import forms
from .models import *


class RegisterForm(forms.ModelForm):
    snapshot = forms.CharField(widget=forms.HiddenInput())

    class Meta:
        model = User
        fields = ['name', 'email', 'phone']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'surname  firstname',
                'data-toggle': 'tooltip',
                'data-placement': 'left',
                'title': 'please enter your full name',
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'sample@example.com',
                'data-toggle': 'tooltip',
                'data-placement': 'left',
                'title': 'please enter a valid email address'

            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'telephone number',
                'data-toggle': 'tooltip',
                'data-placement': 'left',
                'title': 'please enter a valid telephone number'

            })
        }


# class UserImageForm(forms.ModelForm):
#     # snapshot = forms.CharField(widget=forms.HiddenInput())
#
#     class Meta:
#         model = UserImage
#         fields = ['image']
#
#     @staticmethod
#     def get_file(dataURI):
#         from django.core.files.base import ContentFile
#         from django.core.files import File
#
#         image_format, imgstr = dataURI.split(';base64,')
#         ext = image_format.split('/')[-1]
#         image = ContentFile(base64.b64decode(imgstr), name='temp.'+ext)
#         return File(image)
#
#     def save(self, commit=True):
#         model = super(UserImageForm, self).save(commit=False)
#         image = self.cleaned_data['image']    # load image from FauthWebCam snapshot
#         if image:
#             model.image = self.get_file(image)
#         return super(UserImageForm, self).save(commit)
