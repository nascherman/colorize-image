from __future__ import division
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
import os
from utils.colorize import colorize
from binascii import a2b_base64
from tempfile import NamedTemporaryFile
from utils.encode import encode_b64
from utils.process import process_video

MAX_VIDEO_REQUEST_POOLS = 10
global video_colorize_count 
video_colorize_count = 0

cwd = os.getcwd()

app = Flask(__name__)
CORS(app)
api = Api(app)

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
  global video_colorize_count
  outputPath = basePath + 'color'
  if request.method == 'POST':
    input = request.get_json()
    filename = NamedTemporaryFile().name.split('/tmp/')[1]
    file = input['filestream']
    extension = input['extension']
    filename_extension = filename + extension
    if video_colorize_count >= 10:
      return jsonify({
        'status': 500,
        'body': 'Colorize server busy. try again later '
      })

    # colorize video requires better infrastructure so is left out
    return jsonify(status='500', message='Colorizing video is unavailable due to resource constraints')

    video_colorize_count += 1
    binary_data = a2b_base64(file)
    infile = os.path.join(cwd, inputPath, filename_extension)
    outfile = os.path.join(cwd, outputPath, filename_extension)
    fd = open(infile, 'a')
    fd.write(binary_data)
    fd.close()

    colorizedOutput = process_video(infile, filename, basePath, extension)    

    if (colorizedOutput != None):    
      body = {
        'status': 201,
        'body': colorizedOutput
      }
    else:
      body = {
        'status': 400,
        'body': 'File size too large'
      }

    os.remove(outfile)
    os.remove(infile)
    video_colorize_count -= 1
    return jsonify(**body)

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=int(os.environ.get('PORT', '5000')), debug=True)
