class BaseService:
    name = "base"

    def get_actions(self):
        return []
    
    def get_reactions(self):
        return []
    
    def check_action(self, user, action):
        return NotImplementedError
    
    def execute_reaction(self, user, reaction, data):
        raise NotImplementedError