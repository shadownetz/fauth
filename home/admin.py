from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Candidate, UserImage, CandidateImage


class Admin(UserAdmin):
    model = User
    list_display = (
        'id', 'email', 'name', 'phone', 'password', 'is_superuser', 'is_active', 'is_staff', 'date_created', 'last_login'
    )
    list_filter = ('email', 'is_active', 'is_staff', 'date_created', 'last_login')
    fieldsets = (
        (None, {'fields': ('email', 'name', 'phone', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_superuser', 'is_staff')}),
    )
    add_fieldsets = (
        (None, {'classes': ('wide',),
                'fields': ('email', 'name', 'phone')
                }),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')})
    )
    search_fields = ('email', 'name')
    ordering = ('date_created',)


class CandidateAdmin(admin.ModelAdmin):
    model = Candidate
    list_display = (
        'id', 'name', 'email', 'phone', 'reg_no', 'state', 'lga', 'department',
        'faculty', 'dob', 'date_updated', 'date_created'
    )
    fieldsets = (
        (None, {
            'fields': (
                'name', 'email', 'phone', 'reg_no', 'state', 'lga', 'department',
                'faculty', 'dob'
            )
        }),
    )
    ordering = ('date_created',)


class UserImageAdmin(admin.ModelAdmin):
    model = UserImage
    list_display = ('id', 'user', 'image', 'date_created')
    fieldsets = (
        (None, {
            'fields': ('user', 'image')
        }),
    )
    ordering = ('date_created',)


class CandidateImageAdmin(admin.ModelAdmin):
    model = CandidateImage
    list_display = ('id', 'candidate', 'image', 'date_created')
    fieldsets = (
        (None, {
            'fields': ('candidate', 'image')
        }),
    )
    ordering = ('date_created',)


admin.site.register(User, Admin)
admin.site.register(Candidate, CandidateAdmin)
admin.site.register(UserImage, UserImageAdmin)
admin.site.register(CandidateImage, CandidateImageAdmin)