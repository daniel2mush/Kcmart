# from sqlalchemy import text
#
#
#
#
#
#
# fetch_query = text("""
#                        SELECT
#                            p.id,
#                            p.name,
#                            p.slug,
#                            p.description,
#                            p.price_cent,
#                            p.included,
#                            p.status::text as status,
#                            p.is_featured,
#                            COALESCE(a.url, '') as asset_url,
#                            COALESCE(
#                                    (SELECT json_agg(i.url ORDER BY i.position)
#                                     FROM image i WHERE i.product_id = p.id),
#                                    '[]'::json
#                            ) as images,
#                            COALESCE(
#                                    (SELECT json_agg(t.name)
#                                     FROM tag_list tl JOIN tag t ON t.id = tl.tag_id
#                                     WHERE tl.product_id = p.id),
#                                    '[]'::json
#                            ) as tags,
#                            COALESCE(
#                                    (SELECT json_agg(c.name)
#                                     FROM category_list cl JOIN category c ON c.id = cl.category_id
#                                     WHERE cl.product_id = p.id),
#                                    '[]'::json
#                            ) as categories
#                        FROM product p
#                                 LEFT JOIN asset a ON a.product_id = p.id
#                        WHERE p.id = :product_id
#                        """)
#
#
# is_authorized_user = text("""
#     SELECT 1 FROM product p WHERE p.id = :product_id AND p.user_id = :user_id
# """)
#
# is_product_exist = text("""
#     SELECT
#         p.id, user_id, name, slug, description, price_cent, included, status, is_featured
#     FROM product p WHERE p.id = :product_id
# """)
#
#
#
#
# # get_all_product = text("""
# #
# #     SELECT
# #         p.id,
# #         p.name,
# #         p.slug,
# #         p.description,
# #         p.price_cent,
# #         p.included ,
# #         p.status,
# #         p.is_featured,
# #         p.user_id ,
# #         a.url as asset_url,
# #         COALESCE( json_agg(DISTINCT i.url ) FILTER ( WHERE i.id IS NOT NULL ), '[]'::json) as images,
# #         COALESCE(json_agg(DISTINCT t.name ) FILTER ( WHERE t.id IS NOT NULL), '[]'::json) as tags,
# #         COALESCE(json_agg(DISTINCT c.name) FILTER ( WHERE c.id IS NOT NULL ), '[]'::json) as categories
# #
# #     FROM product p
# #         LEFT JOIN asset a ON a.product_id =p.id
# #         LEFT JOIN category_list cl ON cl.product_id = p.id
# #         LEFT JOIN category c ON c.id = cl.category_id
# #         LEFT JOIN tag_list tl ON tl.product_id = p.id
# #         LEFT JOIN tag t ON t.id = tl.tag_id
# #         LEFT JOIN image i ON i.product_id = p.id
# #         GROUP BY p.id , a.url
# # """)
#
#
# CTE_get_all_product = text("""
#
#         WITH paginated_products AS (
#         -- 1. Grab ONLY the exact slice of products requested first
#         SELECT
#             id, user_id, name, slug, description,
#             price_cent, included, status, is_featured
#         FROM product WHERE status = 'PUBLISHED'
#         ORDER BY id  -- or created_at DESC
#         LIMIT :limit OFFSET :offset
#     ),
#     CTE_aggregated_images AS (
#         -- 2. Aggregate images ONLY for those paginated products
#         SELECT
#             i.product_id,
#             json_agg(i.url ORDER BY i.position) AS images
#         FROM image i
#         JOIN paginated_products p ON p.id = i.product_id
#         GROUP BY i.product_id
#     ),
#         CTE_aggregated_tags AS (
#         SELECT
#             tl.product_id,
#             array_agg(t.id) AS tag_ids
#         FROM tag_list tl
#         JOIN tag t ON t.id = tl.tag_id
#         JOIN paginated_products p ON p.id = tl.product_id
#         GROUP BY tl.product_id
#     ),
#     CTE_aggregated_categories AS (
#         -- 4. Aggregate categories ONLY for those paginated products
#         SELECT
#             cl.product_id,
#             json_agg(c.name) AS categories
#         FROM category_list cl
#         JOIN category c ON c.id = cl.category_id
#         JOIN paginated_products p ON p.id = cl.product_id
#         GROUP BY cl.product_id
#     )
#     SELECT
#         p.id, p.user_id, p.name, p.slug, p.description,
#         p.price_cent, p.included, p.status::text AS status, p.is_featured,
#         COALESCE(a.url, '') AS asset_url,
#         COALESCE(ai.images, '[]'::json) AS images,
#         COALESCE(at.tag_ids, ARRAY[]::uuid[]) AS tag_ids,
#         COALESCE(ac.categories, '[]'::json) AS categories
#     FROM paginated_products p
#     LEFT JOIN asset a ON a.product_id = p.id
#     LEFT JOIN CTE_aggregated_images ai ON ai.product_id = p.id
#     LEFT JOIN CTE_aggregated_tags at ON at.product_id = p.id
#     LEFT JOIN CTE_aggregated_categories ac ON ac.product_id = p.id;
# """)
#
#

