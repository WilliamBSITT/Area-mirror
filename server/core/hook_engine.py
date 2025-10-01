import logging
from flask import current_app
from models.area import Area
from .reaction_executor import reaction_executor
from services import get_all_services

logger = logging.getLogger("AREA-API")

def check_hooks(app=None):
    
    ctx = app.app_context() if app else current_app.app_context()
        
    with ctx:
        logger.info(f"[check_hooks] starting to check AREA'S. . .")
        services_map = {s.name: s for s in get_all_services()}
        
        areas = Area.query.filter_by(enabled=True).all()
        if not areas:
            logger.warning(f"[check_hooks] no active area found")
            return
        
        for area in areas:
            try:
                user = area.user
                if not user:
                    logger.warning(f"[check_hooks] AREA {area.id} without user link. skip")
                    continue
                
                service = services_map.get(area.service)
                if not service:
                    logging.info(f"[check_hooks] service {area.service} not register for AREA {area.id}")
                    continue
                
                params = area.params or {}
                triggered = service.check_action(user, area.action, params=params)
                
                if triggered:
                    logger.info(
                        f"[check_hooks] AREA {area.id} started"
                        f"({area.service}:{area.action} -> {area.reaction}) for {user.email}"
                    )
                    ok, err = reaction_executor(user, service, area.reaction, params)
                    if not ok:
                        logger.error(f"[check_hooks] execution error for AREA {area.id}: {err}")
                else:
                    logger.debug(f"[check_hooks] AREA {area.id} not running ({area.action})")
            except Exception as e:
                logger.exception(f"[check_hooks] Exception raised during the treatment of the AREA {area.id}: {e}")