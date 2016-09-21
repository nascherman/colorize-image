import base64

def encode_b64(file):
  return base64.b64encode(open(file, 'rb').read())