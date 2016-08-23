# colorize-image
colorize multiple bw images with docker, python and node

This requires caffe and python dependencies to run. Build your own caffe or 
load the included docker image

```shell
sudo docker load -i docker/caffe-colorizer.tar
```

enter the docker environment, then install with `npm install -g` or run 
the index.js file. You can pass arguments for the source folders etc. or 
accept the defaults.

eg. `colorize-image -g images/bw/image0.jpg  -m util/colorization_release_v2.caffemodel -p util/colorization_deploy_v2.prototxt -o images/color/ -r util/pts_in_hull.npy`

```shell 
Usage: colorize image [options] [command]
  
  Commands:
  
    help  Display help
  
  Options:
  
    -g, --glob       the file name/glob
    -h, --help       Output usage information
    -m, --model      the caffemodel
    -o, --out        the output directory 
    -p, --prototext  the prototext
    -r, --resource   the resource file
    -v, --version    Output the version number
```

