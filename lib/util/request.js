const xhr = require('xhr');

const API_URL = 'http://localhost:5000/api/colorize';
module.exports = function (filestream, cb) {
  return xhr.post(API_URL, {
    json: { filestream }
  }, (err, resp, body) => {
    if (err) return cb(err);
    cb(null, body);
  });
};
