from extensions import db

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    image = db.Column(db.LargeBinary, nullable=True)  # Pour stocker l'image en binaire

# Fonction utilitaire pour remplir la base avec des services
def seed_services():
    services = [
        {
            "name": "Spotify",
            "description": "Music streaming service",
            "image": None,
        },
        {
            "name": "OpenWeather",
            "description": "Weather data provider",
            "image": None,
        },
        {
            "name": "GitHub",
            "description": "Code hosting platform",
            "image": None,
        },
        {
            "name": "Strava",
            "description": "Fitness tracking platform",
            "image": None,
        },
        {
            "name": "NASA",
            "description": "Space and science data",
            "image": None,
        },
        {
            "name": "Microsoft",
            "description": "Microsoft services integration",
            "image": None,
        },
        {
            "name": "OpenAI",
            "description": "AI and language models",
            "image": None,
        },
    ]
    for s in services:
        if not Service.query.filter_by(name=s["name"]).first():
            service = Service(name=s["name"], description=s["description"], image=s["image"])
            db.session.add(service)
    db.session.commit()

