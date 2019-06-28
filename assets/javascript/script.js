// javascript for train scheduler
'use strict'

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyC-bIGYh2DHMV4G7SSHefSG6efG21o2Ta8',
  authDomain: 'train-scheduler-e5986.firebaseapp.com',
  databaseURL: 'https://train-scheduler-e5986.firebaseio.com',
  projectId: 'train-scheduler-e5986',
  storageBucket: 'train-scheduler-e5986.appspot.com',
  messagingSenderId: '1023685093546'
}
firebase.initializeApp(config)

var database = firebase.database()

// adding new trains to the schedule list

document.getElementById('addTrain').addEventListener('click', function (event) {
  // we prevent the default of refreshing the page when the form button is pressed
  event.preventDefault()

  // store user input in variables
  var inputTrainName = document.getElementById('trainNameInput').value.trim()
  var inputDestination = document.getElementById('destinationInput').value.trim()
  var inputFirstTrain = document.getElementById('startTimeInput').value.trim()
  var inputFrequency = document.getElementById('frequencyInput').value.trim()

  // create a new object for our train data -- we will store it in our database
  var newTrain = {
    train: inputTrainName,
    trainDestination: inputDestination,
    firstTrain: inputFirstTrain,
    trainFrequency: inputFrequency
  }
  // add our train data into the database
  database.ref().push(newTrain)

  // clear the form values to allow for easier entry
  document.getElementById('trainNameInput').value = ''
  document.getElementById('destinationInput').value = ''
  document.getElementById('startTimeInput').value = ''
  document.getElementById('frequencyInput').value = ''
})

// each time another child (batch of data, new train in this case) is added to our db...
database.ref().on('child_added', function (childSnapshot) {
  // we are taking data on our new train from our database
  var newTrainName = childSnapshot.val().train
  var newTrainDestination = childSnapshot.val().trainDestination
  var newFirstTrain = childSnapshot.val().firstTrain
  var newTrainFrequency = childSnapshot.val().trainFrequency

  /* we need to create additional variables for our next arriving train
    and minutes away that will be calculated from our first train and train
    frequency data
    */

  // need to use moment to generate the current date
  var todayMonthDayYear = moment().format('MM/DD/YYYY')
  // adding the date to the first train time so it can be used in time calculations
  var newFirstTrainDateTime = `${todayMonthDayYear} ${newFirstTrain}`
  // how many minutes have elapsed since the first train of the day?
  var minutesSinceFirstTrain = moment().diff(newFirstTrainDateTime, 'minutes')
  /* we can divide the minutes elapsed by the train's frequency and the remainder
    will be the number of minutes since the last (most recent) train arrived for that train line
    */
  var minSinceLastTrain = minutesSinceFirstTrain % newTrainFrequency
  // now we can determine how long it will be until the next train arrives
  var minUntilNextTrain = newTrainFrequency - minSinceLastTrain
  // and we can add that number of minutes to the current time and display the next train's arrival time
  var newNextArrival = moment().add(minUntilNextTrain, 'minutes').format('hh:mm a')

  /* create an object to store our firebase data along with the data we've generated from our
    train frequency & first arrival times
    */
  let newTraindata = {
    name: newTrainName,
    destination: newTrainDestination,
    frequency: newTrainFrequency,
    nextArrival: newNextArrival,
    minutesAway: minUntilNextTrain
  }

  // create a new row for our table
  var newScheduleRow = document.createElement('tr')

  // loop through our newly added train data and add it into our schedule table
  for (let traindata of Object.values(newTraindata)) {
    let newTd = document.createElement('td')
    newTd.textContent = traindata
    newScheduleRow.appendChild(newTd)
  }

  // add our data to our train schedule by appending the new row
  document.querySelector('#trainScheduleTable > tbody').appendChild(newScheduleRow)
})
