const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/store', {
  useNewUrlParser: true
});

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 10000000
  }
});

// Create a scheme for items in the store: a name and a path to an image.
const itemSchema = new mongoose.Schema({
  name: String,
  path: String,
  price: String,
  numPurchased: { type: Number, default: 0 },
});

// Create a model for items in the store.
const Item = mongoose.model('Item', itemSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// Create a new item in the store: takes a name and a path to an image.
app.post('/api/items', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    path: req.body.path,
    price: req.body.price,
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Read/Get a list of all of the items in the store.
app.get('/api/items', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete an item from the database
app.delete('/api/items/:id', async (req, res) => {
  try {
    console.log("in try of delete")
    await Item.deleteOne({ _id: req.params.id });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Update the number of purchases of an item in the store
app.put('/api/items/:id', async (req, res) => {
  try {
    console.log('in update purchase number');
    let item = await Item.findOne({ _id: req.params.id })
    item.numPurchased += 1;
    console.log("New purchase number: " + item.numPurchased);
    item.save();
    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.listen(4200, () => console.log('Server listening on port 4200!'));