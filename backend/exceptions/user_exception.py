from exceptions.base import AppException


class UserAlreadyExistException(AppException):
    def __init__(self, name: str):
        super().__init__(
            message=f"User already exists with this email{name}",
            status_code=400,
            error_code="USER_ALREADY_EXIST",
        )
