// Dependencies
var express = require('express')
var mongojs = require('mongojs')
// var bodyParser = require('body-parser')

// Initialize Express
var app = express()

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Set up a static folder (public) for our web app
app.use(express.static('public'))


// use the bodyParser
// app.use(bodyParser())

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = 'trainscheduler_db'
var collections = ['trains']

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections)

// This makes sure that any errors are logged if mongodb runs into an issue
db.on('error', function (error) {
  console.log('Database Error:', error)
})

// Routes
// 1. At the root path, send a simple hello world message to the browser
// app.get('/', function (req, res) {
//   res.send('Hello world')
// })

// 2. At the "/all" path, display every entry in the trains collection
app.get('/all', function (req, res) {
  // Query: In our database, go to the trains collection, then "find" everything
  db.trains.find({}, function (error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error)
    }
    // Otherwise, send the result of this query to the browser
    else {
      console.log('we found things!')
      res.json(found)
    }
  })
})

// Handle form submission, save submission to mongo
app.post('/submit', function (req, res) {
  console.log(req.body)
  // Insert the note into the notes collection
  db.trains.insert(req.body, function (error, saved) {
    // Log any errors
    if (error) {
      console.log(error)
    } else {
      // Otherwise, send the note back to the browser
      // This will fire off the success function of the ajax request
      console.log('new train was added to the db')
      // res.send(saved)
    }
  })
})

// 3. At the "/name" path, display every entry in the trains collection, sorted by name
// app.get('/name', function (req, res) {
//   // Query: In our database, go to the trains collection, then "find" everything,
//   // but this time, sort it by name (1 means ascending order)
//   db.trains.find().sort({ name: 1 }, function (error, found) {
//     // Log any errors if the server encounters one
//     if (error) {
//       console.log(error)
//     }
//     // Otherwise, send the result of this query to the browser
//     else {
//       res.json(found)
//     }
//   })
// })

// 4. At the "/weight" path, display every entry in the trains collection, sorted by weight
// app.get('/weight', function (req, res) {
//   // Query: In our database, go to the trains collection, then "find" everything,
//   // but this time, sort it by weight (-1 means descending order)
//   db.trains.find().sort({ weight: -1 }, function (error, found) {
//     // Log any errors if the server encounters one
//     if (error) {
//       console.log(error)
//     }
//     // Otherwise, send the result of this query to the browser
//     else {
//       res.json(found)
//     }
//   })
// })

// Set the app to listen on port 3000
app.listen(3000, function () {
  console.log('App running on port 3000!')
})
