from django.db import models
from django.conf import settings


class UserSetting(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    emailAuth = models.BooleanField(default=False)
