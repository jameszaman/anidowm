import requests
from os import environ, listdir, mkdir

# User defined modules.
from download import download_file

def npokemon_download(name, urls):
  # ------------------------------------
  # # Destination where to save the videos.
  # target_folder = environ["HOMEPATH"]
  # # Making sure the Downloads folder exists.
  # dir_list = listdir(target_folder)
  # if 'Downloads' not in dir_list:
  #   mkdir(f'{target_folder}/Downloads')
  # target_folder = f'C:{target_folder}\\Downloads'
  # ------------------------------------
  # Making sure the download folder exists.
  target_folder = f'C:{environ["HOMEPATH"]}'
  # Making sure Downloads folder exists.
  dir_list = listdir(target_folder)
  if 'Downloads' not in dir_list:
    mkdir(f'{target_folder}/Downloads')
  target_folder += f'/Downloads'
  # Making sure Anidown folder exists.
  dir_list = listdir(target_folder)
  if 'Anidown' not in dir_list:
    mkdir(f'{target_folder}/Anidown')
  # Create folder for manga.
  target_folder += f'/Anidown/{name}'
  mkdir(target_folder)

  # Download all the pages.
  for url in urls:
    page = url.split('/')[-1]
    download_file(url, f'{target_folder}/{page}')


