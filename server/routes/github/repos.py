import requests
from flask import Blueprint, jsonify
import os

github_bp = Blueprint("github", __name__)

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
USERNAME = "jonazakana"

@github_bp.route("/github/repos", methods=["GET"])
def get_github_repos():
    url = f"https://api.github.com/users/{USERNAME}/repos"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        repos = response.json()
        simplified = [{"name": repo["name"], "url": repo["html_url"]} for repo in repos]
        return jsonify(simplified)
    else:
        return jsonify({"error": response.status_code, "message": response.text}), response.status_code
