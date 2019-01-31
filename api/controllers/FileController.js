/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

const uuidv3 = require('uuid');
const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3342';

module.exports = {
  index: function (req, res) {
    res.writeHead(200, {
      'content-type': 'text/html'
    });
    res.end(
      '<form action="/file/upload" enctype="multipart/form-data" method="post">' +
      '<input type="text" name="title"><br>' +
      '<input type="file" name="images" multiple="multiple"><br>' +
      '<input type="submit" value="Upload">' +
      '</form>'
    )
  },
  upload: function (req, res) {
    console.log(req.files)
    if (req.files && req.files.images) {
      var file = req.files.images[0];
      var dd = sails.moment().format('/YYYY/MM/DD/');
      var savePath = '/tmp' + dd;
      mkdirp(savePath, function (err) {
        if (err) console.error(err)
        else console.log('mkdir for ' + savePath)
      });
    
      var filename = uuidv3(file.originalname, MY_NAMESPACE) + path.extname(file.originalname);
      fs.writeFile(savePath + filename, file.buffer, function (err) {
        if (err) throw err;
        console.log('Uploaded ' + savePath + filename);
      });
    }
  }
};
