from django.contrib import admin
from home.models import Log
from .models import UserSetting


# Register your models here.
class LogAdmin(admin.ModelAdmin):
    model = Log
    list_display = ('image', 'status', 'timestamp',)
    fieldsets = (
        (None, {
            'fields': ('image', 'status',)
        }),
    )
    ordering = ('timestamp',)


class UserSettingsAdmin(admin.ModelAdmin):
    model = UserSetting
    list_display = ('user', 'emailAuth',)
    fieldsets = (
        (None, {
            'fields': ('user', 'emailAuth',)
        }),
    )
    ordering = ('emailAuth',)


admin.site.register(Log, LogAdmin)
admin.site.register(UserSetting, UserSettingsAdmin)
