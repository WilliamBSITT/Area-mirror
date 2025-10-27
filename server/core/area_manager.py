from extensions import db
from models.area import Area
from models.user import User
from services import get_all_services

def _get_services_map():
    """Retourne un dict { service_name: service_instance }"""
    return {s.name: s for s in get_all_services()}


def create_area(user_id, actions, reactions, params=None, enabled=True, name="My AREA", frequency=3600, public=False):
    """Crée un AREA avec plusieurs actions et réactions."""
    user = User.query.get(user_id)
    if not user:
        return None, "Utilisateur introuvable"

    services = _get_services_map()


    for action in actions:
        srv_name = action.get("service")
        action_name = action.get("name")
        srv = services.get(srv_name)

        if not srv:
            return None, f"Service d’action inconnu : {srv_name}"
        allowed_actions = {a["name"] for a in srv.get_actions()}
        if action_name not in allowed_actions:
            return None, f"Action '{action_name}' invalide pour {srv_name}"


    for reaction in reactions:
        srv_name = reaction.get("service")
        reaction_name = reaction.get("name")
        srv = services.get(srv_name)

        if not srv:
            return None, f"Service de réaction inconnu : {srv_name}"
        allowed_reactions = {r["name"] for r in srv.get_reactions()}
        if reaction_name not in allowed_reactions:
            return None, f"Réaction '{reaction_name}' invalide pour {srv_name}"


    area = Area(
        name=name,
        user_id=user_id,
        actions=actions,
        reactions=reactions,
        enabled=enabled,
        frequency=frequency,
        public=public,
        params=params or {}
    )

    db.session.add(area)
    db.session.commit()
    return area, None


def delete_area(area_id, user_id=None):
    q = Area.query.filter_by(id=area_id)
    if user_id:
        q = q.filter_by(user_id=user_id)
    area = q.first()
    if not area:
        return False, "AREA introuvable"
    db.session.delete(area)
    db.session.commit()
    return True, None


def toggle_area(area_id, enabled=True, user_id=None):
    q = Area.query.filter_by(id=area_id)
    if user_id:
        q = q.filter_by(user_id=user_id)
    area = q.first()
    if not area:
        return None, "AREA introuvable"
    area.enabled = enabled
    db.session.commit()
    return area, None


def list_areas(user_id=None):
    q = Area.query
    if user_id:
        q = q.filter_by(user_id=user_id)
    return q.all()

