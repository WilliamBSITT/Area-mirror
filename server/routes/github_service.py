from flask import Blueprint, jsonify, redirect, request
import requests, urllib.parse, os

bp = Blueprint("github_service", __name__, url_prefix="/git")

CLIENT_ID = os.getenv("GITHUB_APP_CLIENT_ID")
CLIENT_SECRET = os.getenv("GITHUB_APP_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GITHUB_APP_REDIRECT_URI")
AUTH_URL = os.getenv("GITHUB_AUTH_URL")
TOKEN_URL = os.getenv("GITHUB_TOKEN_URL")


@bp.route("/login")
def github_login():
    """
    Redirige l'utilisateur vers GitHub pour autorisation OAuth
    """
    scope = "repo user"
    params = {
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "scope": scope,
    }

    url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"
    return redirect(url)


@bp.route("/callback")
def github_callback():
    """
    Récupère le code GitHub et échange contre un access_token
    """
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Missing authorization code"}), 400

    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
        "redirect_uri": REDIRECT_URI,
    }

    headers = {"Accept": "application/json"}
    res = requests.post(TOKEN_URL, data=data, headers=headers)
    tokens = res.json()

    if "access_token" not in tokens:
        return jsonify({"error": "GitHub OAuth failed", "details": tokens}), 400

    return jsonify({
        "message": "GitHub connected successfully!",
        "tokens": tokens
    })


