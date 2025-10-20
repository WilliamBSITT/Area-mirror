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
    frontend = request.args.get("frontend", "web")
    scope = "user-read-currently-playing user-read-playback-state"
    state = f"frontend:{frontend}"

    params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "scope": scope,
        "state": state,
        "show_dialog": "true"
    }

    url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"
    return redirect(url)


@bp.route("/spotify/callback", methods=["GET"])
def spotify_callback():
    if "error" in request.args:
        return jsonify({"error": request.args["error"]}), 400

    code = request.args.get("code")
    state = request.args.get("state", "frontend:web")

    frontend = state.split(":")[1]

    if frontend == "mobile":
        # 👉 Retour direct pour le mobile (pas de redirection navigateur)
        return jsonify({
            "message": "Authorization successful",
            "code": code
        })

    # Si c’est un login via web, on continue le flow normal
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
    return jsonify({
        "message": "Spotify connected successfully!",
        "tokens": tokens
    })


@bp.route("/spotify/exchange_token", methods=["POST"])
def spotify_exchange_token():
    body = request.get_json()
    code = body.get("code")

    if not code:
        return jsonify({"error": "Missing code"}), 400

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
    return jsonify({
        "message": "Spotify tokens received",
        "tokens": tokens
    })



