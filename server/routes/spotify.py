from flask import Blueprint, request, jsonify, redirect, session
import requests
import urllib.parse
import os
from datetime import datetime

bp = Blueprint("spotify_auth", __name__)

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI", "http://127.0.0.1:8080/spotify/callback")
AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"

@bp.route("/spotify/login", methods=["GET"])
def spotify_login():
    """
    Redirige l'utilisateur vers Spotify pour se connecter à l'application
    ---
    tags:
      - Spotify
    responses:
      302:
        description: Redirection vers la page d'autorisation Spotify
    """
    
    scope = "user-read-currently-playing user-read-playback-state"
    params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "scope": scope,
        "show_dialog": "true"
    }

    url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"
    return redirect(url)


@bp.route("/spotify/callback", methods=["GET"])
def spotify_callback():
    """
    Callback Spotify après l'authentification
    ---
    tags:
      - Spotify
    responses:
      200:
        description: Retourne les tokens d'accès Spotify
    """
    if "error" in request.args:
        return jsonify({"error": request.args["error"]}), 400

    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Missing authorization code"}), 400

    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
    }

    res = requests.post(TOKEN_URL, data=data)
    if res.status_code != 200:
        return jsonify({"error": res.text}), 400

    tokens = res.json()
    access_token = tokens.get("access_token")
    refresh_token = tokens.get("refresh_token")
    expires_in = tokens.get("expires_in")

    session["spotify_tokens"] = {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "expires_at": datetime.now().timestamp() + expires_in
    }

    return jsonify({
        "message": "Spotify connected successfully!",
        "tokens": tokens
    })