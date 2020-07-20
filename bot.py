import os

import discord
from discord.ext import commands
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('UWU_TOKEN')

bot = commands.Bot(command_prefix='!')

@bot.event
async def on_ready():
    print(f'{bot.user} has connected to Discord!')

def hewwwo(texty_wexty):
    return texty_wexty
      .lower()
      .replace("you ", "uwu ")
      .replace("bulge", "bulgie wulgie")
      .replace("r", "w")
      .replace("l", "w")
      .replace("l", "w")
      .replace("uck", "ucky wucky")

@bot.command(name='uwu')
async def uwu(ctx):
    await ctx.message.delete()
    await ctx.send(hewwwo(ctx.message.content.replace("!uwu ", "")))
    #await ctx.message.edit(content=hewwwo(ctx.message.content))
    
bot.run(TOKEN)
