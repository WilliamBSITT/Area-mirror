import base_service
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import re

class GmailService(base_service.BaseService):
    name = "gmail"

    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.email_address = "sender_email@gmail.com"  # le mail du sender
        self.email_password = 'your_app_password' # le mot de passe de l'application
        self.email_recver = 'receiver_email@gmail.com'  # le mail du receiver
        self.subject = "Notification from Area"
        self.content = "This is a notification from Area service."
        pass

    def validate_email(email):
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        return re.match(email_regex, email) is not None
    
    def create_email(self, to_address, subject, content):
        msg = MIMEMultipart()
        msg['From'] = self.email_address
        msg['To'] = to_address
        msg['Subject'] = subject
        msg.attach(MIMEText(content, 'plain'))
        return msg
    
    def send_email(self, msg, to_address):
        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email_address, self.email_password)
            server.sendmail(self.email_address, to_address, msg.as_string())
            server.quit()
        except Exception as e:
            print(f'Error sending email to {to_address}: {str(e)}')

    def get_actions(self):
        return []

    def get_reactions(self):
        return [
            {"name": "send_email", "description": "Envoie un email"}
        ]

    def check_action(self, user, action, params=None):
        # Gmail service does not have actions
        raise NotImplementedError("gmail service does not support actions.")

    def execute_reaction(self, user, reaction, params=None, data=None):
        if reaction == "send_email":
            if self.validate_email(self.email_recver):
                msg = self.create_email(self.email_recver, self.subject, self.content)
                self.send_email(msg, self.email_recver)
                return True
            else:
                print(f"Adresse email invalide: {self.email_recver}")
                return False
        else:
            print(f"Réaction inconnue: {reaction}")
            return False