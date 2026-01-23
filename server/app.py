from flask import Flask, jsonify, redirect, request
from flasgger import Swagger
from flask_cors import CORS
from extensions import db, migrate, jwt, setup_logger
from config import Config, swagger_config, template
from wait_db import wait_for_db
from apscheduler.schedulers.background import BackgroundScheduler
from core.hook_engine import check_hooks
from routes import register_routes
import requests
from models.service import seed_services

logger = setup_logger()

def create_app(mode="default"):
    app = Flask(__name__)
    swagger = Swagger(app, config=swagger_config, template=template)
    app.config.from_object(Config)

    if app.config.get("TESTING") or mode == "test":
        app.config.update({
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
            "SQLALCHEMY_ENGINE_OPTIONS": {},
        })
        logger.info("App started in TEST mode (SQLite in-memory).")

    db.init_app(app)
    migrate.init_app(app)
    jwt.init_app(app)
    CORS(app)
    register_routes(app)

    if app.config.get("TESTING") or mode == "test":
        with app.app_context():
            db.create_all()
        return app

    wait_for_db(app)
    with app.app_context():
        db.create_all()
        seed_services()

    scheduler = BackgroundScheduler()
    scheduler.add_job(
        lambda: check_hooks(app),
        "interval",
        seconds=app.config["SCHEDULER_INTERVAL"],
        id="check_hooks_job"
    )
    scheduler.start()

    logger.info("Flask successfully running")
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=8080, debug=True)