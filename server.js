// Dependencies
var express = require('express')
var mongojs = require('mongojs')
const Mongoose = require('mongoose')

// Initialize Express
var app = express()
const PORT = process.env.PORT || 3000

// mongoose setup
const CONNECTION_URI = process.env.MONGODB_URI || 'mongodb://localhost/trainscheduler_db'
Mongoose.Promise = global.Promise
Mongoose.set('debug', true)

Mongoose.connect(CONNECTION_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB.')
  })
  .catch(err => console.log(err))

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
var db = mongojs(databaseUrl, collections) || process.env.MONGODB_URI

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
    } else {
      // Otherwise, send the result of this query to the browser
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
      res.send(saved)
    }
  })
})

// Set the app to listen on port 3000
app.listen(PORT, function () {
  console.log(`App running on ${PORT}!`)
})
