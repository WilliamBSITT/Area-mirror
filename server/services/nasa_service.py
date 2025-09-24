import base_service
import requests
import os

class NasaService(base_service.BaseService):
    name = "nasa"

    def __init__(self):
        self.API_key = os.getenv("NASA_API_KEY")
        if not self.API_key:
            raise ValueError("NASA_API_KEY not set in environment variables")
        self.base_url = f'https://api.nasa.gov/planetary/apod?api_key={self.API_key}'

    def get_actions(self):
        return [
            {"name": "image of the day", "description": "Get the NASA image of the day."}
        ]

    def get_reactions(self):
        return []

    def check_action(self, user, action):
        # Implement logic to check for new movie releases
        available_actions = [action["name"] for action in self.get_actions()]
        if action not in available_actions:
            print(f"Action non disponible: {action}")
            return False
        
        if action == "image of the day":
            full_url = self.base_url

        
        response = requests.get(full_url)
        if response.status_code != 200:
            print(f"Erreur NASA: {response.text}")
            return False
        return True

    def execute_reaction(self, user, reaction, data):
        # NASA service does not have reactions
        raise NotImplementedError("nasa service does not support reactions.")