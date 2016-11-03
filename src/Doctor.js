// Generated by CoffeeScript 1.10.0

var request = require('request');
var async = require('async');

function Doctor() {
}

Doctor.prototype.examine = function(site, callback, msg) {
  console.log("Doctor: well, I'm examing."); //@@
  var options = {
      url: site.url
  };
  var message = {};
  request.get(options, function(err, res, body) {
    if (err) {
      message = {
        "status": "error",
        "statusCode": null,
        "discription": "ERROR: \"" + site.url + "\" Connection fail."
      };
      callback(message, msg);
    } else if (res.statusCode === site.status) {
      message = {
        "status": "matched",
        "statusCode": "" + res.statusCode,
        "discription": "SUCCESS: \"" + site.url + "\" has been alive :)"
      };
      callback(message, msg);
    } else if (res.statusCode !== site.status) {
      message = {
        "status": "unmatched",
        "statusCode": "" + res.statusCode,
        "discription": "ERROR: \"" + site.url + "\" [expect]: \"" + site.status + "\", [actual]: \"" + res.statusCode + "\""
      };
      callback(message, msg);
    }
  });
};

module.exports.Doctor = Doctor;
