from django.http import JsonResponse
from .models import User, Candidate
from fauth.face import get_face_locations_from_base64
from .utils import compare_candidate_faces_from_db
from django.views.decorators.csrf import csrf_exempt


def email_exist(request):
    data = {'status': False, 'message': 'Bad Request'}
    if request.method == 'POST':
        email = request.POST['email']
        email_status = User.objects.filter(email=email).exists()
        data['status'] = email_status
        if email_status is True:
            data['message'] = "Email address already exist"
    return JsonResponse(data=data)


def validate_passport(request):
    data = {'status': False, 'message': "Bad Request"}
    if request.method == 'POST':
        b64_image = request.POST['image']
        faces = get_face_locations_from_base64(b64_image)
        if len(faces) == 1:
            data['status'] = True
        else:
            data['message'] = "Zero or Multiple face detected in passport!"
    return JsonResponse(data=data)


@csrf_exempt
def fetch_candidate_info(request):
    data = {
        'candidate': {},
        'status': False
    }
    if request.method == 'POST':
        snapshot = request.POST['snapshot']
        response = compare_candidate_faces_from_db(snapshot)
        data['status'] = response['status']
        if response['status']:
            candidate = response['data']['candidate']
            candidate_image = response['data']['image']
            # candidate = Candidate.objects.get(email=candidate_email)
            data['candidate'] = {
                "name": candidate.name,
                "email": candidate.email,
                "phone": candidate.phone,
                "regNo": candidate.reg_no,
                "state": candidate.state,
                "lga": candidate.lga,
                "department": candidate.department,
                "faculty": candidate.faculty,
                "dob": candidate.dob,
                'image': candidate_image,
                # 'snapshot': snapshot,
                "dateUpdated": candidate.date_updated,
                "dateCreated": candidate.date_created
            }
    return JsonResponse(data=data)
