from .users import bp as users_bp
from .github import bp as github_bp

def register_routes(app):
    app.register_blueprint(users_bp)
    app.register_blueprint(github_bp, url_prefix="/github")