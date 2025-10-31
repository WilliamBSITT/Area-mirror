from .base_service import BaseService
import requests
import re
import os
from datetime import datetime, timezone


class SpotifyService(BaseService):
    name = "spotify"
    
    def __init__(self):
        self.token_url = "https://accounts.spotify.com/api/token"
        self.api_base = "https://api.spotify.com/v1"
        self.client_id = os.getenv("SPOTIFY_CLIENT_ID")
        self.client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
        
    def refresh_token(self, refresh_token):
        data = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": self.client_id,
            "client_secret": self.client_secret,
        }
        
        res = requests.post(self.token_url, data=data)
        if res.status_code != 200:
            print("error")
            return None
        return res.json()
    
    def get_actions(self):
        return [
            {"name": "new_title", "description": "Détecte un nouveaux titre d'un artiste suivi"},
            {"name": "currently_playing", "description": "recupere la musique actuellement jouée"}
        ]

    def get_reactions_params(self, reaction_name):
        if reaction_name == "play":
            return [
                {"name": "citrack_uri", "type": "String", "required": False, "description": "URI de la piste à jouer (optionnel)"},
                {"name": "access_tokens", "type": "Object", "required": True, "description": "Tokens d'authentification Spotify"},
                {"name": "refresh_token", "type": "String", "required": True, "description": "Refresh token Spotify"}
            ]
        return [
            {"name": "access_tokens", "type": "Object", "required": True, "description": "Tokens d'authentification Spotify"},
            {"name": "refresh_token", "type": "String", "required": True, "description": "Refresh token Spotify"}
        ]
    
    def get_actions_params(self, action_name):
        return [
            {"name": "access_token", "type": "String", "required": True, "description": "Access token Spotify"},
            {"name": "refresh_token", "type": "String", "required": True, "description": "Refresh token Spotify"},
        ]
    
    def get_reactions(self):
        return [
            {"name": "play", "description": "Joue une musique"},
            {"name": "pause", "description": "Met en pause la musique"},
            {"name": "next", "description": "Passe à la musique suivante"},
            {"name": "previous", "description": "Retourne à la musique précédente"}
        ]

    def check_action(self, user, action, params=None):
            params = params or {}
            access_token = params.get("access_token")
            refresh_token = params.get("refresh_token")

            if not access_token or not refresh_token:
                print("[Spotify] Tokens manquants")
                return None

            headers = {"Authorization": f"Bearer {access_token}"}
            url = f"{self.api_base}/me/player/currently-playing"

            res = requests.get(url, headers=headers)

            if res.status_code == 401:
                refreshed = self.refresh_token(refresh_token)
                if not refreshed:
                    print("[Spotify] Refresh token échoué")
                    return None

                access_token = refreshed.get("access_token")
                headers["Authorization"] = f"Bearer {access_token}"
                res = requests.get(url, headers=headers)

            if res.status_code != 200:
                print(f"[Spotify] Erreur API ({res.status_code}): {res.text}")
                return None

            data = res.json()
            item = data.get("item")
            if not item:
                return None

            track_name = item.get("name")
            artist_name = item["artists"][0]["name"] if item.get("artists") else "Inconnu"
            album_name = item["album"]["name"]
            track_url = item["external_urls"]["spotify"]

            if action == "currently_playing":
                return {
                    "track": track_name,
                    "artist": artist_name,
                    "album": album_name,
                    "url": track_url
                }

            elif action == "new_title":
                last_title = params.get("last_title")
                if last_title == track_name:
                    return None
                params["last_title"] = track_name
                params["last_updated"] = datetime.now(timezone.utc).isoformat()
                return {
                    "track": track_name,
                    "artist": artist_name,
                    "album": album_name,
                    "url": track_url
                }

            return None
    
    def execute_reaction(self, user, reaction, params=None, data=None):
        tokens = params.get("tokens", {})
        access_token = tokens.get("access_token")
        refresh_token = tokens.get("refresh_token")

        if not access_token or not refresh_token:
            print("[Spotify] Missing tokens in params")
            return False

        headers = {"Authorization": f"Bearer {access_token}"}

        endpoints = {
            "play": f"{self.api_base}/me/player/play",
            "pause": f"{self.api_base}/me/player/pause",
            "next": f"{self.api_base}/me/player/next",
            "previous": f"{self.api_base}/me/player/previous"
        }

        endpoint = endpoints.get(reaction)
        if not endpoint:
            print(f"[Spotify] Réaction inconnue: {reaction}")
            return False

        body = None
        if reaction == "play":
            track_uri = params.get("track_uri")
            if track_uri:
                body = {"uris": [track_uri]}

        res = requests.post(endpoint, headers=headers, json=body)
        if res.status_code == 405:
            res = requests.put(endpoint, headers=headers, json=body)

        if res.status_code == 401:
            refreshed = self.refresh_token(refresh_token)
            if not refreshed:
                return False

            new_access = refreshed.get("access_token")
            headers["Authorization"] = f"Bearer {new_access}"
            res = requests.post(endpoint, headers=headers, json=body)
            if res.status_code == 405:
                res = requests.put(endpoint, headers=headers, json=body)

        if res.status_code not in (200, 204):
            print(f"[Spotify] Échec de la requête {reaction}: {res.status_code} → {res.text}")
            return False

        return True

