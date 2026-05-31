from ...tag.mappers.tag_mappers import TagMapper
from api.tag.domain.tag import Tag
from api.tag.models import Tag as Tagmodel


class TagRepository:

    def get_all_tags(self) -> list[Tag]:
        return [TagMapper.to_domain(data) for data in Tagmodel.objects.all()]
