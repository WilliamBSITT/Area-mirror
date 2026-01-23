from .base_service import BaseService
import requests
import os

class NasaService(BaseService):
    name = "nasa"

    def __init__(self):
        self.API_key = os.getenv("NASA_API_KEY")
        if not self.API_key:
            raise ValueError("NASA_API_KEY not set in environment variables")
        self.base_url = f'https://api.nasa.gov/planetary/apod?api_key={self.API_key}'

    def get_actions(self):
        return [
            {"name": "image_of_the_day", "description": "Get the NASA image of the day."}
        ]

    def get_reactions(self):
        return []

    def check_action(self, user, action):
        # Implement logic to check for new movie releases
        available_actions = [action["name"] for action in self.get_actions()]
        if action not in available_actions:
            print(f"Action non disponible: {action}")
            return None
        
        if action == "image of the day":
            full_url = self.base_url

        
        response = requests.get(full_url)
        if response.status_code != 200:
            print(f"Erreur NASA: {response.text}")
            return None

        return {
            "title": response.json().get("title"),
            "explanation": response.json().get("explanation"),
            "image_url": response.json().get("url")
        }

    def get_actions_output(self, action_name):
        return [
            {"name": "title", "type": "string", "description": "Title of the image" },
            {"name": "explanation", "type": "string", "description": "Explanation of the image" },
            {"name": "image_url", "type": "string", "description": "URL of the image" }
        ]