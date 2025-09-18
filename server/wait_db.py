import time
from sqlalchemy.exc import OperationalError
from sqlalchemy import text
from extensions import db

def wait_for_db(app, retries=10, delay=3):
    with app.app_context():
        for i in range(retries):
            try:
                db.session.execute(text("SELECT 1"))  # <-- utiliser text()
                print("DB ready!")
                return
            except OperationalError:
                print(f"DB not ready, retrying {i+1}/{retries}...")
                time.sleep(delay)
        raise Exception("DB not ready after retries")

