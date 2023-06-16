const express   = require('express');
const config    = require('config');
const router    = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'List.me',
    app_version: config.APP_VERSION
  });
});

module.exports = router;
