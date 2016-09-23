from __future__ import division
import os
from colorize import colorize
from subprocess import Popen, PIPE
from json import loads
from encode import encode_b64
from Queue import Queue
from threading import Thread

cwd = os.getcwd()

FRAME_RATE = '12'

def process_video(filePath, filename, basePath, extension):
  statinfo = os.stat(filePath)
  dimensions = None
  if (statinfo.st_size / 1000000 > 10):
    print('File size too large')
    return None

  os.mkdir(os.path.join(cwd, basePath, filename + '-temp'))
  tempOutPath = os.path.join(cwd,  basePath, filename + '-temp')

  # get info
  args = [
    'ffprobe', 
    '-v', 
    'quiet', 
    '-print_format', 
    'json', 
    '-show_format',
    '-show_streams', 
    filePath
  ]

  process = Popen(args, stdout=PIPE, stderr=PIPE)
  process.wait()
  output, err = process.communicate()
  video_info = loads(output)
  video_width = video_info['streams'][0]['width']
  video_height = video_info['streams'][0]['height']

  if(video_width > 512):
    dimensions = 'scale=iw*' + str(512/video_width) + ':ih*' + str(512/video_width)
    print(dimensions)
  # out bw stills
  args = [
    'ffmpeg', 
    '-i', 
    filePath, 
    '-y', 
    '-ss', 
    '0', 
    '-an',
    '-vf',
    dimensions,
    '-qscale:v', 
    '0', 
    '-f', 
    'image2', 
    '-r', 
    FRAME_RATE, 
    tempOutPath + '/' + 'bw-%03d.jpg'
  ]

  process = Popen(args)
  process.wait()

  queue = Queue(maxsize=0)

  tempImageFiles = [f for f in os.listdir(tempOutPath) if os.path.isfile(os.path.join(tempOutPath, f))]
  for imageFile in tempImageFiles:
    print('colorize ' + imageFile)
    infile = tempOutPath + '/' + imageFile
    outfile = tempOutPath + '/color' + imageFile.split('bw')[1]
    t = Thread(target=colorize_thread, args=(infile, outfile, queue))
    t.daemon = True
    t.start()
    # colorize(, )
  
  thread_out = queue.get()

  color_video_out = os.path.join(cwd, basePath, 'color/', filename + extension)
  args = [
    'ffmpeg',
    '-framerate',
    FRAME_RATE,
    '-i',
    tempOutPath + '/color-%03d.jpg',
    '-c:v',
    'libx264',
    '-r',
    FRAME_RATE,
    '-pix_fmt',
    'yuv420p',
    color_video_out
  ]  

  process = Popen(args)
  process.wait()

  tempImageFiles = [f for f in os.listdir(tempOutPath) if os.path.isfile(os.path.join(tempOutPath, f))]
  for imageFile in tempImageFiles:
    os.remove(tempOutPath + '/' + imageFile)

  os.rmdir(tempOutPath)
  return encode_b64(color_video_out)

def colorize_thread(infile, outfile, q):
  colorize(infile, outfile)
  print('done colorize ', infile)
  os.remove(infile)
  q.put(outfile)
  