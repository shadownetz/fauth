from .models import UserImage, CandidateImage, Candidate, Log
from fauth.face import FauthImage, compare_faces
import base64


def compare_user_faces_from_db(base64String: str) -> dict:
    user_images = UserImage.objects.all()
    image_dirs = []
    # media_dir = settings.MEDIA_URL
    unknown_image_file = FauthImage(base64String).get_file()
    return_data = {'email': '', 'err_message': ''}
    image_found = False
    for user in user_images:
        image_dirs.append({
            'image': user.image,
            'user': user
        })
    for obj in image_dirs:
        result = compare_faces(obj['image'], unknown_image_file)
        if True in result['result']:
            image_found = True
            return_data['email'] = obj['user'].user.email
            break
    if not image_found:
        return_data['err_message'] = 'Not Recognized'
    return return_data


def compare_candidate_faces_from_db(base64String: str) -> dict:
    candidate_images = CandidateImage.objects.all()
    image_dirs = []
    # media_dir = settings.MEDIA_URL
    unknown_image_file = FauthImage(base64String).get_file()
    return_data = {
        'data': {
            'candidate': {},
            'image': '',
        },
        'status': False
    }
    for image_ref in candidate_images:
        image_dirs.append({
            'image': image_ref.image,
            'candidate': image_ref.candidate
        })
    for obj in image_dirs:
        result = compare_faces(obj['image'], unknown_image_file)
        if True in result['result']:
            return_data['status'] = True
            return_data['data']['candidate'] = obj['candidate']
            b64Image = ''
            try:
                with open(obj['image'].path, 'rb') as file:
                    b64Image = f"data:image/png;base64,{base64.b64encode(file.read()).decode()}"
            except FileNotFoundError:
                pass
            finally:
                return_data['data']['image'] = b64Image
                break
    new_log = Log(
        image=unknown_image_file,
        status=return_data['status']
    )
    new_log.save()
    return return_data


def fetch_candidate_images(candidate_id) -> list:
    """
    Fetch list of candidate images from the database
    :param candidate_id:
    :return: []
    """
    images = []
    try:
        candidate = Candidate.objects.get(pk=candidate_id)
    except Candidate.DoesNotExist:
        pass
    else:
        candidate_images = CandidateImage.objects.filter(candidate=candidate)
        if candidate_images:
            for candidateImage in candidate_images:
                images.append({
                    'path': candidateImage.image.url,
                    'id': candidateImage.id
                })
    return images
