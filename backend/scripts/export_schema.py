from pathlib import Path

from gql.schema import schema

BACKEND_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BACKEND_DIR.parent / "frontend"

schema_text = schema.as_str()

backend_schema = BACKEND_DIR / "schema.graphql"
frontend_schema = FRONTEND_DIR / "schema.graphql"

backend_schema.write_text(schema_text)
frontend_schema.write_text(schema_text)

print(f"Backend schema: {backend_schema}")
print(f"Frontend schema: {frontend_schema}")
