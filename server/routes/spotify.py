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


@bp.route("/spotify/callback")
def spotify_callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Missing code"}), 400

    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
    }

    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    res = requests.post("https://accounts.spotify.com/api/token", data=data, headers=headers)
    tokens = res.json()

    if "access_token" not in tokens:
        return jsonify({"error": "Spotify token exchange failed", "details": tokens}), 400

    # Redirige vers ton FRONT avec les tokens dans le hash fragment (sécurisé)
    front_url = os.getenv("FRONT_REDIRECT_URI")
    redirect_url = f"{front_url}#access_token={tokens['access_token']}&refresh_token={tokens.get('refresh_token','')}"
    return redirect(redirect_url)
