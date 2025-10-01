from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
import logging
import os

#DB
db = SQLAlchemy()

#DATA MIGRATION
migrate = Migrate()

#JWT
jwt = JWTManager()

#LOGGER
def setup_logger():
    
    log_dir = os.path.join(os.getcwd(), "logs")
    os.makedirs(log_dir, exist_ok=True)
    
    log_file = os.path.join(log_dir, "api.log")
    
    log_format = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    
    logging.basicConfig(
        level=logging.DEBUG,
        format=log_format,
        handlers=[
            logging.FileHandler(log_file, encoding='utf-8')
        ]
    )
    
    return logging.getLogger("AREA-API")