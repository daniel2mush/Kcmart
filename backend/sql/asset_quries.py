from sqlalchemy import text

get_asset_with_id = text("""
SELECT id, url FROM asset WHERE id = ANY(:ids)
""")
