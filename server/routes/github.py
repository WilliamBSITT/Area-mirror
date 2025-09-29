from flask import Blueprint, request, jsonify, redirect
import requests
import os

bp = Blueprint("github", __name__, url_prefix="/auth/github")

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

@bp.route("/login", methods=["GET"])
def github_login():
    """
    Obtenir l'URL de connexion GitHub
    ---
    tags:
      - Authentification GitHub
    responses:
      200:
        description: URL GitHub générée
        content:
          application/json:
            schema:
              type: object
              properties:
                auth_url:
                  type: string
                  example: "https://github.com/login/oauth/authorize?client_id=xxx&scope=read:user user:email"
    """
    github_auth_url = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}&scope=read:user user:email"
    )
    return redirect(github_auth_url)


@bp.route("/token", methods=["POST"])
def github_token():
    """
    Échanger le code GitHub contre un access token
    ---
    tags:
      - Authentification GitHub
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - code
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
    data = request.get_json()
    code = data.get("code")

    if not code:
        return jsonify({"error": "Code GitHub manquant"}), 400

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
        return jsonify({"error": "Impossible d’obtenir le token GitHub"}), 400

    return jsonify({"access_token": token_json["access_token"]}), 200


@bp.route("/me", methods=["GET"])
def github_me():
    """
    Récupérer les infos utilisateur GitHub avec un access token
    ---
    tags:
      - Authentification GitHub
    parameters:
      - name: Authorization
        in: header
        required: true
        schema:
          type: string
        description: "Token GitHub au format 'token <ACCESS_TOKEN>'"
        example: "token ghp_xxx123abc"
    responses:
      200:
        description: Infos utilisateur GitHub
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: integer
                  example: 123456
                login:
                  type: string
                  example: octocat
                email:
                  type: string
                  example: octocat@github.com
      401:
        description: Token invalide
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Authorization header manquant"}), 401

    user_res = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": auth_header}
    )
    if user_res.status_code != 200:
        return jsonify({"error": "Token GitHub invalide"}), 401

    return jsonify(user_res.json()), 200