from extensions import db
from models.area import Area
from models.user import User
from services import get_all_services

def _get_services_map():
    """Retourne un dict { service_name: service_instance }"""
    return {s.name: s for s in get_all_services()}

def create_area(user_id, action_service, action, reaction_service, reaction, params=None, enabled=True, name="My AREA"):
    user = User.query.get(user_id)
    if not user:
        return None, "Utilisateur introuvable"

    services = _get_services_map()

    act_srv = services.get(action_service)
    rea_srv = services.get(reaction_service)
    if not act_srv or not rea_srv:
        return None, "Service action ou réaction introuvable"

    allowed_actions = {a["name"] for a in act_srv.get_actions()}
    allowed_reactions = {r["name"] for r in rea_srv.get_reactions()}

    if action not in allowed_actions:
        return None, f"Action '{action}' invalide pour {action_service}"
    if reaction not in allowed_reactions:
        return None, f"Reaction '{reaction}' invalide pour {reaction_service}"

    area = Area(
        name=name,
        user_id=user_id,
        action_service=action_service,
        action=action,
        reaction_service=reaction_service,
        reaction=reaction,
        enabled=enabled
    )   
    area.set_params(params)
    db.session.add(area)
    db.session.commit()
    return area, None


def delete_area(area_id, user_id=None):
    """Supprime un AREA"""
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
    """Active/désactive un AREA"""
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
    """Liste tous les AREAs ou ceux d’un utilisateur"""
    q = Area.query
    if user_id:
        q = q.filter_by(user_id=user_id)
    return q.all()
