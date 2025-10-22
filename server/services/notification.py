from .base_service import BaseService
from exponent_server_sdk import (
    PushClient,
    PushMessage,
    PushServerError,
    DeviceNotRegisteredError,
    InvalidCredentialsError,
)
from requests.exceptions import ConnectionError, HTTPError
from models.user import User

class NotificationService(BaseService):
    name = "notification"

    def __init__(self):
        pass
    
    def get_actions(self):
        return [
        ]

    def get_reactions(self):
        return [
            {"name": "send_notification", "description": "Envoyer une notification push à l'utilisateur."}
        ]

    def check_reaction(self, user, reaction, params=None):
        message = params.get("message", "Hello from AREA!")
        title = params.get("title", "AREA Notification")
        expo_push_token = User.query.filter_by(id=user.id).first().expo_push_token

        available_reactions = [r["name"] for r in self.get_reactions()]
        if reaction not in available_reactions:
            print(f"Reaction non disponible: {reaction}")
            return None
        
        if reaction == "send_notification":
            # print(f"Envoi de la notification à l'utilisateur {user.id}")
            try:
                response = PushClient().publish(
                    PushMessage(
                        to=expo_push_token,
                        title=title,
                        body=message,
                        sound="default",
                    )
                )
                print("Push notification sent:", response)
            except PushServerError as exc:
                print("Push server error:", exc)
            except (ConnectionError, HTTPError) as exc:
                print("Connection error:", exc)
            except DeviceNotRegisteredError:
                print("Device not registered, removing token")
            except InvalidCredentialsError:
                print("Invalid Expo credentials")
            return True

        return None