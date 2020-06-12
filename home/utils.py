import base64
import face_recognition


def get_file(dataURI, filename="temp"):
    from django.core.files.base import ContentFile
    from django.core.files import File

    image_format, imgstr = dataURI.split(';base64,')
    ext = image_format.split('/')[-1]
    image = ContentFile(base64.b64decode(imgstr), name=filename+'.'+ext)
    return File(image)


def get_face_encodings_from_base64(base64String: str) -> list:
    image = face_recognition.load_image_file(get_file(base64String))
    image_encoding = face_recognition.face_encodings(image)
    return image_encoding


