from .nasa_service import NasaService
from .weather_service import OpenWeatherService
from .discord_service import DiscordService
from .tmbd_service import TMDBService
from .gmail_service import GmailService
from .spotify_service import SpotifyService
from .github_service import GithubService
from .notification_service import NotificationService

registered_services = [
    OpenWeatherService(),
    DiscordService(),
    TMDBService(),
    GmailService(),
    SpotifyService(),
    NasaService(),
    GithubService(),
    NotificationService()
]

def get_all_services():
    return registered_services