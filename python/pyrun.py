import sys
from threading import Thread
from anime_download import download_all_anime, download_select_episodes
from pokemonhub_download import pokemonhub_download
from npokemon_download import npokemon_download

# sys.argv[0] is fileName, 1 command, 2 is additional info.
if sys.argv[1] == 'downloadAll':
  t1 = Thread(target=download_all_anime, args=(sys.argv[2],))
  t1.start()
elif sys.argv[1] == 'getEpisodeList':
  print(get_episode_list(sys.argv[2]))
elif sys.argv[1] == 'downloadBetween':
  # Got data as string. Converting it to proper structure.
  data = sys.argv[2].split(',')
  episode_start_end = (int(data[1]), int(data[2]))
  t1 = Thread(target=download_select_episodes, args=(data[0], episode_start_end))
  t1.start()
elif sys.argv[1] == 'downloadSelect':
  # Got data as string. Converting it to proper structure.
  data = sys.argv[2].split(',')
  episodeArray = [int(data[i]) for i in range(len(data)) if i > 0]
  t1 = Thread(target=download_select_episodes, args=(data[0], episodeArray))
  t1.start()
elif sys.argv[1] == 'downloadPokemonhub':
  # Splitting url and name.
  data = sys.argv[2].split(',')
  t1 = Thread(target=pokemonhub_download, args=(data[0], data[1]))
  t1.start()
elif sys.argv[1] == 'NPokemonDownload':
  npokemon_download(sys.argv[2], sys.argv[3].split(','))


