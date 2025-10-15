from flask import Blueprint, request, jsonify, redirect
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import requests
import os
from models.user import User
from extensions import db

bp = Blueprint("github", __name__, url_prefix="/auth/github")

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_CLIENT_WEB_ID = os.getenv("GITHUB_WEB_CLIENT_ID")
GITHUB_CLIENT_WEB_SECRET = os.getenv("GITHUB_WEB_CLIENT_SECRET")

@bp.route("/token", methods=["POST", "GET"])
def github_token_callback():
    """
    Callback OAuth GitHub (GET ou POST)
    ---
    tags:
      - Authentification GitHub
    parameters:
      - in: query
        name: code
        required: false
        schema:
          type: string
        description: "Code d'autorisation GitHub (GET)"
      - in: body
        name: body
        required: false
        schema:
          type: object
          properties:
            code:
              type: string
              example: "123456"
    responses:
      200:
        description: Token GitHub obtenu
        content:
          application/json:
            schema:
              type: object
              properties:
                access_token:
                  type: string
                  example: ghp_xxx123abc
      400:
        description: Code invalide
    """
    code = request.args.get("code") or (request.json and request.json.get("code"))
    if not code:
        return jsonify({"error": "Code GitHub manquant"}), 400

    
    token_url = "https://github.com/login/oauth/access_token"
    token_data = {
        "client_id": GITHUB_CLIENT_WEB_ID,
        "client_secret": GITHUB_CLIENT_WEB_SECRET,
        "code": code,
    }
    headers = {"Accept": "application/json"}
    token_res = requests.post(token_url, data=token_data, headers=headers)
    token_json = token_res.json()

    if "access_token" not in token_json:
        token_url = "https://github.com/login/oauth/access_token"
        token_data = {
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code,
        }
        headers = {"Accept": "application/json"}
        token_res = requests.post(token_url, data=token_data, headers=headers)
        token_json = token_res.json()

    if "access_token" not in token_json:
        return jsonify({"error": "Impossible d’obtenir le token GitHub", "github": token_json}), 400

    access_token = token_json["access_token"]
    headers = {"Authorization": f"token {access_token}"}
    user_res = requests.get("https://api.github.com/user", headers=headers)

    if user_res.status_code != 200:
        return jsonify({"error": "Token GitHub invalide"}), 400
    user_data = user_res.json()

    user = User.query.filter_by(email=user_data.get("login")).first()
    if not user:
        new_user = User(email=user_data.get("login"))
        new_user.set_password("osauth")
        db.session.add(new_user)
        db.session.commit()
        user = new_user

    access_token = create_access_token(
        identity=str(user.id), 
    )

    response = user.to_dict()
    response["access_token"] = access_token

    return jsonify(response), 201


