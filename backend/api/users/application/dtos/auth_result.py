from dataclasses import dataclass
from ...models import User


@dataclass
class AuthResult:
    user: User
    access_token: str
    refresh_token: str
