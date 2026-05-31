from api.tag.domain.tag import Tag
from api.tag.infrastructure.tag_repository import TagRepository


class TagService:
    def __init__(self):
        self.repo = TagRepository()

    def get_all_tags(self) -> list[Tag]:
        return self.repo.get_all_tags()
