from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from core import area_manager

bp = Blueprint("areas", __name__, url_prefix="/areas")

    
@bp.route("", methods=["POST"])
@jwt_required()
def create_area():
    """
    Crée un nouvel AREA
    ---
    tags:
      - Areas
    security:
      - BearerAuth: []
    consumes:
      - application/json
    parameters:
      - in: header
        name: Authorization
        type: string
        required: true
        description: "JWT token au format: Bearer <access_token>"
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            service:
              type: string
              example: "openweather"
            action:
              type: string
              example: "get_weather"
            reaction:
              type: string
              example: "send_message"
            params:
              type: object
              example: { "city": "Paris", "message": "🌦️ Météo {city} : {temp}°C, {desc}" }
    responses:
      201:
        description: AREA créé avec succès
      400:
        description: Erreur de validation
    """
    user_id = int(get_jwt_identity())
    data = request.get_json()

    area, err = area_manager.create_area(
        user_id,
        data.get("action_service"),
        data.get("action"),
        data.get("reaction_service"),
        data.get("reaction"),
        params=data.get("params", {})
    )

    if err:
        return jsonify({"error": err}), 400

    return jsonify({
        "id": area.id,
        "action_service": area.action_service,
        "action": area.action,
        "reaction_service": area.reaction_service,
        "reaction": area.reaction,
        "params": area.params,
        "enabled": area.enabled
    }), 201



@bp.route("", methods=["GET"])
@jwt_required()
def list_areas():
    """
    Liste les AREAs de l’utilisateur connecté
    ---
    tags:
      - Areas
    security:
      - BearerAuth: []
    parameters:
      - in: header
        name: Authorization
        type: string
        required: true
        description: "JWT token au format: Bearer <access_token>"
    responses:
      200:
        description: Liste des AREAs
    """
    user_id = get_jwt_identity()
    areas = area_manager.list_areas(user_id)

    return jsonify([
        {
            "id": a.id,
            "service": a.service,
            "action": a.action,
            "reaction": a.reaction,
            "params": a.params,
            "enabled": a.enabled
        } for a in areas
    ])


@bp.route("/<int:area_id>", methods=["DELETE"])
@jwt_required()
def delete_area(area_id):
    """
    Supprime un AREA
    ---
    tags:
      - Areas
    security:
      - BearerAuth: []
    parameters:
      - in: header
        name: Authorization
        type: string
        required: true
        description: "JWT token au format: Bearer <access_token>"
      - in: path
        name: area_id
        type: integer
        required: true
        description: ID de l’AREA à supprimer
    responses:
      200:
        description: AREA supprimé
      404:
        description: AREA introuvable
    """
    user_id = get_jwt_identity()
    ok, err = area_manager.delete_area(area_id, user_id=user_id)
    if not ok:
        return jsonify({"error": err}), 404
    return jsonify({"status": "deleted"}), 200


@bp.route("/<int:area_id>/toggle", methods=["PATCH"])
@jwt_required()
def toggle_area(area_id):
    """
    Active/désactive un AREA
    ---
    tags:
      - Areas
    security:
      - BearerAuth: []
    consumes:
      - application/json
    parameters:
      - in: header
        name: Authorization
        type: string
        required: true
        description: "JWT token au format: Bearer <access_token>"
      - in: path
        name: area_id
        type: integer
        required: true
        description: ID de l’AREA à activer/désactiver
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            enabled:
              type: boolean
              example: true
    responses:
      200:
        description: AREA mis à jour
      404:
        description: AREA introuvable
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    enabled = data.get("enabled", True)

    area, err = area_manager.toggle_area(area_id, enabled=enabled, user_id=user_id)
    if not area:
        return jsonify({"error": err}), 404

    return jsonify({
        "id": area.id,
        "enabled": area.enabled
    }), 200