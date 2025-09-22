from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from extensions import db
from models.user import User

bp = Blueprint("auth", __name__)

@bp.route("/register", methods=["POST"])
def register():
    """
    Inscrire un nouvel utilisateur
    ---
    tags:
      - Authentification
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - email
              - password
            properties:
              email:
                type: string
                format: email
                example: test@mail.com
              password:
                type: string
                format: password
                example: secret123
    responses:
      201:
        description: Inscription réussie
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: Inscription réussie
      400:
        description: Email ou mot de passe manquant / utilisateur déjà existant
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: Utilisateur déjà existant
    """
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
    """
    Connexion d'un utilisateur
    ---
    tags:
      - Authentification
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - email
              - password
            properties:
              email:
                type: string
                format: email
                example: test@mail.com
              password:
                type: string
                format: password
                example: secret123
    responses:
      200:
        description: Connexion réussie (JWT généré)
        content:
          application/json:
            schema:
              type: object
              properties:
                access_token:
                  type: string
                  example: eyJhbGciOiJIUzI1NiIsInR...
      400:
        description: Email ou mot de passe manquant
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: Email et mot de passe requis
      401:
        description: Identifiants invalides
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: Identifiants invalides
    """
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
