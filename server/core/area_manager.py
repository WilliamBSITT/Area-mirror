from extensions import db
from models.user import User
from models.area import Area
from services import get_all_services

def _get_services_map():
    return {s.name: s for s in get_all_services()}


def create_area(user_id, service_name, action, reaction, params=None, enabled=True):
    
    user = User.query.get(user_id)
    if not user:
        return None, "unknown user"
    
    services = _get_services_map()
    service = services.get(service_name)
    if not service:
        return None, f"Service {service_name} not found"
    
    allowed_actions = {a["name"] for a in service.get_actions()}
    allowed_reactions = {r["name"] for r in service.get_reactions()}
    if action not in allowed_actions:
        return None, f"Action {action} invalid for {service_name}"
    if reaction not in allowed_reactions:
        return None, f"Reaction {reaction} invalid for {service_name}"
    
    area = Area(
        user_id=user_id,
        service=service_name,
        action=action,
        reaction=reaction,
        params=params or {},
        enabled=enabled
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
        return None, "AREA not found"
    db.session.delete(area)
    db.session.commit()
    return area, None


def toggle_area(area_id, enabled=True, user_id=None):

    q = Area.query.filter_by(id=area_id)
    if user_id:
        q = q.filter_by(user_id=user_id)
    area = q.first()
    if not area:
        return None, "AREA not found"
    area.enabled = enabled
    db.session.commit()
    return area, None


def list_areas(user_id=None):

    q = Area.query
    if user_id:
        q = q.filter_by(user_id=user_id)
    return q.all()
    