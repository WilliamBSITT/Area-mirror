from .weather_service import OpenWeatherService
from .discord_service import DiscordService
from .tmbd_service import TMDBService
from .gmail_service import GmailService

registered_services = [
    OpenWeatherService(),
    DiscordService(),
    TMDBService(),
    GmailService(),
]

def get_all_services():
    return registered_services