from api.tag.domain.tag import Tag


class TagResponseMapper:
    @staticmethod
    def to_dto(data: Tag) -> dict:
        return {"id": data.id, "name": data.name}

    @staticmethod
    def to_dto_list(data) -> list:
        return [TagResponseMapper.to_dto(d) for d in data]
