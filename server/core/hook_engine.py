import logging
from extensions import db
from datetime import datetime, timezone, timedelta
from flask import current_app
from models.area import Area
from services import get_all_services
from core.reaction_executor import reaction_executor

logger = logging.getLogger("AREA-App")

def check_hooks(app=None):
    """
    Parcourt tous les Area activés, vérifie les actions
    et exécute les réactions correspondantes si une action est déclenchée.
    """
    ctx = app.app_context() if app else current_app.app_context()
    with ctx:
        logger.info("[check_hooks] Checking AREAs...")

        services_map = {s.name: s for s in get_all_services()}
        areas = Area.query.filter_by(enabled=True).all()
        now = datetime.now(timezone.utc)

        for area in areas:
            try:
                user = area.user
                if not user:
                    continue

                if area.last_run and area.frequency != 60:
                    last_run = area.last_run.replace(tzinfo=timezone.utc)
                    if (now - last_run) < timedelta(seconds=area.frequency):
                        continue

                triggered_data = None
                triggered = False

                for action_def in (area.actions or []):
                    logger.info(action_def)
                    act_srv = services_map.get(action_def.get("service"))
                    action_name = action_def.get("name")
                    params = action_def.get("params", {})

                    if not act_srv:
                        logger.warning(f"[check_hooks] Unknown action service: {action_def.get('service')}")
                        continue

                    data = act_srv.check_action(user, action_name, params=params)
                    if data:
                        triggered = True
                        triggered_data = data
                        logger.info(f"[check_hooks] AREA {area.id} triggered via {action_def['service']}.{action_name}")
                        break

                if not triggered:
                    continue

                area.last_run = now
                db.session.commit()

                for reaction_def in (area.reactions or []):
                    logger.info(reaction_def)
                    rea_srv = services_map.get(reaction_def.get("service"))
                    reaction_name = reaction_def.get("name")
                    params = reaction_def.get("params", {})

                    if not rea_srv:
                        logger.warning(f"[check_hooks] Unknown reaction service: {reaction_def.get('service')}")
                        continue

                    reaction_executor(user, rea_srv, reaction_name, params=params, data=triggered_data)

            except Exception as e:
                logger.exception(f"[check_hooks] Error AREA {area.id if 'area' in locals() else '?'}: {e}")
