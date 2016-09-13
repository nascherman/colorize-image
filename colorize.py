import numpy as np
import skimage.color as color
import scipy.ndimage.interpolation as sni
import caffe
import scipy.misc
import sys
import getopt

try:
    opts, args = getopt.getopt(sys.argv[1:], 'i:o:m:t:r:', [
        'in=',
        'out=',
        'model=',
        'prototext=',
        'resources='
      ])
except getopt.GetoptError:
    print 'colorize.py -i <inputfile> -o <outputfile>'
    sys.exit(2)
for opt, arg in opts:
  if opt == '-H':
    print 'colorize.py -i <inputfile> -o <outputfile>'
    sys.exit()
  elif opt in ("-o", "--out"):
    F_OUT = arg
  elif opt in ("-i", "--in"):   
    F_IN = arg
  elif opt in ('-m', '--model'):
    MODEL = arg
  elif opt in ('-t', '--prototext'):
    PROTO_TEXT = arg
  elif opt in ('-r', '--resources'):
    RESOURCES = arg

try:
  F_IN
except NameError:
  print('Need an in file')
  sys.exit(2)
try:
  F_OUT
except NameError:
  print('Need an out file')
  sys.exit(2)
try:
  MODEL
except NameError:
  print('no model. setting to default')
  MODEL = './resources/colorization_release_v2.caffemodel'
try:
  PROTO_TEXT
except NameError:
  print('no prototext. setting to default')
  PROTO_TEXT = './resources/colorization_deploy_v2.prototxt'
try:
  RESOURCES
except NameError:
  print('no resources. setting to default')
  RESOURCES = './resources/pts_in_hull.npy'

# cpu_id = 0
caffe.set_mode_cpu()
# caffe.set_device(cpu_id)

# Select desired model
net = caffe.Net(PROTO_TEXT, MODEL , caffe.TEST)

(H_in,W_in) = net.blobs['data_l'].data.shape[2:] # get input shape
(H_out,W_out) = net.blobs['class8_ab'].data.shape[2:] # get output shape

print 'Input dimensions: (%i,%i)'%(H_in,W_in)
print 'Output dimensions: (%i,%i)'%(H_out,W_out)

pts_in_hull = np.load(RESOURCES) # load cluster centers
net.params['class8_ab'][0].data[:,:,0,0] = pts_in_hull.transpose((1,0)) # populate cluster centers as 1x1 convolution kernel
print 'Annealed-Mean Parameters populated'

img_rgb = caffe.io.load_image(F_IN)

img_lab = color.rgb2lab(img_rgb) # convert image to lab color space
img_l = img_lab[:,:,0] # pull out L channel
(H_orig,W_orig) = img_rgb.shape[:2] # original image size

# resize image to network input size
img_rs = caffe.io.resize_image(img_rgb,(H_in,W_in)) # resize image to network input size
img_lab_rs = color.rgb2lab(img_rs)
img_l_rs = img_lab_rs[:,:,0]

net.blobs['data_l'].data[0,0,:,:] = img_l_rs-50 # subtract 50 for mean-centering
net.forward() # run network

ab_dec = net.blobs['class8_ab'].data[0,:,:,:].transpose((1,2,0)) # this is our result
ab_dec_us = sni.zoom(ab_dec,(1.*H_orig/H_out,1.*W_orig/W_out,1)) # upsample to match size of original image L
img_lab_out = np.concatenate((img_l[:,:,np.newaxis],ab_dec_us),axis=2) # concatenate with original image L
img_rgb_out = np.clip(color.lab2rgb(img_lab_out),0,1) # convert back to rgb

scipy.misc.imsave(F_OUT, img_rgb_out)
encoded_output = base64.b64encode(open(F_OUT, 'rb').read())

return encoded_output
