from flask import Blueprint, request, jsonify, redirect
from extensions import db
from services import get_all_services
from models.service import Service
from flask import Response
import json
from collections import OrderedDict

bp = Blueprint("services", __name__, url_prefix="/services")

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
    

@bp.route("/<string:service_name>", methods=["GET"])
def service_fetch_by_name(service_name):
    """
    Récupère un service par son nom
    ---
    tags:
      - Service
    parameters:
      - name: service_name
        in: path
        type: string
        required: true
        description: Nom du service
    responses:
        200:
            description: Service récupéré avec succès
        404:
            description: Service non trouvé
        500:
            description: Erreur interne du serveur
    """
    try:
        services = {s.name: s for s in get_all_services()}
        service = services.get(service_name)

        if not service:
            return jsonify({"error": "Service not found"}), 404

        # On impose l’ordre des clés
        data = OrderedDict([
            ("name", service.name),
            ("actions", service.get_actions()),
            ("reactions", service.get_reactions()),
        ])

        return Response(
            json.dumps(data, ensure_ascii=False, indent=2),
            mimetype="application/json"
        ), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500