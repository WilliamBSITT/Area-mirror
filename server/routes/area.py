from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from core import area_manager
from models.area import Area
from extensions import db

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
            name:
              type: string
              example: "Météo to Discord"
            frequency:
              type: integer
              example: 3600
            action_service:
              type: string
              example: "openweather"
            action:
              type: string
              example: "get_weather"
            reaction_service:
              type: string
              example: "discord"
            reaction:
              type: string
              example: "send_message"
            params:
              type: object
              example: { "city": "Nancy", "message": "🌦️ Météo {city} : {temp}°C, {desc}", "channel_id": "1424684119471689759" }
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
        data.get("action_service").lower(),
        data.get("action"),
        data.get("reaction_service").lower(),
        data.get("reaction"),
        params=data.get("params", {}),
        enabled=data.get("enabled", True),
        name=data.get("name", "My AREA"),
        frequency=data.get("frequency", 3600),
    )

    if err:
        return jsonify({"error": err}), 400

    return jsonify({
        "name": area.name,
        "id": area.id,
        "action_service": area.action_service,
        "action": area.action,
        "reaction_service": area.reaction_service,
        "reaction": area.reaction,
        "params": area.params,
        "enabled": area.enabled,
        "frequency": int(area.frequency),
    }), 201

@bp.route("/<int:area_id>", methods=["GET"])
@jwt_required()
def get_area(area_id):
    """
    Récupère une area spécifique de l’utilisateur connecté
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
    responses:
      200:
        description: Détails de l'AREA
      400:
        description: area_id est requis
      404:
        description: AREA introuvable
    """
    user_id = get_jwt_identity()
    areas = area_manager.list_areas(user_id)
    result = [a for a in areas if a.id == area_id]

    if result == []:
        return jsonify({"error": "AREA introuvable"}), 404

    return jsonify({
          "id": result[0].id,
          "name": result[0].name,
          "action_service": result[0].action_service,
          "action": result[0].action,
          "reaction_service": result[0].reaction_service,
          "reaction": result[0].reaction,
          "frequency": result[0].frequency,
          "params": result[0].params,
          "last_run": result[0].last_run.isoformat() if result[0].last_run else None,
          "enabled": result[0].enabled
        })

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
            "name": a.name,
            "action_service": a.action_service,
            "reaction_service": a.reaction_service,
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


@bp.route("/<int:area_id>", methods=["PUT"])
@jwt_required()
def update_area(area_id):
  """
    Met à jour un AREA
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
        description: ID de l’AREA à mettre à jour
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            enabled:
              type: boolean
              example: true
            name:
              type: string
              example: "Météo to Discord"
            action_service:
              type: string
              example: "openweather"
            action:
              type: string
              example: "get_weather"
            reaction_service:
              type: string
              example: "discord"
            reaction:
              type: string
              example: "send_message"
            params:
              type: object
              example: { "city": "Nancy", "message": "🌦️ Météo" }
    responses:
      200:
        description: AREA mis à jour
      404:
        description: AREA introuvable
    """
  area = Area.query.get_or_404(area_id)
  data = request.get_json()

  if "enabled" in data:
    area.enabled = data["enabled"]
  if "name" in data:
    area.name = data["name"]
  if "action_service" in data:
    area.action_service = data["action_service"].lower()
  if "action" in data:
    area.action = data["action"]
  if "reaction_service" in data:
    area.reaction_service = data["reaction_service"].lower()
  if "reaction" in data:
    area.reaction = data["reaction"]
  if "params" in data:
    area.params = data["params"]

  db.session.commit()
  return jsonify("success"), 200