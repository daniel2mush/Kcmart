from uuid import UUID

from api.users.infrastructure.user_repo import UserRepo
from ..models import User


class ProfileService:

    def __init__(self):
        self.repo = UserRepo()

    def get_profile(
        self,
        current_user: User,
        target_user_id: UUID | None = None,
    ):

        # own profile
        if target_user_id is None:
            return current_user, True

        # own profile by explicit id
        if str(current_user.pk) == str(target_user_id):
            return current_user, True

        # public profile
        target_user = self.repo.get_by_id(target_user_id)

        return target_user, False
