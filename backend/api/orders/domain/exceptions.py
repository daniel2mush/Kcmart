class OrderDomainError(Exception):
    pass


class OrderValidationError(OrderDomainError):
    pass
