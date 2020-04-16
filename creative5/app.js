// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// const bodyParser = require("body-parser");

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   console.log("404 error in app.use")
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


///// Adding more beyond npm

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: false
// }));

// app.use(express.static('public'));

// const mongoose = require('mongoose');

// // connect to the database
// mongoose.connect('mongodb://localhost:27017/postPhotos', {
//   useNewUrlParser: true
// });

// // Configure multer so that it will upload to '/public/images'
// const multer = require('multer')
// const upload = multer({
//   dest: './public/images/',
//   limits: {
//     fileSize: 10000000
//   }
// });




/////////////////////////////////////////////////////////////////////////////////////// The code above needs routes work


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
mongoose.connect('mongodb://localhost:27017/postPhotos', {
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


// Create a scheme for posts in the store: a name and a path to an image.
const postSchema = new mongoose.Schema({
  name: String,
  date: { type : Date, default: Date.now },
  path: String,
  likes: { type: Number, default: 0 },
});

// Create a model for posts in the store.
const Post = mongoose.model('Post', postSchema);

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

// Create a new post: takes a name and a path to an image.
app.post('/api/posts', async (req, res) => {
  const post = new Post({
    name: req.body.name,
    path: req.body.path,
  });
  try {
    console.log("in api/posts posts");
    await post.save();
    res.send(post);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Read/Get a list of all of the posts.
app.get('/api/posts', async (req, res) => {
  try {
    console.log("in api/posts get");
    let posts = await Post.find();
    res.send(posts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete an post from the database
app.delete('/api/posts/:id', async (req, res) => {
  try {
    console.log("in try of delete")
    await Post.deleteOne({ _id: req.params.id });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Upvote an post from the database
app.put('/api/posts/:id', async (req, res) => {
  try {
    console.log("in try of upvote")
    let item = await Post.findOne({ _id: req.params.id })
    item.likes += 1;
    console.log(item.likes);
    item.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


module.exports = app;
