from django.http import JsonResponse
from home.models import User, Candidate, CandidateImage
from home.utils import compare_candidate_faces_from_db, compare_user_faces_from_db
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
            _candidate = Candidate.objects.create(
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
            CandidateImage.objects.create(
                candidate=_candidate,
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
                "id": candidate.id,
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


def update_candidate(request):
    response = {
        'status': False,
        'message': 'Unable to Update Data'
    }
    if request.method == 'POST':
        _id = request.POST['id']
        try:
            s_candidate = Candidate.objects.get(pk=_id)
            image_ref = None
            _image = request.POST['image']
            _dob = request.POST['dob']
            _email = request.POST['email']
            _dob = datetime.datetime.strptime(_dob, '%Y-%m-%dT%H:%M:%S.%fZ')
            s_candidate.name = request.POST['name']
            s_candidate.email = _email
            s_candidate.phone = request.POST['phone']
            s_candidate.reg_no = request.POST['regNo']
            s_candidate.state = request.POST['state']
            s_candidate.lga = request.POST['lga']
            s_candidate.department = request.POST['department']
            s_candidate.faculty = request.POST['faculty']
            s_candidate.dob = _dob
            s_candidate.date_updated = datetime.datetime.now()
            if _image:
                face_exist = compare_user_faces_from_db(_image)
                if not face_exist['err_message']:
                    image_name = _email.split("@")[0] or str(datetime.datetime.now())
                    fauthImage = FauthImage(_image, name=image_name)
                    _image = fauthImage.get_file()
                    image_ref = CandidateImage.objects.get(candidate=s_candidate)
                    image_ref.image = _image
                else:
                    raise ValueError
        except Candidate.DoesNotExist:
            response['message'] = 'Candidate does not exist'
        except IntegrityError:
            response['message'] = "Integrity Error. Duplicate Registration Number found"
        except ValueError:
            response['message'] = "Profile Image Error. No face found in uploaded image"
        else:
            if image_ref:
                image_ref.save()
            s_candidate.save()
            response['status'] = True
    return JsonResponse(data=response)


def delete_candidate(request):
    response = {
        'status': False,
        'message': ''
    }
    if request.method == 'POST':
        candidate_id = request.POST['id']
        if candidate_id:
            try:
                candidate = Candidate.objects.get(pk=candidate_id)
                candidate.delete()
                response['status'] = True
            except Candidate.DoesNotExist:
                response['message'] = 'Candidate does not exist'
    return JsonResponse(data=response)
