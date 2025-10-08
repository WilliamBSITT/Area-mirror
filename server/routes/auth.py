from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, decode_token
from extensions import db
from models.user import User

bp = Blueprint("auth", __name__, url_prefix="/auth")

@bp.route("/token", methods=["POST"])
def login():
    """
    Génère un JWT (login)
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
                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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

    # JWT identity doit être une string
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token, "id": user.id}), 200

@bp.route("/refresh", methods=["POST"])
def refresh():
  """
    Refresh un JWT expiré
    ---
    tags:
      - Authentification
    parameters:
      - in: header
        name: Authorization
        type: string
        required: true
        description: "JWT token au format: Bearer <access_token>"
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
                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
      401:
        description: Token invalide ou mal formé
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: Token invalide ou mal formé
      400:
        description: Identité introuvable dans le token
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: Identité introuvable dans le token
    """
  auth_header = request.headers.get("Authorization", None)
  if not auth_header:
    return jsonify({"error": "Authorization header manquant"}), 401

  parts = auth_header.split()
  if len(parts) != 2 or parts[0].lower() != "bearer":
    return jsonify({"error": "Format d'Authorization invalide"}), 401

  token = parts[1]
  try:
    decoded = decode_token(token, allow_expired=True)
  except Exception:
    return jsonify({"error": "Token invalide"}), 401

  if decoded.get("type") != "access":
    return jsonify({"error": "Le token fourni n'est pas un access token"}), 401

  identity = decoded.get("sub") or decoded.get("identity")
  if identity is None:
    return jsonify({"error": "Identité introuvable dans le token"}), 400

  new_token = create_access_token(identity=identity)
  return jsonify({"access_token": new_token}), 200


@bp.route("/token", methods=["GET"])
@jwt_required()
def verify_token():
    """
    Vérifie si le JWT est toujours valide
    ---
    tags:
      - Authentification
    parameters:
      - in: header
        name: Authorization
        type: string
        required: true
        description: "JWT token au format: Bearer <access_token>"
    responses:
      200:
        description: Token valide
        content:
          application/json:
            schema:
              type: object
              properties:
                valid:
                  type: boolean
                  example: true
                user_id:
                  type: integer
                  example: 1
      401:
        description: Token invalide ou expiré
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: Token invalide ou expiré
    """
    current_user_id = get_jwt_identity()
    return jsonify({"valid": True, "user_id": int(current_user_id)}), 200