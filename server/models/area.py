from extensions import db
from sqlalchemy.dialects.postgresql import JSON
from utils.crypto_manager import crypto

class Area(db.Model):
    __tablename__ = "areas"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    action_service = db.Column(db.String(80), nullable=False)
    action = db.Column(db.String(80), nullable=False)
    reaction_service = db.Column(db.String(80), nullable=False)
    reaction = db.Column(db.String(80), nullable=False)
    frequency = db.Column(db.Integer, default=3600)
    last_run = db.Column(db.DateTime, default=None)
    params = db.Column(db.JSON, nullable=True)
    enabled = db.Column(db.Boolean, default=True)

    user = db.relationship("User", backref="areas")


    def set_params(self, params: dict):

        safe = {}
        for k, v in (params or {}).items():
            if "password" in k.lower():
                safe[k] = crypto.encrypt(v)
            else:
                safe[k] = v
        self.params = safe

    def get_params(self) -> dict:

        safe = {}
        for k, v in (self.params or {}).items():
            if isinstance(v, str) and "password" in k.lower():
                try:
                    safe[k] = crypto.decrypt(v)
                except Exception:
                    safe[k] = v
            else:
                safe[k] = v
        return safe