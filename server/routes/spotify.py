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

import urllib.parse

@bp.route("/spotify/login")
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
    }

    auth_url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"
    return redirect(auth_url)



@bp.route("/spotify/callback")
def spotify_callback():
    code = request.args.get("code")
    state = request.args.get("state", "frontend:web")

    frontend = state.split(":")[1]

    tokens = {...}

    if frontend == "mobile":
        redirect_uri = "areaapp://auth/spotify/callback"
    else:
        redirect_uri = "http://localhost:5173/spotify/callback"

    redirect_url = (
        f"{redirect_uri}?access_token={tokens['access_token']}"
        f"&refresh_token={tokens.get('refresh_token','')}"
    )
    return redirect(redirect_url)

