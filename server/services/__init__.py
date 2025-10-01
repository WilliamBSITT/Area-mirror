from .timer_service import TimerService
from .weather_service import WeatherService

registered_services = [
    TimerService(),
    WeatherService(),
]

def get_all_services():
    return registered_services