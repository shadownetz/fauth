from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from home.models import User, Candidate, Log


@login_required
def index(request):
    users = len(User.objects.all())
    candidates = len(Candidate.objects.all())
    logs = len(Log.objects.all())
    statistics = {
        'users': users,
        'candidates': candidates,
        'logs': logs
    }
    return render(request, 'dashboard/index.html', {
        'statistics': statistics
    })
