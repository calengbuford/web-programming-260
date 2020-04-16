const express = require('express');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));

let items = [];
let id = 0;

app.post('/api/items', (req, res) => {
  id = id + 1;
  let item = {
    id: id,
    text: req.body.text,
    completed: req.body.completed
  };
  items.push(item);
  res.send(item);
});

var bookserver = "https://reststop.randomhouse.com/resources/authors?";
app.get('/api/author', (req, res) => {
    console.log(req.query);
    var url = "https://reststop.randomhouse.com/resources/authors?";
    if (req.query.firstName) {
        url += "firstName=" + req.query.firstName;
    }
    if (req.query.firstName && req.query.lastName) {
        url += "&"
    }
    if (req.query.lastName) {
        url += "lastName=" + req.query.lastName;
    }
    console.log("URL " + url);
    fetch(url, {headers:{'Accept': 'application/json'}})
        .then(data => {
            console.log(data)
            return data.json();
        })
        .then(response => {
            console.log(response);
            res.send(response)
        })
        .catch(function(error) {
            console.log(error);
        });
});

app.get('/api/title', (req, res) => {
    console.log(req.query);
    var url = "https://reststop.randomhouse.com/resources/titles/";
    url += req.query.isbn;
    console.log("URL " + url);
    fetch(url, {headers:{'Accept': 'application/json'}})
        .then(data => {
            console.log(data)
            return data.json();
        })
        .then(response => {
            console.log(response);
            res.send(response)
        })
        .catch(function(error) {
            console.log(error);
        });
});

app.listen(4201, () => console.log('Server listening on port 4201!'));