from .users import bp as users_bp
from .github import bp as github_bp
from .area import bp as area_bp
from .auth import bp as auth_bp

def register_routes(app):
    app.register_blueprint(users_bp)
    app.register_blueprint(github_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(area_bp)