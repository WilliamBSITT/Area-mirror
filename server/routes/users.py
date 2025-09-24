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