import numpy as np
import skimage.color as color
import scipy.ndimage.interpolation as sni
import caffe
import scipy.misc
import sys
import getopt
import urllib
import os

cwd = os.getcwd()
print(cwd)
dropbox_url = 'https://dl.dropboxusercontent.com/u/36345484/colorization_release_v2.caffemodel'
model_path = os.path.join(cwd, 'resources/', 'colorization_release_v2.caffemodel')

if os.path.exists(model_path) != True:
  print('fetching model')
  urllib.urlretrieve(dropbox_url, model_path)
  print('done fetching model')

try:
  MODEL
except NameError:
  print('no model. setting to default')
  MODEL = model_path
try:
  PROTO_TEXT
except NameError:
  print('no prototext. setting to default')
  PROTO_TEXT = os.path.join(cwd, 'resources/colorization_deploy_v2.prototxt')
try:
  RESOURCES
except NameError:
  print('no resources. setting to default')
  RESOURCES = os.path.join(cwd, 'resources/pts_in_hull.npy')

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

def colorize(F_IN, F_OUT):
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
  return F_OUT
