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
    texty_wexty = texty_wexty.lower()
    texty_wexty = texty_wexty.replace("!uwu ", "")
    texty_wexty = texty_wexty.replace("bulge", "bulgie wulgie")
    texty_wexty = texty_wexty.replace("r", "w")
    texty_wexty = texty_wexty.replace("l", "w")
    texty_wexty = texty_wexty.replace("uck", "ucky wucky")
    return texty_wexty

@bot.command(name='uwu')
async def uwu(ctx):
    await ctx.message.delete()
    await ctx.send(hewwwo(ctx.message.content))
    #await ctx.message.edit(content=hewwwo(ctx.message.content))
    
bot.run(TOKEN)
