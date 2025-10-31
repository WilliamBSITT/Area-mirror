from flask import Blueprint, request, jsonify, redirect, session
import requests
import urllib.parse
import os
from datetime import datetime
from .ip_manager import decode_ip
import json
import re


bp = Blueprint("spotify_auth", __name__)

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI", "https://avowedly-uncomputed-velvet.ngrok-free.dev/spotify/callback")
AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"

@bp.route("/spotify/login", methods=["GET"])
def spotify_login():
    frontend = request.args.get("frontend", "web")
    encoded_ip = request.args.get("ip", None)
    
    if encoded_ip:
        ip = decode_ip(encoded_ip)
        if not ip:
            return jsonify({"error": "Invalid or tampered 'ip' parameter"}), 400
    scope = "user-read-currently-playing user-read-playback-state"
    state = json.dumps({
        "frontend": frontend,
        "ip": ip
    })

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


@bp.route("/spotify/callback")
def spotify_callback():
    code = request.args.get("code")
    state_str = request.args.get("state", '{"frontend":"web"}')

    with open("fouffe.txt", "w") as f:
        print(f"Spotify callback state: {state_str}", file=f)
    clean = state_str.replace('+', '')
    data = json.loads(clean)
    
    frontend = data.get("frontend")
    ip = data.get("ip")

    if not code:
        return jsonify({"error": "Missing authorization code"}), 400

    if frontend == "mobile":
        mobile_redirect_uri = f"exp://{ip}:8083?code={code}"
        print(f"Redirecting to mobile app: {mobile_redirect_uri}")
        return redirect(mobile_redirect_uri)

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
    return redirect(f"http://localhost:8081/services?tokens={tokens}")
    return jsonify({
        "message": "Spotify connected successfully!",
        "tokens": tokens
    })




@bp.route("/spotify/exchange_token", methods=["POST"])
def spotify_exchange_token():
    """
    Échange le code d'autorisation contre les tokens Spotify (pour mobile)
    """
    data = request.get_json()
    code = data.get("code")

    if not code:
        return jsonify({"error": "Missing authorization code"}), 400

    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": os.getenv("SPOTIFY_REDIRECT_URI", "https://avowedly-uncomputed-velvet.ngrok-free.dev/spotify/callback"),
        "client_id": os.getenv("SPOTIFY_CLIENT_ID"),
        "client_secret": os.getenv("SPOTIFY_CLIENT_SECRET")
    }

    res = requests.post("https://accounts.spotify.com/api/token", data=payload)

    if res.status_code != 200:
        print("[Spotify] Token exchange failed:", res.text)
        return jsonify({"error": "Spotify token exchange failed", "details": res.text}), 400

    tokens = res.json()
    return jsonify({
        "message": "Spotify tokens received",
        "tokens": tokens
    })




