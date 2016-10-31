const xhr = require('xhr');

const BASE_URL = 'http://nickscherman.com:5000';

const API_IMAGE_URL = BASE_URL + '/api/colorize-image';
const API_VIDEO_URL = BASE_URL + '/api/colorize-video';
module.exports.image = function (filestream, extension, cb) {
  return xhr.post(API_IMAGE_URL, {
    json: { filestream, extension }
  }, (err, resp, body) => {
    if (err) return cb(err);
    cb(null, body);
  });
};

module.exports.video = function (filestream, extension, cb) {
  return xhr.post(API_VIDEO_URL, {
    json: { filestream, extension }
  }, (err, resp, body) => {
    if (body.status === '500') return cb(body);
    cb(null, body);
  });
};