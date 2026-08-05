from sqlalchemy import text

get_images_with_id = text("""
SELECT id, url, position FROM image WHERE id = ANY(:ids)
""")
