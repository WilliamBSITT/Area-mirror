from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from extensions import db
from models.user import User

bp = Blueprint("auth", __name__)

@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email et mot de passe requis"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Utilisateur déjà existant"}), 400
    
    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Inscription réussie"}), 201


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email et mot de passe requis"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Identifiants invalides"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token}), 200