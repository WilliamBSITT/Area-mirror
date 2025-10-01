import logging

logger = logging.getLogger("AREA-App")

def reaction_executor(user, service, reaction, params=None, data=None):
    try:
        logger.info(f"[reaction_executor] execute {reaction} for {user.email} on {service.name}")

        # formater le message si besoin
        if params and "message" in params and data:
            try:
                params["message"] = params["message"].format(**data)
            except KeyError as e:
                missing = e.args[0]
                logger.error(f"[reaction_executor] variable manquante dans le message : {missing}")
                params["message"] = f"[Erreur] variable manquante : {missing}"

        service.execute_reaction(user, reaction, params=params, data=data)

        logger.info(f"[reaction_executor] ✅ reaction {reaction} executed for {user.email}")
        return True, None

    except Exception as e:
        logger.error(f"[reaction_executor] ❌ error executing {reaction} for {user.email}: {e}", exc_info=True)
        return False, str(e)



