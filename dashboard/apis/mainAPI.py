from django.http import JsonResponse
from home.models import Log


def fetch_logs(request):
    response = {
        'status': False,
        'data': []
    }
    if request.method == 'GET':
        all_logs = Log.objects.all()
        for log in all_logs:
            response['data'].append({
                'id': log.id,
                'status': log.status,
                'image': log.image.url,
                'timestamp': log.timestamp
            })
    return JsonResponse(data=response)
