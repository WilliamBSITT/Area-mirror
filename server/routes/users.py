from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.user import User

bp = Blueprint("users", __name__, url_prefix="/users")

@bp.route("", methods=["GET"])
# @jwt_required()
def get_users():
  """
    fetch all users
    ---
    tags:
      - Users
    responses:
      200:
        description: list all users
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                    example: 1
                  email:
                    type: string
                    example: test@mail.com
  """
  users = User.query.all()
  return jsonify([u.to_dict() for u in users]), 200

@bp.route("/<int:user_id>", methods=["GET"])
# @jwt_required()
def get_user(user_id):
  """
    fetch an userthanks to his ID
    ---
    tags:
      - Users
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        description: user ID
    responses:
      200:
        description: user details
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: integer
                  example: 1
                email:
                  type: string
                  example: test@mail.com
      404:
        description: user not found
  """
  user = User.query.get_or_404(user_id)
  return jsonify(user.to_dict()), 200


@bp.route("", methods=["POST"])
def create_user():
    """
    Crée un nouvel utilisateur
    ---
    tags:
      - Users
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
                example: test@mail.com
              password:
                type: string
                example: secret123
    responses:
      201:
        description: Utilisateur créé
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: integer
                  example: 1
                email:
                  type: string
                  example: test@mail.com
      400:
        description: Erreur de validation
    """
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "email or password required"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "user already exist"}), 400

    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(
        identity=str(user.id), 
    )

    response = user.to_dict()
    response["access_token"] = access_token

    return jsonify(response), 201
  

  
@bp.route("/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    """
    Met à jour un utilisateur
    ---
    tags:
      - Users
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        description: ID de l'utilisateur
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              email:
                type: string
              password:
                type: string
    responses:
      200:
        description: Utilisateur mis à jour
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: integer
                  example: 1
                email:
                  type: string
                  example: test@mail.com
      404:
        description: Utilisateur non trouvé
    """
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if email:
        user.email = email
    if password:
        user.set_password(password)
    
    db.session.commit()
    return jsonify(user.to_dict()), 200

@bp.route("/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    """
    Supprime un utilisateur
    ---
    tags:
      - Users
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        description: ID de l'utilisateur
    responses:
      200:
        description: Utilisateur supprimé
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: Utilisateur supprimé
      404:
        description: Utilisateur non trouvé
    """
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "user deleted"}), 200