from extensions import db

class Area(db.Model):
    __tablename__ = "area"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    service = db.Column(db.String(80), nullable=False)
    action = db.Column(db.String(80), nullable=False)
    reaction = db.Column(db.String(80), nullable=False)
    city = db.Column(db.String(100), nullable=True)
    enabled = db.Column(db.Boolean, default=True)

    user = db.relationship("User", backref="areas")
