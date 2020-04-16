var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/cities', function(req, res, next) {
  console.log("In Cities");
  console.log(req.query);
  var cityRest = "http://bioresearch.byu.edu/cs260/jquery/getcity.cgi?q=" + req.query.q;
  request(cityRest).pipe(res);
});

router.get('/owl', function(req, res, next) {
  console.log("In Owl");
  console.log(req.query);
  var owlRest = "https://owlbot.info/api/v1/dictionary/" + req.query.q + "?format=json";
  request(owlRest).pipe(res);
});

module.exports = router;
