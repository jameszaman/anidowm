import requests
from urllib import request
from download import download_file
from bs4 import BeautifulSoup as soup
from os import environ, listdir, mkdir

def extract_url(script_string):
  url_start = script_string.find('var VidStreaming = "') + len('var VidStreaming = "')
  url_end = script_string.find('";', url_start)
  return script_string[url_start : url_end]

def extract_url2(script_string):
  url_start = script_string.find("sources:[{file: '") + len("sources:[{file: '")
  url_end = script_string.find("'", url_start)
  return script_string[url_start : url_end]

def download_anime(anime, target_folder):
  # Necessary variables
  url = 'https://animekisa.tv/'
  user_agent = 'Mozilla/5.0'

  # Get the page with given url.
  page = request.urlopen(request.Request(f'{url}/{anime}', data=None, headers={'User-Agent': user_agent})).read()
  page_soup = soup(page, 'html.parser')
  # Find the link where the video is stored.
  scripts = page_soup.findAll('script')
  initial_url = extract_url(str(scripts[6]))

  # Get the page where the video is.
  video_page = request.urlopen(request.Request(f'{initial_url}', data=None, headers={'User-Agent': user_agent})).read()
  video_page_soup = soup(video_page, 'html.parser')

  # Get the video url.
  all_scripts = video_page_soup.findAll('script')
  video_url = extract_url2(str(all_scripts[2]))

  # Download the video.
  try:
    # print(f'Anime: {anime}\nURL: {video_url}')
    download_file(video_url, f'{target_folder}/{anime}.mp4')
  except Exception as e:
    print(e)

def get_all_download_links(name):
  # Converting name to url.
  base_url = 'https://animekisa.tv'
  nameFormated = name.lower()
  nameFormated = '-'.join(nameFormated.split())
  url = f'{base_url}/{nameFormated}'
  
  # Getting all the anime in a page.
  user_agent = 'Mozilla/5.0'
  page = request.urlopen(request.Request(f'{url}', data=None, headers={'User-Agent': user_agent})).read()
  page_soup = soup(page, 'html.parser')
  urls = page_soup.findAll('a', {
      'class': 'infovan'
  })

  # Normally the urls are in reverse order. Putting them in order.
  urls.reverse()
  return urls

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

def download_all_anime(name):
  # get all the episode liks for the anime.
  urls = get_all_download_links(name)
  # Create a new folder where all the anime will be stored.
  target_folder = make_anime_folder(name)
  print(target_folder)
  for url in urls:
    download_anime(url['href'], target_folder)

def download_select_episodes(name, episodes):
  # get all the episode liks for the anime.
  urls = get_all_download_links(name)
  # Create a new folder where all the anime will be stored.
  target_folder = make_anime_folder(name)

  # If an array is given, download all episodes in that array.
  if type(episodes) == list:
    for i in episodes:
      if i < len(urls):
        download_anime(urls[i - 1]['href'], target_folder)
  # Tuple means start and end of episodes to download.
  elif type(episodes) == tuple:
    for i in range(episodes[0], episodes[1] + 1):
      if i < len(urls):
        download_anime(urls[i - 1]['href'], target_folder)
      else:
        break
  # single int means specific episode.
  elif type(episodes) == int:
    download_anime(urls[episodes - 1]['href'], target_folder)

