FROM ubuntu:14.04
MAINTAINER n_scherman@hotmail.com

RUN sudo apt-get update && sudo apt-get install software-properties-common python-software-properties && \
    sudo add-apt-repository ppa:mc3man/trusty-media && \
    
RUN sudo apt-get install -y --no-install-recommends \
        build-essential \
        cmake \
        ffmpeg \
        frei0r-plugins \
        git \
        wget \
        libatlas-base-dev \
        libboost-all-dev \
        libgflags-dev \
        libgoogle-glog-dev \
        libhdf5-serial-dev \
        libleveldb-dev \
        liblmdb-dev \
        libopencv-dev \
        libprotobuf-dev \
        libsnappy-dev \
        protobuf-compiler \
        python-dev \
        python-numpy \
        python-pip \
        python-scipy && \
    rm -rf /var/lib/apt/lists/*

ENV CAFFE_ROOT=/opt/caffe
WORKDIR $CAFFE_ROOT

# FIXME: clone a specific git tag and use ARG instead of ENV once DockerHub supports this.
ENV CLONE_TAG=master

RUN git clone -b ${CLONE_TAG} --depth 1 https://github.com/BVLC/caffe.git . && \
    for req in $(cat python/requirements.txt) pydot; do pip install $req; done && \
    mkdir build && cd build && \
    cmake -DCPU_ONLY=1 .. && \
    make -j"$(nproc)"   

ENV PYCAFFE_ROOT $CAFFE_ROOT/python
ENV PYTHONPATH $PYCAFFE_ROOT:$PYTHONPATH
ENV PATH $CAFFE_ROOT/build/tools:$PYCAFFE_ROOT:$PATH
RUN echo "$CAFFE_ROOT/build/lib" >> /etc/ld.so.conf.d/caffe.conf && ldconfig

WORKDIR /workspace

Run git clone https://github.com/nascherman/colorize-image /workspace/colorize-image

Run cd /workspace/colorize-image/ && pip install -r requirements.txt 
Run cd /workspace/colorize-image/server && wget https://dl.dropboxusercontent.com/u/36345484/colorization_release_v2.caffemodel && mv colorization_release_v2.caffemodel resources/  

ENTRYPOINT cd /workspace/colorize-image/server && python api.py
