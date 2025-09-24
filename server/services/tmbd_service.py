import base_service
import requests
import os

class TMDBService(base_service.BaseService):
    name = "tmdb"

    def __init__(self):
        self.api_key = os.getenv("TMDB_API_KEY")
        if not self.api_key:
            raise ValueError("TMDB_API_KEY not set in environment variables")
        self.base_url = f'https://api.themoviedb.org/3/movie/'
        self.end_url = f'?api_key={self.api_key}&language=fr-FR&page=1'

    def get_actions(self):
        return [
            {"name": "popular_movies", "description": "Get a list of popular movies."}, 
            {"name": "upcoming_releases", "description": "Get a list of upcoming movie releases."}, 
            {"name": "top_rated", "description": "Get a list of top-rated movies."}, 
            {"name": "now_playing", "description": "Get a list of movies currently playing in theaters."},
            {"name": "latest_movie", "description": "Get information about the latest movie."}
        ]

    def get_reactions(self):
        return [
            {"name": "email", "description": "Envoie un email"}
        ]

    def check_action(self, user, action, params=None):
        # Vérifie si l'action est disponible
        available_actions = [action["name"] for action in self.get_actions()]
        if action not in available_actions:
            print(f"Action non disponible: {action}")
            return False
        
        if action == "popular_movies":
            full_url = self.base_url + "popular" + self.end_url
        elif action == "upcoming_releases":
            full_url = self.base_url + "upcoming" + self.end_url
        elif action == "top_rated":
            full_url = self.base_url + "top_rated" + self.end_url
        elif action == "now_playing":
            full_url = self.base_url + "now_playing" + self.end_url
        elif action == "latest_movie":
            full_url = self.base_url + "latest" + self.end_url


        response = requests.get(full_url)

        if response.status_code != 200:
            print(f"Erreur TMDB: {response.text}")
            return False


        return True

    
    def execute_reaction(self, user, reaction, params=None, data=None):
        # TMDB service does not have reactions
        """Exécute la réaction pour l'utilisateur donné."""
        if reaction == "send_email":
            print(f"[EMAIL] Alerte envoyée à {user.email} (simulation)")
        else:
            print(f"Réaction inconnue: {reaction}")