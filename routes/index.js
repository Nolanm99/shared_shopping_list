const express   = require('express');
const config    = require('config');
const router    = express.Router();
const DB_CONFIG = config.DB_CONFIG;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'List.me' });
});

module.exports = router;
