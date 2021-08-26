import requests
from urllib import request
from download import download_file
from bs4 import BeautifulSoup as soup
from os import environ, listdir, mkdir


def download_anime(anime, target_folder):
  # Necessary variables.
  url = f'https://anidownserver.jameshedayet.repl.co/getanimedownloadurl?anime={anime}'
  user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0'
  # Get the video url from server and parse it.
  video_url = request.urlopen(request.Request(f'{url}', data=None, headers={'User-Agent': user_agent})).read().decode()
  try:
    # Download the video.
    download_file(video_url, f'{target_folder}/{anime}.mp4')
  except Exception as e:
    print(e)


def make_anime_folder(name):
  # Destination where to save the videos.
  target_folder = f'C:{environ["HOMEPATH"]}'
  # Making sure the Downloads folder exists.
  dir_list = listdir(target_folder)
  if 'Downloads' not in dir_list:
    mkdir(f'{target_folder}/Downloads')
  target_folder = f'{target_folder}/Downloads'
  # Making sure the Anidown folder exists.
  dir_list = listdir(target_folder)
  if 'Anidown' not in dir_list:
    mkdir(f'{target_folder}/Anidown')
  target_folder = f'{target_folder}/Anidown'

  # Making a folder with number if that folder already exits.
  # Also setting that as the target folder.
  count = 0
  temp_name = name
  while True:
    current_folders = listdir(target_folder)
    if temp_name in current_folders:
      count += 1
      temp_name = f'{name}_{str(count)}'
    else:
      mkdir(f'{target_folder}/{temp_name}')
      target_folder = f'{target_folder}\\{temp_name}'
      break
  return target_folder

def download_all_anime(name, url):
  # urls can't have space.
  # get all the episode liks for the anime.
  user_agent = 'Mozilla/5.0'
  url = f'https://anidownserver.jameshedayet.repl.co/getanimeepisodelink?anime={url}'
  # Convert the byte response to a list.
  urls = request.urlopen(request.Request(f'{url}', data=None, headers={'User-Agent': user_agent})).read().decode().replace('"', '')[1:-2].split(',')
  # Create a new folder where all the anime will be stored.
  target_folder = make_anime_folder(name)
  for url in urls:
    download_anime(url, target_folder)

def download_select_episodes(name, url, episodes):
  # urls can't have space.
  # get all the episode liks for the anime.
  user_agent = 'Mozilla/5.0'
  url = f'https://anidownserver.jameshedayet.repl.co/getanimeepisodelink?anime={url}'
  # Convert the byte response to a list.
  urls = request.urlopen(request.Request(f'{url}', data=None, headers={'User-Agent': user_agent})).read().decode().replace('"', '')[1:-2].split(',')
  # Create a new folder where all the anime will be stored.
  target_folder = make_anime_folder(name)
  print('Reached here')
  # If an array is given, download all episodes in that array.
  if type(episodes) == list:
    for i in episodes:
      if i < len(urls):
        download_anime(urls[i], target_folder)
  # Tuple means start and end of episodes to download.
  elif type(episodes) == tuple:
    for i in range(episodes[0], episodes[1] + 1):
      if i < len(urls):
        download_anime(urls[i - 1], target_folder)
      else:
        break
  # single int means specific episode.
  elif type(episodes) == int:
    download_anime(urls[episodes - 1], target_folder)
