import sys
import requests

def to_list(string):
  string = string[1:-1]
  return string.split(',')

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

def download_multiple(urls, local_filenames):
  for i in range(len(urls)):
    download_file(urls[i], local_filenames[i])

# If any parameter is passed, download from that link.
if(sys.argv[1] and sys.argv[2]):
  if sys.argv[1][0] == '[' and sys.argv[1][-1] == ']':
    if sys.argv[2][0] == '[' and sys.argv[2][-1] == ']':
      urls = to_list(sys.argv[1])
      names = to_list(sys.argv[2])
      download_multiple(urls, names)
    else:
      print('Error: Both of the arguments should be lists.')
  else:
    # Download the file using a new thread.
    download_file(sys.argv[1], sys.argv[2])