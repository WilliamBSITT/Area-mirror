from .weather_service import OpenWeatherService
from .discord_service import DiscordService

registered_services = [
    OpenWeatherService(),
    DiscordService()
]

def get_all_services():
    return registered_services