from .base_service import BaseService
import requests
from datetime import datetime, timedelta, timezone
import os

class OpenWeatherService(BaseService):
    name = "openweather"
    
    def __init__(self):
        self.api_key = os.getenv("OPENWEATHER_API_KEY")
        self.base_url = "https://api.openweathermap.org/data/2.5/weather"

        
    def get_actions(self):
        return [
            {"name": "get_weather", "description": "Récupérer la météo d'une ville"}
        ]
        
    def get_reactions(self):
        return []
    
    def check_action(self, user, action, params=None):
        if action != "get_weather":
            return None

        interval = 3600

        last = params.get("last_triggered_at")
        if last:
            if isinstance(last, str):
                last = datetime.fromisoformat(last)

            if datetime.now(timezone.utc) - last < timedelta(seconds=interval):
                return None

        city = (params or {}).get("city", "Paris")
        weather = self.fetch_weather(city)
        if not weather:
            return None

        params["last_triggered_at"] = datetime.now(timezone.utc).isoformat()

        return {
            "city": city,
            "temp": weather["main"]["temp"],
            "desc": weather["weather"][0]["description"]
        }
    
    def execute_reaction(self, user, reaction, params=None, data=None):
        pass

    def fetch_weather(self, city):
        resp = requests.get(self.base_url, params={
            "q": city,
            "appid": self.api_key,
            "units": "metric",
            "lang": "fr"
        })
        if resp.status_code != 200:
            return None
        return resp.json()
    
    def get_actions_params(self, action_name):
        if action_name == "get_weather":
            return [
                {"name": "city", "type": "String", "required": False, "description": "Nom de la ville pour la météo (défaut: Paris)"}
            ]
        return []

    def get_reactions_params(self, reaction_name):
        return []
    
    def get_actions_outputs(self, action_name):
        if action_name == "get_weather":
            return [
                {"name": "{temp}", "type": "String", "description": "Le temperature"},
                {"name": "{desc}", "type": "String", "description": "Etat du temps"},
                {"name": "{city}", "type": "String", "description": "La ville"},
            ]
        return []
