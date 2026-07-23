from pwdlib import PasswordHash
from pwdlib.hashers.bcrypt import BcryptHasher

pwd_context = PasswordHash((BcryptHasher(),))


def get_hashed_password(pwd: str):
    return pwd_context.hash(pwd)
