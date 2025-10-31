from flask import Blueprint, jsonify, redirect, request
import requests, urllib.parse, os
from .ip_manager import decode_ip
import json

bp = Blueprint("github_service", __name__, url_prefix="/git")

CLIENT_ID = os.getenv("GITHUB_APP_CLIENT_ID")
CLIENT_SECRET = os.getenv("GITHUB_APP_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GITHUB_APP_REDIRECT_URI", "https://avowedly-uncomputed-velvet.ngrok-free.dev/git/callback")
AUTH_URL = os.getenv("GITHUB_AUTH_URL", "https://github.com/login/oauth/authorize")
TOKEN_URL = os.getenv("GITHUB_TOKEN_URL", "https://github.com/login/oauth/access_token")


@bp.route("/login", methods=["GET"])
def github_login():
    """
    Redirige l'utilisateur vers GitHub pour autorisation OAuth
    """

    frontend = request.args.get("frontend", "web")
    encoded_ip = request.args.get("ip", None)
    port = request.args.get("port", None)

    if encoded_ip:    
        ip = decode_ip(encoded_ip)
        if not ip:
            return jsonify({"error": "Invalid or tampered 'ip' parameter"}), 400


    scope = "repo user"
    state = json.dumps({
        "frontend": frontend,
        "ip": ip,
        "port": port
    })

    params = {
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "scope": scope,
        "state": state
    }
    url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"
    return redirect(url)

@bp.route("/callback", methods=["GET"])
def github_callback():
    """
    Récupère le code GitHub et redirige selon la plateforme (web ou mobile)
    """
    if "error" in request.args:
        return jsonify({"error": request.args["error"]}), 400

    code = request.args.get("code")
    state_str = request.args.get("state", '{"frontend":"web"}')

    clean = state_str.replace('+', '')
    data = json.loads(clean)
    
    frontend = data.get("frontend")
    ip = data.get("ip")
    port = data.get("port")

    if not code:
        return jsonify({"error": "Missing authorization code"}), 400


    if frontend == "mobile":
        mobile_redirect_uri = f"exp://{ip}:{port}"
        return redirect(f"{mobile_redirect_uri}?code={code}")

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

    return redirect(f"http://localhost:8081/services?tokens={tokens}")
    return jsonify({
        "message": "GitHub connected successfully!",
        "tokens": tokens
    })

@bp.route("/exchange_token", methods=["POST"])
def github_exchange_token():
    """
    Échange le code GitHub contre les tokens (pour mobile)
    """
    data = request.get_json()
    code = data.get("code")

    if not code:
        return jsonify({"error": "Missing authorization code"}), 400

    payload = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
        "redirect_uri": REDIRECT_URI,
    }

    headers = {"Accept": "application/json"}
    res = requests.post(TOKEN_URL, data=payload, headers=headers)

    if res.status_code != 200:
        print("[GitHub] Token exchange failed:", res.text)
        return jsonify({"error": "GitHub token exchange failed", "details": res.text}), 400

    tokens = res.json()
    return jsonify({
        "message": "GitHub tokens received",
        "tokens": tokens
    })


