from ..domain.tag import Tag
from ..models import Tag as TagModel


class TagMapper:
    @staticmethod
    def to_domain(data: TagModel) -> Tag:
        return Tag(
            name=data.name,
            id=data.id,
        )

    @staticmethod
    def to_model(data: Tag) -> TagModel:
        return TagModel(name=data.name, id=data.id)
