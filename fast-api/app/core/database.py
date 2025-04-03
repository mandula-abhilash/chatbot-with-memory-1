import psycopg2
from psycopg2.extras import RealDictCursor
from .config import settings

def get_db_connection():
    return psycopg2.connect(
        host=settings.PG_HOST,
        port=settings.PG_PORT,
        database=settings.PG_DATABASE,
        user=settings.PG_USER,
        password=settings.PG_PASSWORD,
        cursor_factory=RealDictCursor
    )