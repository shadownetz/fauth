from django import forms
from .models import *


class RegisterForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['name', 'email', 'phone']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'surname  firstname',
                'data-toggle': 'tooltip',
                'data-placement': 'left',
                'title': 'please enter your full name'

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


class UserImageForm(forms.ModelForm):
    class Meta:
        model = UserImage
        fields = ['image']
