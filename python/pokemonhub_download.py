import requests
import json
from urllib import request
from os import environ, listdir, mkdir

# User defined modules.
from download import download_file

def pokemonhub_download(url, title):
    # Sanatize title
    title = title.replace('\n', '')
    title = title.replace('\t', '')
    title = title.replace('/', '')
    title = title.replace('\\', '')
    title = title.replace('"', "'")
    

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
    download_file(url, f'{target_folder}/{title}.mp4')
