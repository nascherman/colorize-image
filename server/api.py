from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
import os
from utils.colorize import colorize
# from utils.colorize import colorizeVideo
from binascii import a2b_base64
from tempfile import NamedTemporaryFile
import subprocess
from utils.encode import encode_b64

cwd = os.getcwd()

app = Flask(__name__)
CORS(app)
api = Api(app)

FRAME_RATE = '12'

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  return response

@app.route('/api/get', methods=['GET'])
def colorizeGet():
  colorize(os.path.join(cwd, 'images/bw/salgado-1.jpg'), os.path.join(cwd, 'images/color/salgado-1.jpg'))
  return 'OK';

@app.route('/api/colorize-image', methods=['POST'])
def colorizeImage():
  inputPath = 'images/bw/'
  outputPath = 'images/color'
  if request.method == 'POST':
    input = request.get_json()
    filename = NamedTemporaryFile().name.split('/tmp/')[1]
    file = input['filestream']
    extension = input['extension']
    filename += extension
    binary_data = a2b_base64(file)
    infile = os.path.join(cwd, inputPath, filename)
    outfile = os.path.join(cwd, outputPath, filename)
    fd = open(infile, 'a')
    fd.write(binary_data)
    fd.close()

    output = colorize(infile, outfile)
    
    if(output != None):
      body = {
        'status': 'OK',
        'body': output
      }
    else:
      body = {
        'status': '400',
        'body': None
      }

    os.remove(outfile)
    os.remove(infile)
    return jsonify(**body)

@app.route('/api/colorize-video', methods=['POST'])
def colorizeVideo():
  basePath = 'video/'
  inputPath = basePath + 'bw/'
  outputPath = basePath + 'color'
  if request.method == 'POST':
    input = request.get_json()
    filename = NamedTemporaryFile().name.split('/tmp/')[1]
    file = input['filestream']
    extension = input['extension']
    filename_extension = filename + extension
    binary_data = a2b_base64(file)
    infile = os.path.join(cwd, inputPath, filename_extension)
    outfile = os.path.join(cwd, outputPath, filename_extension)
    fd = open(infile, 'a')
    fd.write(binary_data)
    fd.close()

    colorizedOutput = processVideo(infile, filename, basePath, extension)    

    if (colorizedOutput != None):    
      body = {
        'status': 201,
        'body': colorizedOutput
      }
    else:
      body = {
        'status': 400,
        'body': {
          'message': 'File size too large'
        }
      }

  #  os.remove(outfile)
  #  os.remove(infile)
    return jsonify(**body)

def processVideo(filePath, filename, basePath, extension):
  statinfo = os.stat(filePath)
  if (statinfo.st_size / 1000000 > 10):
    print('File size too large')
    return None

  os.mkdir(os.path.join(cwd, basePath, filename + '-temp'))
  tempOutPath = os.path.join(cwd,  basePath, filename + '-temp')

  args = [
    'ffmpeg', 
    '-i', 
    filePath, 
    '-y', 
    '-ss', 
    '0', 
    '-an', 
    '-qscale', 
    '0', 
    '-f', 
    'image2', 
    '-r', 
    FRAME_RATE, 
    tempOutPath + '/' + 'bw-%03d.jpg'
  ]
  print('Begin ffmpeg split')
  process = subprocess.Popen(args)
  process.wait()
  print('End ffmpeg split')

  tempImageFiles = [f for f in os.listdir(tempOutPath) if os.path.isfile(os.path.join(tempOutPath, f))]
 
  for imageFile in tempImageFiles:
    print('Colorizing image ' + imageFile)
    colorize(tempOutPath + '/' + imageFile, tempOutPath + '/color' + imageFile.split('bw')[1])


  color_video_out = os.path.join(cwd, basePath, 'color/', filename + extension)
  args = [
    'ffmpeg',
    '-framerate',
    FRAME_RATE,
    '-i',
    tempOutPath + '/color-%04d.jpg',
    '-c:v',
    'libx264',
    '-r',
    FRAME_RATE,
    '-pix_fmt',
    'yuv420p',
    color_video_out
  ]  

  process = subprocess.Popen(args)
  process.wait()

  return encode_b64(color_video_out)


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=int(os.environ.get('PORT', '5000')), debug=True)