import requests
import json
from urllib import request
from os import environ, listdir, mkdir

# User defined modules.
from download import download_file

def pokemonhub_download(url):
  # converting url to fetching url
  url = f'https://anidownserver.jameshedayet.repl.co/getpokemonhuburl?pokemon={url}'
  # Fetching the url and converting it.
  user_agent = 'Mozilla/5.0'
  urlData = request.urlopen(request.Request(f'{url}', data=None, headers={'User-Agent': user_agent})).read().decode()
  # Converting string to dict.
  urlData = json.loads(urlData)
  
  if urlData['success'] == 'true':
    title = urlData['title']
    
    # Sanatize title
    title = title.replace('\n', '')
    title = title.replace('\t', '')
    title = title.replace('/', '|')
    title = title.replace('\\', '|')
    

    # Making sure the Downloads folder exists.
    target_folder = f'C:{environ["HOMEPATH"]}'
    dir_list = listdir(target_folder)
    if 'Downloads' not in dir_list:
      mkdir(f'{target_folder}/Downloads')
    target_folder += '/Downloads'
    # Making sure the Anidown folder exists.
    dir_list = listdir(target_folder)
    if 'Anidown' not in dir_list:
      mkdir(f'{target_folder}/Anidown')
    target_folder += '/Anidown'
    # Downloading the video.
    quality = urlData['quality'][-1]
    download_file(urlData[f's{quality}'], f'{target_folder}/{title}.mp4')