#
# CTE_get_all_user_product = text("""
#
#         WITH paginated_products AS (
#         -- 1. Grab ONLY the exact slice of products requested first
#         SELECT
#             id, user_id, name, slug, description,
#             price_cent, included, status, is_featured,
#             created_at, updated_at
#         FROM product WHERE product.user_id = :id
#         ORDER BY id   -- or created_at DESC
#         LIMIT :limit OFFSET :offset
#     ),
#     CTE_aggregated_images AS (
#         -- 2. Aggregate images ONLY for those paginated products
#         SELECT
#             i.product_id,
#             json_agg(i.url ORDER BY i.position) AS images
#         FROM image i
#         JOIN paginated_products p ON p.id = i.product_id
#         GROUP BY i.product_id
#     ),
#     CTE_aggregated_tags AS (
#         -- 3. Aggregate tags ONLY for those paginated products
#         SELECT
#             tl.product_id,
#             json_agg(t.name) AS tags
#         FROM tag_list tl
#         JOIN tag t ON t.id = tl.tag_id
#         JOIN paginated_products p ON p.id = tl.product_id
#         GROUP BY tl.product_id
#     ),
#     CTE_aggregated_categories AS (
#         -- 4. Aggregate categories ONLY for those paginated products
#         SELECT
#             cl.product_id,
#             json_agg(c.name) AS categories
#         FROM category_list cl
#         JOIN category c ON c.id = cl.category_id
#         JOIN paginated_products p ON p.id = cl.product_id
#         GROUP BY cl.product_id
#     )
#     SELECT
#         p.id, p.user_id, p.name, p.slug, p.description,
#         p.price_cent, p.included, p.status::text AS status, p.is_featured,
#         COALESCE(a.url, '') AS asset_url,
#         COALESCE(ai.images, '[]'::json) AS images,
#         COALESCE(at.tags, '[]'::json) AS tags,
#         COALESCE(ac.categories, '[]'::json) AS categories
#     FROM paginated_products p
#     LEFT JOIN asset a ON a.product_id = p.id
#     LEFT JOIN CTE_aggregated_images ai ON ai.product_id = p.id
#     LEFT JOIN CTE_aggregated_tags at ON at.product_id = p.id
#     LEFT JOIN CTE_aggregated_categories ac ON ac.product_id = p.id
#         ORDER BY p.created_at DESC
#         ;
#
# """)
#
#
# CTE_get_all_product_with_slug = text("""
#
#         WITH paginated_products AS (
#         -- 1. Grab ONLY the exact slice of products requested first
#         SELECT
#             id, user_id, name, slug, description,
#             price_cent, included, status, is_featured
#         FROM product WHERE slug = :slug
#         ORDER BY id  -- or created_at DESC
#     ),
#     CTE_aggregated_images AS (
#         -- 2. Aggregate images ONLY for those paginated products
#         SELECT
#             i.product_id,
#             json_agg(i.url ORDER BY i.position) AS images
#         FROM image i
#         JOIN paginated_products p ON p.id = i.product_id
#         GROUP BY i.product_id
#     ),
#     CTE_aggregated_tags AS (
#         -- 3. Aggregate tags ONLY for those paginated products
#         SELECT
#             tl.product_id,
#             json_agg(t.name) AS tags
#         FROM tag_list tl
#         JOIN tag t ON t.id = tl.tag_id
#         JOIN paginated_products p ON p.id = tl.product_id
#         GROUP BY tl.product_id
#     ),
#     CTE_aggregated_categories AS (
#         -- 4. Aggregate categories ONLY for those paginated products
#         SELECT
#             cl.product_id,
#             json_agg(c.name) AS categories
#         FROM category_list cl
#         JOIN category c ON c.id = cl.category_id
#         JOIN paginated_products p ON p.id = cl.product_id
#         GROUP BY cl.product_id
#     )
#     SELECT
#         p.id, p.user_id, p.name, p.slug, p.description,
#         p.price_cent, p.included, p.status::text AS status, p.is_featured,
#         COALESCE(a.url, '') AS asset_url,
#         COALESCE(ai.images, '[]'::json) AS images,
#         COALESCE(at.tags, '[]'::json) AS tags,
#         COALESCE(ac.categories, '[]'::json) AS categories
#     FROM paginated_products p
#     LEFT JOIN asset a ON a.product_id = p.id
#     LEFT JOIN CTE_aggregated_images ai ON ai.product_id = p.id
#     LEFT JOIN CTE_aggregated_tags at ON at.product_id = p.id
#     LEFT JOIN CTE_aggregated_categories ac ON ac.product_id = p.id;
# """)
from sqlalchemy import text

