from .auth import bp as auth_bp
from .github import bp as github_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(github_bp, url_prefix="/github")