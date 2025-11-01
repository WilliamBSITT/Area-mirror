from flask import request, jsonify, Blueprint
from itsdangerous import URLSafeSerializer, BadSignature
import os
import re
import ipaddress

bp = Blueprint("ip_manager", __name__, url_prefix="/ip")

SECRET_KEY = os.getenv("IP_SECRET_KEY", "default_secret_key")
SALT = os.getenv("IP_SALT", "ip_salt")

serializer = URLSafeSerializer(SECRET_KEY, salt=SALT)

def extract_ip(exp_url: str) -> str | None:
    """
    Extrait l'IP d'une URL Expo (exp://IP:PORT)
    """
    pattern = r"exp://([\d\.]+):\d+"
    match = re.match(pattern, exp_url)
    if match:
        return match.group(1)
    return None

def validate_ip(ip_str):
    try:
        ipaddress.ip_address(ip_str)
        return True
    except ValueError:
        return False
    


def decode_ip(ip_encoded):
    """
    Attendu JSON: { "encoded": "<string>" }
    Réponse JSON: { "ip": "1.2.3.4" } ou erreur 400/401
    """
    data = ip_encoded
    if not ip_encoded:
        return None

    try:
        ip = serializer.loads(data)
    except BadSignature:
        return None
    except Exception:
        return None

    if not validate_ip(ip):
        return None

    return ip

@bp.route("/encode", methods=["POST"])
def encode_ip():
    data = request.get_json(force=True, silent=True)
    if not data or "ip" not in data:
        return jsonify({"error": "Missing 'ip' in request body"}), 400
    
    url = str(data["ip"]).strip()
    ip = extract_ip(url)
    with open("oui.txt", "w") as f:
        print(f"Encoding IP: {ip}", file=f)
    if not validate_ip(ip):
        return jsonify({"error": "Invalid IP address format"}), 400
    token = serializer.dumps(ip)
    return jsonify({"encoded": token}), 200