base_product_query = """
SELECT 
    id,
    user_id,
    name,
    slug,
    description,
    price_cent,
    included,
    status,
    is_featured,
    updated_at,
    created_at,

    ARRAY(
        SELECT tl.tag_id 
        FROM tag_list tl 
        WHERE tl.product_id = p.id
    ) AS tag_ids,

    ARRAY(
        SELECT cl.category_id 
        FROM category_list cl 
        WHERE cl.product_id = p.id
    ) AS category_ids,

    ARRAY(
        SELECT i.id 
        FROM image i 
        WHERE i.product_id = p.id
    ) AS image_ids,

    (
        SELECT a.id 
        FROM asset a 
        WHERE a.product_id = p.id
    ) AS asset_id

FROM product p
    
"""

get_all_product = text(base_product_query + """ WHERE status = 'PUBLISHED' """)


get_user_product = text(base_product_query + """
    WHERE p.user_id = :id
    ORDER BY p.created_at DESC 
    """)

get_product_with_slug_query = text(base_product_query + """
WHERE p.slug = :slug""")

check_query = text("SELECT 1 FROM product WHERE slug = :slug")

insert_product_query = text("""
                                INSERT INTO product (user_id, name, slug, description, price_cent,included)
                                VALUES (:user_id, :name, :slug, :description, :price_cent, :included)
                                RETURNING id 
                                """)

image_query = text("""
                           INSERT INTO image(url, product_id, position)
                           VALUES (:url, :product_id, :position)
                           """)

asset_query = text("INSERT INTO asset(url, product_id) VALUES (:url, :product_id)")


tag_query = text(
    "INSERT INTO tag_list(tag_id, product_id) VALUES (:tag_id, :product_id)"
)

category_query = text(
    "INSERT INTO category_list(category_id, product_id) VALUES (:category_id, :product_id)"
)

update_product = text("""
                 UPDATE product
                 SET
                     name = COALESCE(:name, name),
                     slug = COALESCE(:slug, slug),
                     description = COALESCE(:description, description),
                     price_cent = COALESCE(:price_cent, price_cent),
                     included = COALESCE(:included, included)
                 WHERE slug = :product_slug
                   AND user_id = :user_id
                 RETURNING slug
                 """)

delete_product_query = text("""
    DELETE FROM product WHERE slug = :slug AND user_id = :user_id
        RETURNING id

""")

publish_product_query = text("""
UPDATE product
SET 
    status = 'PUBLISHED'    
    WHERE slug = :slug AND user_id = :user_id
    RETURNING id

""")


delete_category_list_query = text("""
    DELETE FROM category_list
    WHERE product_id = :product_id
""")

delete_tag_list_query = text("""
    DELETE FROM tag_list
    WHERE product_id = :product_id
""")
