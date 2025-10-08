from .nasa_service import NasaService
from .weather_service import OpenWeatherService
from .discord_service import DiscordService
from .tmbd_service import TMDBService
from .gmail_service import GmailService
from .spotify_service import SpotifyService

registered_services = [
    OpenWeatherService(),
    DiscordService(),
    TMDBService(),
    GmailService(),
    SpotifyService(),
    NasaService(),
]

def get_all_services():
    return registered_services