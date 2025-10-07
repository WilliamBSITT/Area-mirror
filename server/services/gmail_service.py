from .base_service import BaseService
from utils.crypto_manager import crypto
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import re
import os


class GmailService(BaseService):
    name = "gmail"
    
    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        
    def validate_email(self, email):
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        return re.match(email_regex, email) is not None
    
    def create_email(self, from_address, to_address, subject, content):
        msg = MIMEMultipart()
        
        msg['From'] = from_address
        msg['To'] = to_address
        msg['Subject'] = subject
        msg.attach(MIMEText(content, 'plain'))
        
        return msg
    
    def send_email(self, from_address, password, to_address, msg):
        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(from_address, password)
            server.sendmail(from_address, to_address, msg.as_string())
            server.quit()
            return True
        except:
            print(f'Error sending email to {to_address}: {str(e)}')
            return False
        
    
    def get_actions(self):
        return []

    def get_reactions(self):
        return [
            {"name": "send_email", "description": "Envoie un email"}
        ]

    def check_action(self, user, action, params=None):
        raise NotImplementedError("gmail service does not support actions.")

    def execute_reaction(self, user, reaction, params=None, data=None):
        if reaction == "send_email":
            from_address = params.get("from")
            password_enc = params.get("password")
            to_address = params.get("to")
            subject = params.get("subject", "Notification from Area")
            content_template = params.get("content", "This is a notification from Area service.")

            if not (from_address and password_enc and to_address):
                print("[GmailService] Paramètres manquants")
                return False

            try:
                password = crypto.decrypt(password_enc)
            except Exception as e:
                print(f"[GmailService] Erreur de déchiffrement: {e}")
                return False

            if not self.validate_email(to_address):
                print(f"[GmailService] Adresse email invalide: {to_address}")
                return False

            # On fusionne params + data pour le formattage
            context = {}
            if params:
                context.update(params)
            if data:
                context.update(data)

            try:
                content = content_template.format(**context)
            except KeyError as e:
                print(f"[GmailService] Variable manquante dans le message : {e}")
                content = content_template

            msg = self.create_email(from_address, to_address, subject, content)
            return self.send_email(from_address, password, to_address, msg)

        else:
            print(f"[GmailService] Réaction inconnue: {reaction}")
            return False

    def get_reactions_params(self, reaction_name):
        if reaction_name == "new_email":
            return [
                {"name": "from", "type": "string", "required": True, "description": "Adresse email du sender"},
                {"name": "password", "type": "string", "required": True, "description": "Mot de passe de l'email (chiffré)"},
                {"name": "to", "type": "string", "required": False, "description": "Sujet doit contenir"},
                {"name": "subject", "type": "string", "required": False, "description": "Corps doit contenir"},
                {"name": "content", "type": "string", "required": False, "description": "Contenu de l'email, supporte le formatage avec {var}"},
            ]
        
    def get_actions_params(self, action_name):
        return []