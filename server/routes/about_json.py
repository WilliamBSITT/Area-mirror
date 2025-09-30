from flask import Blueprint, jsonify
from services import get_all_services

bp = Blueprint("about", __name__)

@bp.route("/about.json", methods=["GET"])
def about():
    """
    Obtenir les informations du serveur et la liste des services disponibles
    ---
    tags:
      - About
    responses:
      200:
        description: Informations serveur et services/actions/réactions
        schema:
          type: object
          properties:
            client:
              type: object
              properties:
                host:
                  type: string
                  example: "localhost:8080"
            server:
              type: object
              properties:
                current_time:
                  type: number
                  example: 1698655273
                services:
                  type: array
                  items:
                    type: object
                    properties:
                      name:
                        type: string
                        example: "discord"
                      actions:
                        type: array
                        items:
                          type: object
                          properties:
                            name:
                              type: string
                              example: "get_weather"
                            description:
                              type: string
                              example: "Récupérer la météo d'une ville"
                      reactions:
                        type: array
                        items:
                          type: object
                          properties:
                            name:
                              type: string
                              example: "send_message"
                            description:
                              type: string
                              example: "Envoyer un message Discord"
    """
    services = []
    for service in get_all_services():
        services.append({
            "name": service.name,
            "actions": service.get_actions(),
            "reactions": service.get_reactions()
        })
        
    return jsonify({
        "client": {
            "host": "localhost:8081"
        },
        "server": {
            "current_time": __import__("time").time(),
            "services": services
        }
    })