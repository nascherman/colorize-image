#!/usr/bin/env node
var shelljs = require('shelljs');
var path = require('path');
var args = require('args');
var glob = require('glob');

args
  .option('model', 'the caffemodel')
  .option('prototext', 'the prototext')
  .option('resource', 'the resource file')
  .option('out', 'the output directory ')
  .option('glob', 'the file name/glob');

var flags = args.parse(process.argv);

glob(flags.glob || 'images/bw/*', {}, function(err, files) {
  files.forEach(function(file, i) {
    var name = path.basename(file)
    var outDir = flags.out || './images/color';
    var out = outDir + name;
    var model = flags.model || './util/colorization_release_v2.caffemodel';
    var prototext = flags.prototext || './util/colorization_deploy_v2.prototxt';
    var resources = flags.resource || './util/pts_in_hull.npy';
    shelljs.exec('python colorize.py -i ' + file + ' -o ' + out +
     ' -m ' + model + ' -t ' + prototext + ' -r ' + resources);
    console.log('done generating file index ' + i);  
  })
});