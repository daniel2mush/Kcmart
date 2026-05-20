from dataclasses import dataclass


@dataclass
class TokenRefreshResult:
    access_token: str
    refresh_token: str | None = None
