import sys
import requests
from threading import Thread

def download_file(url, local_filename):
  user_agent = 'Mozilla/5.0'
  # NOTE the stream=True parameter below
  with requests.get(url, stream=True, headers={'User-Agent': user_agent}) as r:
    r.raise_for_status()
    with open(local_filename, 'wb') as f:
      for chunk in r.iter_content(chunk_size=8192): 
        # If you have chunk encoded response uncomment if
        # and set chunk_size parameter to None.
        #if chunk: 
        f.write(chunk)
  return local_filename

# If any parameter is passed, download from that link.
if(sys.argv[1] and sys.argv[2]):
  # Download the file using a new thread.
  t1 = Thread(target=download_file, args=(sys.argv[1], sys.argv[2]))
  t1.start()