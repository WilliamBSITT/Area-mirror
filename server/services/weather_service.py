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

        # intervalle minimal entre deux envois
        interval = 3600  # 1 heure

        last = params.get("last_triggered_at")
        if last:
            # Si c’est stocké en string (JSON), il faut parser
            if isinstance(last, str):
                last = datetime.fromisoformat(last)

            # comparaison avec maintenant (UTC aware)
            if datetime.now(timezone.utc) - last < timedelta(seconds=interval):
                return None  # trop tôt → pas de trigger

        city = (params or {}).get("city", "Paris")
        weather = self.fetch_weather(city)
        if not weather:
            return None

        # mise à jour du dernier trigger (ISO string pour stockage JSON)
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
