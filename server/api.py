from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
import os
from utils.colorize import colorize
from binascii import a2b_base64
import base64

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
  colorize('./images/bw/salgado-1.jpg', './images/color/salgado-1.jpg')
  return 'OK';

@app.route('/api/colorize', methods=['POST'])
def colroizePost():
  inputPath = 'images/bw/'
  outputPath = 'images/color'
  filename = 'test.png'
  if request.method == 'POST':
    input = request.get_json()
    file = input['filestream']
    binary_data = a2b_base64(file)
    infile = os.path.join(cwd, inputPath, filename)
    outfile = os.path.join(cwd, outputPath, filename)
    fd = open(infile, 'a')
    fd.write(binary_data)
    fd.close()

    outfile = colorize(infile, outfile)
    encoded_output = base64.b64encode(open(outfile, 'rb').read())
    body = {
      'status': 'OK',
      'body': encoded_output
    }
    os.remove(outfile)
    os.remove(infile)
    return jsonify(**body)

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=int(os.environ.get('PORT', '5000')), debug=True)