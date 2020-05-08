// To initialize express in nuxt: 
// https://medium.com/@mitsuyawatanabe/how-to-start-express-project-in-nuxt-2-x-d3406c92a8ca
// https://www.reddit.com/r/vuejs/comments/aayav5/any_examplestutorial_on_a_nuxt_app_with/

console.log(" 🌈🏠 Initializing Rooftop server...")
//console.log("Yr env is: " +  process.env.NODE_ENV)

const fs = require('fs');               // GridFS lets Mongo upload files
const mongodb = require('mongodb');     // The MongoDB library
let mongoose = require('mongoose');     // Mongoose gives us object oriented tools, like schema defining

mongoose.set('useCreateIndex', true); // Resolves a deprecation issue.


let express = require('express');       // The Express library

let ObjectID = mongodb.ObjectID;        // This tool lets us convert object id's to be queryable

// // Disabling this for now, since we're not uploading any files yet. 
// let multer  = require('multer');        // Lets us route new images we're uploading
// let uploadObj = multer({                // This object references the path we want to use
//   dest: './uploads/' 
// })

// This is where we import all our other local files. These files are then called 
// down below, at the bottom of the file. 
const articlesRoutes = require('./articles-api.js');
const themesRoutes = require('./themes-api.js');
const collectionsRoutes = require('./collections-api.js');
const userRoutes = require('./users-api.js');
const projectRoutes = require('./projects-api.js');

const pages_api = require('./pages/pages_api.js');



//    Setting up Express:

// Creating our Express instance:
const app = express()                           
// Telling Nuxt to access the API with /api/ routes
module.exports = { path: '/api', handler: app } 
// Enabling CORS:
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



// Getting the server IP. todo: use env variables and auth to make this more secure.

// If we're in development mode, we connect to mLabs. 
// In production mode, we connect to the server's DB. 
let db_url;
if (process.env.NODE_ENV == 'development') {
  db_url = 'mongodb://user:password1@ds021650.mlab.com:21650/rooftop-db';
} else if (process.env.NODE_ENV == 'production') {
  db_url = 'mongodb://127.0.0.1:27017/rooftop-prod'
}
console.log(" ℹ️ You are running the " + process.env.NODE_ENV + " server.");



//    Connecting to mongoose 

mongoose.connect(db_url, { 
  useUnifiedTopology: true,
  useNewUrlParser: true
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Connecting to our sample database:
db.once('open',
function (err, client) {
  
  if (err) throw err;
  console.log(" 🔗⚡️ Connected to database!")

  // These let express parse json
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Initializing the article routes
  articlesRoutes(app, mongoose);
  themesRoutes(app, mongoose);
  collectionsRoutes(app, mongoose);
  userRoutes(app, mongoose);
  projectRoutes(app, mongoose);
  pages_api(app, mongoose);

  // // See all routes, for debugging
  // app._router.stack.forEach(function(r){
  //   if (r.route && r.route.path){
  //     console.log(r.route.path)
  //   }
  // })

})