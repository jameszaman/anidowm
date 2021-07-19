from urllib import request
from bs4 import BeautifulSoup as soup

def search_anime(anime):
  # page url
  url = 'https://animekisa.tv'
  # Necessary data for request.
  user_agent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46'
  # Getting the page and turning it into soup.
  # Converting spaces to '+'
  anime = '+'.join(anime.split())
  page = request.urlopen(request.Request(f'{url}/search?q={anime}', data=None, headers={'User-Agent': user_agent})).read()
  
  # Getting the names and images of all search result in that page.
  page_soup = soup(page, 'html.parser')
  all_names = page_soup.findAll('div', {
      'class': 'similardd'
  })
  all_image_tags = page_soup.findAll('img', {
      'class': 'coveri'
  })
  
  # Making extracting the names, also making sure any '\n' are cut from name.
  all_names = [name.text.replace('\n', '') for name in all_names if len(name.text) > 1]
  
  # Extracting all the image srcs.
  all_images = [] 
  for image in all_image_tags:
    try:
      all_images.append(f'{url}/{image["src"]}')
    except:
      pass
  
  return all_names, all_images

def get_episode_list(name):
  # Converting name to url.
  base_url = 'https://animekisa.tv'
  nameFormated = name.lower()
  nameFormated = '-'.join(nameFormated.split())
  url = f'{base_url}/{nameFormated}'
  
  # Getting all the anime in a page.
  user_agent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46'
  page = request.urlopen(request.Request(f'{url}', data=None, headers={'User-Agent': user_agent})).read()
  page_soup = soup(page, 'html.parser')
  
  # Getting all the divs that contain episode list.
  divs = page_soup.findAll('div', {
      'class': 'infoept2'
  })
  urls = []
  for div in divs:
    urls.append(div.div.text)

  # Normally the urls are in reverse order. Putting them in order.
  urls.reverse()
  return urls

