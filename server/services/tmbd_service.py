from .base_service import BaseService
import requests
import os

class TMDBService(BaseService):
    name = "tmdb"

    def __init__(self):
        self.api_key = os.getenv("TMDB_API_KEY")
        if not self.api_key:
            raise ValueError("API_KEY not set")
        
        self.base_url = "https://api.themoviedb.org/3/movie/"
        self.end_url = f"?api_key={self.api_key}&language=fr-FR&page=1"
        
    def get_actions(self):
        return [
            {"name": "popular_movies", "description": "Get a list of popular movies."},
            {"name": "upcoming_releases", "description": "Get a list of upcoming movie releases."},
            {"name": "top_rated", "description": "Get a list of top-rated movies."},
            {"name": "now_playing", "description": "Get a list of movies currently playing in theaters."},
            {"name": "latest_movie", "description": "Get information about the latest movie."}
        ]
        
    def get_reactions(self):
        return []
    
    def _fetch(self, endpoint):
        url = self.base_url + endpoint + self.end_url
        resp = requests.get(url)
        if resp.status_code != 200:
            print(f"[TMDB] Erreur: {resp.text}")
            return None
        return resp.json()
    
    def check_action(self, user, action, params=None):
        mapping = {
            "popular_movies": "popular",
            "upcoming_releases": "upcoming",
            "top_rated": "top_rated",
            "now_playing": "now_playing",
            "latest_movie": "latest"
        }

        if action not in mapping:
            print(f"[TMDB] Action inconnue: {action}")
            return None

        data = self._fetch(mapping[action])
        if not data:
            return None

        # Si c’est le dernier film (unique)
        if action == "latest_movie":
            title = data.get("title")
            release = data.get("release_date")
            formatted = f"Dernier film : {title} (sorti le {release})"
            return {"movies": formatted}

        # Sinon → liste de films
        movies = []
        for m in data.get("results", [])[:10]:
            title = m.get("title")
            release = m.get("release_date")
            rating = m.get("vote_average")
            movies.append(f"{title} ({release}) - ⭐ {rating}")

        formatted_list = "\n".join(movies)
        return {"movies": formatted_list}


    def execute_reaction(self, user, reaction, params=None, data=None):
        pass