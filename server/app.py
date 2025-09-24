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

logger = setup_logger()

def create_app():
    app = Flask(__name__)
    swagger = Swagger(app, config=swagger_config, template=template)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app)
    jwt.init_app(app)

    CORS(app)

    register_routes(app)

    wait_for_db(app)
    with app.app_context():
        db.create_all()

    scheduler = BackgroundScheduler()
    scheduler.add_job(lambda: check_hooks(app), "interval", seconds=app.config["SCHEDULER_INTERVAL"], id="check_hooks_job")
    scheduler.start()
    
    logger.info("FLASK successfully running")
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=8080, debug=True)