from extensions import db
from sqlalchemy.dialects.postgresql import JSON


class Area(db.Model):
    __tablename__ = "areas"

    id = db.Column(db.Integer, primary_key=True)
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


