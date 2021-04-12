from home.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from dashboard.models import UserSetting


@receiver(post_save, sender=User)
def initialize_user_settings(sender, instance, created, **kwargs):
    if created:
        UserSetting.objects.create(user=instance).save()
