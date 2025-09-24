class BaseService:
    name = "base"

    def get_actions(self):
        return []

    def get_reactions(self):
        return []

    def check_action(self, user, action, params=None):
        raise NotImplementedError

    def execute_reaction(self, user, reaction, params=None, data=None):
        raise NotImplementedError
