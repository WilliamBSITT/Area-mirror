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
        self.channel_id = int(1420732842341699594)

        intents = discord.Intents.default()
        self.client = discord.Client(intents=intents)

        self.loop = asyncio.new_event_loop()
        t = threading.Thread(target=self._start_bot, daemon=True)
        t.start()

    def _start_bot(self):
        asyncio.set_event_loop(self.loop)
        self.loop.run_until_complete(self.client.start(self.token))

    def get_actions(self):
        return []

    def get_reactions(self):
        return [
            {"name": "send_message", "description": "Envoie un message dans le salon Discord"}
        ]

    def check_action(self, user, action, params=None):
        return False

    async def _send_message(self, message):
        await self.client.wait_until_ready()
        channel = self.client.get_channel(self.channel_id)
        if channel:
            await channel.send(message)
        else:
            print("[DiscordService] Salon introuvable")

    def execute_reaction(self, user, reaction, params=None, data=None):
        if reaction == "send_message":
            message_template = params.get("message", "Hello from AREA!")
            
            context = {}
            if data:
                context.update(data)

            try:
                message = message_template.format(**context)
            except KeyError as e:
                message = f"[Erreur] variable manquante dans le message : {e}"

            logger.info(message)
            asyncio.run_coroutine_threadsafe(
                self._send_message(message),
                self.client.loop
            )

