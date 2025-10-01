import os
from cryptography.fernet import Fernet

class CryptoManager:
    def __init__(self):
        key = os.getenv("ENCRYPTION_KEY")
        if not key:
            raise ValueError("ENCRYPTION_KEY is missing in environment")
        self.fernet = Fernet(key.encode() if not isinstance(key, bytes) else key)

    def encrypt(self, data: str) -> str:
        return self.fernet.encrypt(data.encode()).decode()

    def decrypt(self, token: str) -> str:
        return self.fernet.decrypt(token.encode()).decode()

crypto = CryptoManager()
