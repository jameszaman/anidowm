import requests
from os import getcwd, listdir, mkdir

# User defined modules.
from download import download_file

def npokemon_download(name, urls):
  # Making sure the download folder exists.
  target_folder = getcwd()
  dir_list = listdir(target_folder)
  if 'download' not in dir_list:
    mkdir('download')
  target_folder += f'/download/{name}'

  # Create folder for manga.
  mkdir(target_folder)

  # Download all the pages.
  for url in urls:
    page = url.split('/')[-1]
    download_file(url, f'{target_folder}/{page}')


