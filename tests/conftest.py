from dotenv import load_dotenv
import os
import pytest

# Cherche le .env à la racine du projet ou dans /server
for path in [".env", "server/.env"]:
    env_path = os.path.join(os.path.dirname(__file__), "..", path)
    env_path = os.path.abspath(env_path)
    if os.path.exists(env_path):
        load_dotenv(dotenv_path=env_path)
        break

from server.app import create_app

@pytest.fixture
def client():
    app = create_app(mode="test")
    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client

