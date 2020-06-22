from .models import UserImage
from fauth.face import FauthImage, compare_faces


def compare_user_faces_from_db(base64String: str) -> dict:
    user_images = UserImage.objects.all()
    image_dirs = []
    # media_dir = settings.MEDIA_URL
    unknown_image_file = FauthImage(base64String).get_file()
    return_data = {'email': '', 'err_message': ''}
    for user in user_images:
        image_dirs.append({
            'image': user.image,
            'user': user
        })
    for obj in image_dirs:
        result = compare_faces(obj['image'], unknown_image_file)
        if True in result['result']:
            return_data['email'] = obj['user'].user.email
            break
        else:
            return_data['err_message'] = result['message']
    return return_data
