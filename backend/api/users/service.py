#
from dataclasses import asdict
from sqlite3 import IntegrityError

from api.users.domains import UserDataClass

from .models import User


def create_user(user: UserDataClass):
    user.email.lower().strip()
    user_dic = asdict(user)
    user_dic.pop("id", None)

    try:
        user_instance = User.objects.create_user(**user_dic)

    except IntegrityError:
        raise ValueError("error: A user with this email already exists")

    return user_instance
