import requests
import json
from os import getcwd, listdir, mkdir

# User defined modules.
from download import download_file

def pokemonhub_download(urls):
  """Give the link to any pornhub video and that video will be downloaded to your google drive Colab_Files/hub/ folder"""
  if type(urls) is not list:
    urls = [urls]

  # Making post requests

  # Variable declarations.
  urlFetcherDomain = 'https://xxxsave.net'
  urlFetcher = 'https://xxxsave.net/result-fetch'

  # Setting up client.
  client = requests.session()
  client.get(urlFetcherDomain)
  csrftoken = client.cookies['csrftoken']

  # Data to be sent.
  for url in urls:
    login_data = {
        'csrfmiddlewaretoken': csrftoken,
        'url': url,
    }

    # Fetching the url and converting it.
    urlData = json.loads(client.post(urlFetcher, data = login_data, headers={'Referer' : urlFetcher}).text)
    
    if urlData['success'] == 'true':
      title = urlData['title']
      
      # Sanatize title
      title = title.replace('\n', '')
      title = title.replace('\t', '')
      title = title.replace('/', '|')
      title = title.replace('\\', '|')
      

      # Making sure the download folder exists.
      target_folder = getcwd()
      dir_list = listdir(target_folder)
      if 'download' not in dir_list:
        mkdir('download')
      target_folder += '/download'
      # Downloading the video.
      quality = urlData['quality'][-1]
      download_file(urlData[f's{quality}'], f'{target_folder}/{title}.mp4')
