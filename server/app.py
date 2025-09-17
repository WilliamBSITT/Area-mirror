from flask import Flask
from flask_cors import CORS
from extensions import db, migrate, jwt
from config import Config
from wait_db import wait_for_db
from routes import register_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app)
    jwt.init_app(app)

    CORS(app)

    register_routes(app)

    wait_for_db(app)
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=8080, debug=True)