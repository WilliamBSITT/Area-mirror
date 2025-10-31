import os
from extensions import db
import sys
import binascii

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    image = db.Column(db.LargeBinary(length=(2**24)-1), nullable=True)  # Specify max length for binary data
    auth_url = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {"id": self.id, "name": self.name.lower(), "description": self.description, "image": binascii.b2a_base64(self.image).decode('utf-8') if self.image else None}

def image_to_binary(filename):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, 'logo', f'{filename}.png')

    try:
        with open(file_path, 'rb') as file:
            image_data = file.read()
        return image_data
    except FileNotFoundError:
        return None

# Fonction utilitaire pour remplir la base avec des services
def seed_services():
    services = [
        {
            "name": "Spotify",
            "description": "Spotify is a digital music platform where you can stream millions of songs and podcasts. It lets you create and share playlists for any mood or moment. Discover new artists and listen to your favorite albums anytime, anywhere. You can connect with friends and see what they’re listening to. Perfect for anyone who loves music and wants instant access to it.",
            "image": image_to_binary("spotify"),
            "auth_url": "http://127.0.0.1:8080/spotify/login"
        },
        {
            "name": "OpenWeather",
            "description": "OpenWeather provides accurate weather data and forecasts for any location in the world. It offers real-time updates on temperature, wind, and precipitation. You can use it to check daily forecasts or monitor severe weather alerts. Its data helps apps and devices react to changing weather conditions. Ideal for staying informed about the environment around you.",
            "image": image_to_binary("open_weather"),
        },
        {
            "name": "GitHub",
            "description": "GitHub is a platform where developers store and share their code online. It allows teams to collaborate on software projects from anywhere. You can track changes, review contributions, and manage updates easily. Developers use it to build, test, and improve their applications together. It’s the world’s largest community for open-source and coding projects.",
            "image": image_to_binary("github"),
            "auth_url": "http://127.0.0.1:8080/git/login",
        },
        {
            "name": "NASA",
            "description": "NASA is the United States’ space agency focused on exploring space and science. It studies Earth, the solar system, and the universe beyond. You can access daily astronomy pictures, data, and mission updates. NASA shares incredible images from telescopes and space missions. It inspires curiosity and expands our understanding of the cosmos.",
            "image": image_to_binary("nasa"),
        },
        {
            "name": "Discord",
            "description": "Discord is a communication app built for communities and friends. You can chat via text, voice, or video in customizable servers. It’s popular among gamers, creators, and groups of all kinds. You can organize conversations into channels and share media easily. A great way to stay connected with people who share your interests.",
            "image": image_to_binary("discord"),
            "auth_url": "https://discord.com/oauth2/authorize?client_id=1192094310749970472"
        },
        {
            "name": "Gmail",
            "description": "Gmail is Google’s email service used by millions worldwide. It offers fast, secure, and easy-to-use email communication. You can organize your inbox, filter messages, and search efficiently. Integrated with other Google services, it keeps everything connected. A reliable platform for personal and professional communication.",
            "image": image_to_binary("gmail"),
            "auth_url": "https://support.google.com/mail/answer/185833?hl=fr"
        },
        {
            "name": "TMDB",
            "description": "TMDB (The Movie Database) is a community-driven platform that provides detailed information about movies and TV shows. You can discover popular films, upcoming releases, and top-rated content. It offers rich metadata, including cast, crew, reviews, and trailers. Perfect for movie enthusiasts looking to explore and stay updated on entertainment.",
            "image": image_to_binary("movie_db"),
        },
        {
            "name": "Notifications",
            "description": "Service permettant d'envoyer des notifications push aux applications mobiles connectées.",
            "image": image_to_binary("android"),
        }
    ]
    for s in services:
        if not Service.query.filter_by(name=s["name"]).first():
            service = Service(name=s["name"], description=s["description"], image=s["image"], auth_url=s.get("auth_url"))
            db.session.add(service)
    db.session.commit()

