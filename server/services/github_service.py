from .base_service import BaseService
import requests, jwt, time, os
from datetime import datetime, timezone

class GithubService(BaseService):
    name = "github"

    def __init__(self):
        self.api_url = "https://api.github.com"


    def _auth_headers(self, params: dict):
        token = (params or {}).get("token")
        if not token:
            print("[GitHubService] Missing token in params")
            return None
        return {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }


    def get_actions(self):
        return [
            {"name": "new_commit", "description": "Détecte un nouveau commit sur un dépôt GitHub"},
            {"name": "new_issue",  "description": "Détecte la création d'une nouvelle issue"}
        ]

    def get_reactions(self):
        return [
            {"name": "create_issue", "description": "Crée une issue dans un dépôt GitHub"},
            {"name": "star_repo",    "description": "Ajoute une étoile à un dépôt GitHub"}
        ]
    
    def get_actions_params(self, action_name):
        if action_name == "new_commit":
            return [
                {"name": "repo", "type": "string", "description": "Dépôt à surveiller au format 'owner/repo'"},
                {"name": "token", "type": "string", "description": "Token d'accès GitHub avec les permissions nécessaires"},
                {"name": "last_commit", "type": "string", "description": "SHA du dernier commit vu (utilisé pour le suivi)"}
            ]
        elif action_name == "new_issue":
            return [
                {"name": "repo", "type": "string", "description": "Dépôt à surveiller au format 'owner/repo'"},
                {"name": "token", "type": "string", "description": "Token d'accès GitHub avec les permissions nécessaires"},
                {"name": "last_issue", "type": "integer", "description": "ID de la dernière issue vue (utilisé pour le suivi)"}
            ]
        else:
            return []
    
    def get_reactions_params(self, reaction_name):
        if reaction_name == "create_issue":
            return [
                {"name": "repo", "type": "string", "description": "Dépôt cible au format 'owner/repo'"},
                {"name": "title", "type": "string", "description": "Titre de l’issue"},
                {"name": "body", "type": "string", "description": "Corps de l’issue (peut inclure des placeholders pour les données d’action)"},
                {"name": "access_token", "type": "string", "description": "Token d'accès GitHub avec les permissions nécessaires"}
            ]
        elif reaction_name == "star_repo":
            return [
                {"name": "repo", "type": "string", "description": "Dépôt à étoiler au format 'owner/repo'"},
                {"name": "access_token", "type": "string", "description": "Token d'accès GitHub avec les permissions nécessaires"}
            ]
        else:
            return []


    def check_action(self, user, action, params=None):
        if not params:
            return None

        repo = params.get("repo")
        if not repo:
            print("[GitHubService] Missing 'repo' param (format 'owner/repo').")
            return None

        headers = self._auth_headers(params)
        if not headers:
            print("[GitHubService] Missing or invalid token in params.")
            return None

        if action == "new_commit":
            url = f"{self.api_url}/repos/{repo}/commits"
            res = requests.get(url, headers=headers)
            if res.status_code != 200:
                print(f"[GitHubService] Commit check failed: {res.text}")
                return None

            commits = res.json()
            if not commits:
                return None

            latest_commit = commits[0]
            commit_sha = latest_commit.get("sha")
            last_seen = params.get("last_commit")

            if last_seen == commit_sha:
                return None

            params["last_commit"] = commit_sha
            commit_msg = latest_commit["commit"]["message"]
            author = latest_commit["commit"]["author"]["name"]

            return {
                "repo": repo,
                "commit_msg": commit_msg,
                "author": author,
                "sha": commit_sha
            }

        elif action == "new_issue":
            url = f"{self.api_url}/repos/{repo}/issues"
            res = requests.get(url, headers=headers)
            if res.status_code != 200:
                print(f"[GitHubService] Issue check failed: {res.text}")
                return None

            issues = [i for i in res.json() if "pull_request" not in i]
            if not issues:
                return None

            latest = issues[0]
            issue_id = latest.get("id")
            last_seen = params.get("last_issue")

            if last_seen == issue_id:
                return None

            params["last_issue"] = issue_id
            return {
                "repo": repo,
                "title": latest["title"],
                "url": latest["html_url"],
                "author": latest["user"]["login"]
            }

        else:
            print(f"[GitHubService] Unknown action: {action}")
            return None


    def execute_reaction(self, user, reaction, params=None, data=None):
        if not params:
            return False

        repo = params.get("repo")
        headers = self._auth_headers(params)
        if not headers:
            print("[GitHubService] Missing or invalid token for reaction.")
            return False

        if reaction == "create_issue":
            title = params.get("title", "Nouvelle issue depuis AREA")
            body_template = params.get("body", "Créée automatiquement via AREA.")
            body = body_template.format(**(data or {}))

            res = requests.post(
                f"{self.api_url}/repos/{repo}/issues",
                headers=headers,
                json={"title": title, "body": body}
            )
            return res.status_code == 201

        elif reaction == "star_repo":
            res = requests.put(f"{self.api_url}/user/starred/{repo}", headers=headers)
            return res.status_code in (204, 304)

        else:
            print(f"[GitHubService] Unknown reaction: {reaction}")
            return False

    def get_actions_output(self, action_name):
        if action_name == "new_commit":
            return [
                {"name": "repo", "type": "string", "description": "Nom du dépôt"},
                {"name": "commit_msg", "type": "string", "description": "Message du commit"},
                {"name": "author", "type": "string", "description": "Auteur du commit"},
                {"name": "sha", "type": "string", "description": "SHA du commit"}
            ]
        elif action_name == "new_issue":
            return [
                {"name": "repo", "type": "string", "description": "Nom du dépôt"},
                {"name": "title", "type": "string", "description": "Titre de l’issue"},
                {"name": "url", "type": "string", "description": "Lien vers l’issue"},
                {"name": "author", "type": "string", "description": "Auteur de l’issue"}
            ]
        else:
            return []