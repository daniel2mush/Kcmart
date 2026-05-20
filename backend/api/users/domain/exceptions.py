class DomainError(Exception):
    pass


class ValidationError(DomainError):
    pass


class EmailValidationError(ValidationError):
    pass


class PasswordValidationError(ValidationError):
    pass


class PasswordResetValidationError(ValidationError):
    pass


class EmailResetValidationError(ValidationError):
    pass


class UserNotFoundError(DomainError):
    pass
