import logging

logger = logging.getLogger("AREA-API")

def reaction_executor(user, service, reaction, params=None, data=None):
    try:
        logger.info(f"[reaction_executor] execute {reaction} for {user.email} with {service.name}")
        service.execute_reaction(user, reaction, data)
        logger.info(f"[reaction_executor] successfully execute reaction {reaction} for {user.email}")
        return True, None
    except Exception as e:
        logger.error(f"[reaction_executor] exception raised during the {reaction} execution for {user.email}: {e}")
        return False, str(e)
