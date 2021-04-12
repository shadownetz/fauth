from django.contrib import admin
from home.models import Log


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


admin.site.register(Log, LogAdmin)
