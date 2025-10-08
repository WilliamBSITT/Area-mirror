from flask import Blueprint, request, jsonify, redirect
from extensions import db
from services import get_all_services
from models.service import Service
from flask import Response
import json
from collections import OrderedDict
import binascii

bp = Blueprint("services", __name__, url_prefix="/services")

@bp.route("/<string:service_name>/reactions/<string:reaction_name>/params", methods=["GET"])
def find_reactions(service_name, reaction_name):
    """
    Retourne les paramètres requis pour une réaction donnée
    ---
    tags:
      - Service
    parameters:
      - name: service_name
        in: path
        type: string
        required: true
        description: Nom du service
      - name: reaction_name
        in: path
        type: string
        required: true
        description: Nom de la réaction
    responses:
      200:
        description: Liste des paramètres requis
      404:
        description: Service non trouvé
      500:
        description: Erreur interne du serveur
    """
    services = {s.name: s for s in get_all_services()}
    service = services.get(service_name.lower())

    if not service:
        return jsonify({"error": "Service not found"}), 404
    try:
        params = service.get_reactions_params(reaction_name)
        return jsonify({
            "service": service_name,
            "reaction": reaction_name,
            "params": params
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route("/<string:service_name>/actions/<string:action_name>/params", methods=["GET"])
def find_actions(service_name, action_name):
    """
    Retourne les paramètres requis pour une action donnée
    ---
    tags:
      - Service
    parameters:
      - name: service_name
        in: path
        type: string
        required: true
        description: Nom du service
      - name: action_name
        in: path
        type: string
        required: true
        description: Nom de l'action
    responses:
      200:
        description: Liste des paramètres requis
      404:
        description: Service non trouvé
      500:
        description: Erreur interne du serveur
    """
    services = {s.name: s for s in get_all_services()}
    service = services.get(service_name.lower())

    if not service:
        return jsonify({"error": "Service not found"}), 404
    
    try:
        params = service.get_actions_params(action_name)
        return jsonify({
            "service": service_name,
            "action": action_name,
            "params": params
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@bp.route("/<string:service_name>/actions/<string:action_name>/outputs", methods=["GET"])
def find_actions_outputs(service_name, action_name):
    """
    Retourne les paramètres que renvoie le service pour une action donnée
    ---
    tags:
      - Service
    parameters:
      - name: service_name
        in: path
        type: string
        required: true
        description: Nom du service
      - name: action_name
        in: path
        type: string
        required: true
        description: Nom de l'action
    responses:
      200:
        description: Liste des paramètres requis
      404:
        description: Service non trouvé
      500:
        description: Erreur interne du serveur
    """
    services = {s.name: s for s in get_all_services()}
    service = services.get(service_name.lower())

    if not service:
        return jsonify({"error": "Service not found"}), 404
    
    try:
        outputs = service.get_actions_outputs(action_name)
        return jsonify({
            "service": service_name,
            "action": action_name,
            "outputs": outputs
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        service_name = service_name.lower()
        services = {s.name: s for s in get_all_services()}
        service = services.get(service_name)

        if not service:
            return jsonify({"error": "Service not found"}), 404

        service_details = Service.query.with_entities(Service.description, Service.image, Service.auth_url).filter_by(name=service_name).first()
        # On impose l’ordre des clés
        data = OrderedDict([
            ("name", service.name),
            ("actions", service.get_actions()),
            ("reactions", service.get_reactions()),
            ("description", service_details.description),
            ("image", binascii.b2a_base64(service_details.image).decode('utf-8') if service_details.image else None),
            ("auth_url", service_details.auth_url)
        ])

        return Response(
            json.dumps(data, ensure_ascii=False, indent=2),
            mimetype="application/json"
        ), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500