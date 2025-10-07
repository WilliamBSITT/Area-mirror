from .users import bp as users_bp
from .github import bp as github_bp
from .area import bp as area_bp
from .auth import bp as auth_bp
from .about_json import bp as json_bp
from .service import bp as service_bp
from .spotify import bp as spotify_bp

def register_routes(app):
    app.register_blueprint(users_bp)
    app.register_blueprint(github_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(service_bp)
    app.register_blueprint(area_bp)
    app.register_blueprint(json_bp)
    app.register_blueprint(spotify_bp)