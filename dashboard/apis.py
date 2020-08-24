from django.http import JsonResponse
from home.models import User, Candidate, CandidateImage
from home.utils import compare_candidate_faces_from_db
# from django.views.decorators.csrf import csrf_exempt
import datetime
from fauth.face import FauthImage
from django.db import IntegrityError


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


def candidate_image_exist(request):
    data = {'status': False}
    if request.method == 'POST':
        snapshot = request.POST['snapshot']
        data['status'] = compare_candidate_faces_from_db(snapshot)['status']
    return JsonResponse(data=data)


def add_candidate(request):
    data = {'status': False}
    if request.method == 'POST':
        try:
            # DOB is ISO format
            date_of_birth = datetime.datetime.strptime(request.POST['dob'], '%Y-%m-%dT%H:%M:%S.%fZ')
            image_name = request.POST['email'].split("@")[0]
            fauthImage = FauthImage(request.POST['snapshot_value'], name=image_name)
            image_file = fauthImage.get_file()
            candidate = Candidate.objects.create(
                name=request.POST['name'],
                email=request.POST['email'],
                phone=request.POST['phone'],
                reg_no=request.POST['reg_no'],
                state=request.POST['state'],
                lga=request.POST['lga'],
                department=request.POST['department'],
                faculty=request.POST['faculty'],
                dob=date_of_birth
            )
            candidate.candidateImage.create(
                image=image_file
            )
            data['status'] = True
        except IntegrityError:
            data['message'] = "Integrity Error. Duplicate Registration Number found"
    return JsonResponse(data=data)


def fetch_candidates(request):
    _candidates = Candidate.objects.all()
    candidates = []
    for candidate in _candidates:
        tmp_candidate = {}
        try:
            _image = CandidateImage.objects.get(candidate=candidate)
        except CandidateImage.DoesNotExist:
            pass
        else:
            tmp_candidate['image'] = _image.image.url
        finally:
            tmp_data = {
                    "name": candidate.name,
                    "email": candidate.email,
                    "phone": candidate.phone,
                    "regNo": candidate.reg_no,
                    "state": candidate.state,
                    "lga": candidate.lga,
                    "department": candidate.department,
                    "faculty": candidate.faculty,
                    "dob": candidate.dob,
                    "dateUpdated": candidate.date_updated,
                    "dateCreated": candidate.date_created,
                }
            tmp_candidate = {**tmp_candidate, **tmp_data}
            candidates.append(tmp_candidate)
    return JsonResponse(data={'candidates': candidates})
