from __future__ import unicode_literals

from django.db import models
from django.core.mail import send_mail
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.translation import ugettext_lazy as _
from django.conf import settings

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    name = models.CharField(_('name'), max_length=30, blank=True)
    phone = models.CharField(_('phone'), max_length=20, blank=True)
    is_active = models.BooleanField(_('is active'), default=False)
    is_staff = models.BooleanField(default=True)
    is_superuser = models.BooleanField(_('is super'), default=False)
    last_login = models.DateTimeField(blank=True, null=True)
    date_created = models.DateTimeField(_('date created'), auto_now_add=True)
    # avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def get_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        name = '%s' % self.name
        return name.strip()

    def email_user(self, subject, message, from_email=None, **kwargs):
        """
        Sends an email to this User.
        """
        send_mail(subject, message, from_email, [self.email], **kwargs)


class Candidate(models.Model):
    name = models.CharField(max_length=30)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    reg_no = models.CharField(_('Reg. Number'),max_length=30,  unique=True)
    state = models.CharField(max_length=30, blank=True)
    lga = models.CharField(_('Local Gov. Area'),max_length=30,  blank=True)
    department = models.CharField(max_length=30, blank=True)
    faculty = models.CharField(max_length=30, blank=True)
    dob = models.DateField(blank=True)
    date_updated = models.DateTimeField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.name)


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<email>/<filename>
    return 'images/users/{0}/{1}'.format(instance.user.email, filename)


def candidate_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<email>/<filename>
    return 'images/candidates/{0}/{1}'.format(instance.candidate.email, filename)


class UserImage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='userImage')
    image = models.ImageField(upload_to=user_directory_path, null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)


class CandidateImage(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='candidateImage')
    image = models.ImageField(upload_to=candidate_directory_path, null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)


class Log(models.Model):
    image = models.CharField(max_length=100, blank=True, null=True)
    status = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
