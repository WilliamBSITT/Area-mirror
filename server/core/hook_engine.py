import logging
from extensions import db
from datetime import datetime, timezone, timedelta
from flask import current_app
from models.area import Area
from services import get_all_services
from core.reaction_executor import reaction_executor
from services.notification_service import send_push_notification


logger = logging.getLogger("AREA-App")

def check_hooks(app=None):
    ctx = app.app_context() if app else current_app.app_context()
    with ctx:
        logger.info("[check_hooks] checking AREAs...")
        services_map = {s.name: s for s in get_all_services()}
        areas = Area.query.filter_by(enabled=True).all()

        now = datetime.now(timezone.utc)

        for area in areas:
            try:
                user = area.user
                if not user:
                    continue

                act_srv = services_map.get(area.action_service)
                rea_srv = services_map.get(area.reaction_service)
                if not act_srv or not rea_srv:
                    continue

                if area.last_run and area.frequency != 60:
                    last_run = area.last_run.replace(tzinfo=timezone.utc)
                    if (now - last_run) < timedelta(seconds=area.frequency):
                        continue

                params = area.params or {}
                data = act_srv.check_action(user, area.action, params=params)

                if data:
                    logger.info(f"[check_hooks] AREA {area.id} triggered")
                    area.last_run = now
                    db.session.commit()

                    reaction_executor(user, rea_srv, area.reaction, params=params, data=data)
                    titre = "Workflows from area is running"
                    description = area.name
                    send_push_notification(user, description, titre)

            except Exception as e:
                logger.exception(f"[check_hooks] Error AREA {area.id}: {e}")



