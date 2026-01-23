import os
import asyncio
import discord
import threading
import logging
from .base_service import BaseService

logger = logging.getLogger("AREA-App")



class DiscordService(BaseService):
    name = "discord"

    def __init__(self):
        self.token = os.getenv("DISCORD_TOKEN")
        self.client = discord.Client(intents=discord.Intents.default())


        self.loop = asyncio.new_event_loop()
        threading.Thread(target=self._start_bot, daemon=True).start()

    def _start_bot(self):
        asyncio.set_event_loop(self.loop)
        self.loop.run_until_complete(self.client.start(self.token))

    def get_actions(self):
        return []

    def get_reactions(self):
        return [
            {"name": "send_message", "description": "Envoie un message dans un salon Discord spécifique"}
        ]

    def check_action(self, user, action, params=None):
        return False

    async def _send_message(self, channel_id, message):
        """Envoie le message dans le salon indiqué."""
        await self.client.wait_until_ready()
        channel = self.client.get_channel(int(channel_id))
        if channel:
            await channel.send(message)
        else:
            logger.error(f"[DiscordService] Salon {channel_id} introuvable")

    def execute_reaction(self, user, reaction, params=None, data=None):
        if reaction == "send_message":
            message_template = params.get("message", "Hello from AREA!")
            channel_id = params.get("channel_id")

            if not channel_id:
                logger.error("[DiscordService] Aucun channel_id fourni dans les paramètres du workflow")
                return False

            # Fusion des données de contexte
            context = {}
            if data:
                context.update(data)

            try:
                message = message_template.format(**context)
            except KeyError as e:
                message = f"[Erreur] variable manquante dans le message : {e}"

            logger.info(f"[DiscordService] Envoi vers salon {channel_id}: {message}")
            asyncio.run_coroutine_threadsafe(
                self._send_message(channel_id, message),
                self.loop
            )
            return True


    def get_reactions_params(self, reaction_name):
        if reaction_name == "send_message":
            return [
                {"name": "message", "type": "String", "required": True, "description": "message de sortie"},
                {"name": "channel_id", "type": "String", "required": True, "description": "id du channel discord de sortie"}
            ]
        return []

    