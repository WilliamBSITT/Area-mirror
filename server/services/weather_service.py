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

        params = params or {}
        city = params.get("city", "Paris")
        weather = self.fetch_weather(city)

        if not weather:
            print(f"[OpenWeatherService] Failed to fetch weather for city: {city}")
            return None
        
        return {
            "city": city,
            "temp": weather["main"]["temp"],
            "desc": weather["weather"][0]["description"]
        }
    
    
    def execute_reaction(self, user, reaction, params=None, data=None):
        pass

    def fetch_weather(self, city):
        if not self.api_key:
            raise ValueError("OPENWEATHER_API_KEY manquant dans le .env")

        resp = requests.get(self.base_url, params={
            "q": city,
            "appid": self.api_key,
            "units": "metric",
            "lang": "fr"
        })

        if resp.status_code != 200:
            print(f"[OpenWeatherService] API error: {resp.text}")
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
