from flask import Blueprint, request, jsonify, redirect
from extensions import db
from models.service import Service

bp = Blueprint("service", __name__, url_prefix="/service")

@bp.route("/", methods=["GET"])
def service_fetch():
    """
    Récupère tous les services disponibles
    ---
    tags:
      - Service
    responses:
        200:
            description: Services récupérés avec succès
        500:
            description: Erreur interne du serveur
    """
    try:
        service = Service.query.all()
        return jsonify([u.to_dict() for u in service]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500