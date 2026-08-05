from sqlalchemy import text

get_all_tag_query = text("""
    SELECT id, name FROM tag 
""")


get_tag_by_ids = text("""
    SELECT id, name 
    FROM tag 
    WHERE id = ANY(:ids)
""")


update_tag_query = text("""
    UPDATE tag
    SET name = COALESCE(:name, name)
    WHERE id = :id
        RETURNING id, name
        """)

delete_tag_query = text("""
    DELETE FROM tag WHERE id = :id
        RETURNING id
""")
