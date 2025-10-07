from .base_service import BaseService
import requests
import re
import os
from datetime import datetime


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

    def get_reactions(self):
        return [
            {"name": "play", "description": "Joue une musique"},
            {"name": "pause", "description": "Met en pause la musique"},
            {"name": "next", "description": "Passe à la musique suivante"},
            {"name": "previous", "description": "Retourne à la musique précédente"}
        ]

    def check_action(self, user, action, params=None):
        tokens = params.get("tokens", {})
        access_token = tokens.get("access_token")
        refresh_token = tokens.get("refresh_token")
        
        if not access_token or not refresh_token:
            return None
        
        headers = {"Authorization": f"Bearer {access_token}"}
        url = f"{self.api_base}/me/player/currently-playing"
        
        res = requests.get(url, headers=headers)
        
        if res.status_code == 401:
            refreshed = self.refresh_token(refresh_token)
            if not refreshed:
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
        url = item["external_urls"]["spotify"]

        if action == "new_title":
            last_title = params.get("last_title")
            if last_title == track_name:
                return None
            params["last_title"] = track_name

        return {
            "track": track_name,
            "artist": artist_name,
            "album": album_name,
            "url": url
        }

    
    def execute_reaction(self, user, reaction, params=None, data=None):
        pass

    # met en pause / play la lecture de la musique par default mais si on veut on peut preciser la musique a jouer
    # def play_musique(self, uri=None):
        # if 'access_token' not in session:
        #     return redirect('/login')

        # if datetime.now().timestamp() > session['expires_at']:
        #     return redirect('/refresh_token')

        # headers = {
        # 'Authorization': f"Bearer {session['access_token']}"
        # }

        # if uri:
        #     data = {
        #         "uris": [uri]
        #     }
        # else:
        #     data = {}

        # response = requests.put(f'{self.api_base}/me/player/play', headers=headers, json=data)
        # if response.status_code != 204:
        #     return f"Erreur lors de la lecture de la musique: {response.status_code} - {response.text}"

    # met la musique suivante
    # def next_musique(self):
        # if 'access_token' not in session:
        #     return redirect('/login')

        # if datetime.now().timestamp() > session['expires_at']:
        #     return redirect('/refresh_token')

        # headers = {
        # 'Authorization': f"Bearer {session['access_token']}"
        # }

        # response = requests.post(f'{self.api_base}/me/player/next', headers=headers)
        # if response.status_code != 204:
        #     return f"Erreur lors du passage à la musique suivante: {response.status_code} - {response.text}"

    # met la musique precedente
    # def previous_musique(self):
        # if 'access_token' not in session:
        #     return redirect('/login')

        # if datetime.now().timestamp() > session['expires_at']:
        #     return redirect('/refresh_token')

        # headers = {
        # 'Authorization': f"Bearer {session['access_token']}"
        # }

        # response = requests.post(f'{self.api_base}/me/player/previous', headers=headers)
        # if response.status_code != 204:
        #     return f"Erreur lors du passage à la musique précédente: {response.status_code} - {response.text}"

    # Recupere la musique actuellement jouée
    # def currently_playing(self, user, params=None):
    #     if 'access_token' not in session:
    #         return redirect('/login')

    #     if datetime.now().timestamp() > session['expires_at']:
    #         return redirect('/refresh_token')

    #     headers = {
    #         'Authorization': f"Bearer {session['access_token']}"
    #     }

    #     response = requests.get(f'{self.api_base}/me/player/currently-playing', headers=headers)
    #     if response.status_code != 200:
    #         return f"Erreur lors de la récupération de la musique actuellement jouée: {response.status_code} - {response.text}"

    #     data = response.json()
    #     return data

    # detection d'un nouveau titre d'un artiste suivi
    # def new_title(self, user, params=None):
        # if 'access_token' not in session:
        #     return redirect('/login')

        # if datetime.now().timestamp() > session['expires_at']:
        #     return redirect('/refresh_token')

        # headers = {
        #     'Authorization': f"Bearer {session['access_token']}"
        # }

