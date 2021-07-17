import base64
import face_recognition
from django.core.files.base import ContentFile
from django.core.files import File
from django.conf import settings


class FauthImage:

    def __init__(self, dataURI: str, *, name: str = 'temp'):
        self.image_uri = dataURI
        self.image_format, self.image_str = dataURI.split(';base64,')
        self.image_ext = self.image_format.split('/')[-1]
        self.image_dir = settings.FAUTH_IMAGE_DIR + f'/image.{self.image_ext}'
        self.default_name = f'{name}.{self.image_ext}'

    def get_file(self) -> File:
        image = ContentFile(base64.b64decode(self.image_str), name=self.default_name)
        return File(image)

    def get_path(self) -> str:
        try:
            file = open(self.image_dir, 'xb')
        except FileExistsError:
            file = open(self.image_dir, 'wb')
        file.write(base64.b64decode(self.image_str))
        file.close()
        return self.image_dir


def get_face_locations_from_base64(base64String: str) -> list:
    fauthImage = FauthImage(base64String)
    # image_path = fauthImage.get_path()  # image dir
    image_file = fauthImage.get_file()    # image file object
    image = face_recognition.load_image_file(image_file)
    face_locations = face_recognition.face_locations(image)
    return face_locations


def compare_faces(image1, image2) -> dict:
    first_image = face_recognition.load_image_file(image1)
    first_image_encodings = face_recognition.face_encodings(first_image)
    second_image = face_recognition.load_image_file(image2)
    second_image_encodings = face_recognition.face_encodings(second_image)
    # No face found in unknown image
    if second_image_encodings and first_image_encodings:
        return {
            'result': face_recognition.compare_faces([first_image_encodings[0]], second_image_encodings[0], 0.4),
            'message': ''
        }
    return {
        'result': [],
        'message': 'No face detected!'
    }
