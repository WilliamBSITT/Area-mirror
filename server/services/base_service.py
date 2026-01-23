class BaseService:
    """
    Classe de base que tous les services doivent implémenter.
    Chaque service définit :
    - name (str) : identifiant unique du service ("weather", "spotify", ...)
    - get_actions() : liste des actions disponibles
    - get_reactions() : liste des réactions disponibles
    - check_action(user, action, params) : renvoie True si condition remplie
    - execute_reaction(user, reaction, params, data) : exécute la réaction
    """
    name = "base"
 
    def get_actions(self):
        return []
 

    def get_reactions(self):
        return []
 
    def check_action(self, user, action, params=None):
        raise NotImplementedError
 
    def execute_reaction(self, user, reaction, params=None, data=None):
        raise NotImplementedError

    def get_reactions_params(self, reaction_name):
        return []

    def get_actions_params(self, action_name):
        return []
    
    def get_actions_output(self, action_name):
        return []
    