import logging

logger = logging.getLogger("AREA-App")

def reaction_executor(user, service, reaction, params=None, data=None):
    try:
        logger.info(f"[reaction_executor] Execute {reaction} for {user.email} on {service.name}")

        # Format dynamique des messages (optionnel)
        if params and "message" in params and data:
            try:
                params["message"] = params["message"].format(**data)
            except KeyError as e:
                missing = e.args[0]
                logger.warning(f"[reaction_executor] Missing variable in message: {missing}")
                params["message"] = f"[Erreur] variable manquante : {missing}"

        # Appel du service
        service.execute_reaction(user, reaction, params=params, data=data)

        logger.info(f"[reaction_executor] Reaction {reaction} executed for {user.email}")
        return True, None

    except Exception as e:
        logger.error(f"[reaction_executor] Error executing {reaction} for {user.email}: {e}", exc_info=True)
        return False, str(e)




