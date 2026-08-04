from sqlalchemy import text

get_all_categories_query = text("""
    SELECT c.id, c.name, c.slug FROM category c
""")


update_category_query = text("""
    UPDATE category
    SET name = COALESCE(:name, name), 
        slug = COALESCE(:slug, slug)
    WHERE id = :id
        RETURNING id,name,slug
        """)

delete_category_query = text("""
    DELETE FROM category WHERE id = :id
        RETURNING id
""")
