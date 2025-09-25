import os
from extensions import db
import sys
import binascii

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    image = db.Column(db.LargeBinary(length=(2**24)-1), nullable=True)  # Specify max length for binary data

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
            "description": "Music streaming service",
            "image": image_to_binary("spotify"),
        },
        {
            "name": "OpenWeather",
            "description": "Weather data provider",
            "image": image_to_binary("open_weather"),
        },
        {
            "name": "GitHub",
            "description": "Code hosting platform",
            "image": image_to_binary("github"),
        },
        {
            "name": "Strava",
            "description": "Fitness tracking platform",
            "image": image_to_binary("strava"),
        },
        {
            "name": "NASA",
            "description": "Space and science data",
            "image": image_to_binary("nasa"),
        },
    ]
    for s in services:
        if not Service.query.filter_by(name=s["name"]).first():
            service = Service(name=s["name"], description=s["description"], image=s["image"])
            db.session.add(service)
    db.session.commit()

