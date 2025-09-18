from flask import jsonify, request, redirect
from app import app
import requests

@app.route("/github/login")
def github_login():
    github_auth_url = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}&scope=read:user user:email"
    )
    return redirect(github_auth_url)
 
@app.route("/github/callback")
def github_callback():
    code = request.args.get("code")
    token_url = "https://github.com/login/oauth/access_token"
    token_data = {
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        "code": code,
    }
    headers = {"Accept": "application/json"}
    token_res = requests.post(token_url, data=token_data, headers=headers)
    token_json = token_res.json()
    access_token = token_json.get("access_token")
 
    # Récupère les infos utilisateur
    user_res = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"token {access_token}"}
    )
    user_json = user_res.json()
    return jsonify(user_json)
 