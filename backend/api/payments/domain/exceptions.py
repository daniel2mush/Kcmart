class PaymentDomainError(Exception):
    pass


class PaymentValidationError(PaymentDomainError):
    pass
