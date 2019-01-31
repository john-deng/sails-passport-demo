/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var fs = require('fs');

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
      if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath);
      }
      fs.writeFile(savePath + file.originalname, file.buffer, function (err) {
        if (err) throw err;
        console.log('saved!');
      });
    }
  }
};
