from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db
import binascii

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    pictures = db.Column(db.LargeBinary(length=(2**24)-1), nullable=True)
    expo_push_token = db.Column(db.String(255), nullable=True)
    allow_notifications = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {"id": self.id, "email": self.email, "pictures": binascii.b2a_base64(self.pictures).decode('utf-8') if self.pictures else None, "allow_notifications": self.allow_notifications}
