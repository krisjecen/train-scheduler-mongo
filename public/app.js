// We'll be rewriting the table's data frequently, so let's make our code more DRY
// by writing a function that takes in 'trains' (JSON) and creates a table body
function displayResults (trains) {
  // First, empty the table
  document.querySelector('tbody').innerHTML = ''

  // Then, for each entry of that json...
  trains.forEach(function (train) {
    var newTrainName = train.train
    var newTrainDestination = train.trainDestination
    var newFirstTrain = train.firstTrain
    var newTrainFrequency = train.trainFrequency
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
}

// 1: On Load
// ==========

// First thing: ask the back end for json with all animals
fetch('/all')
  .then(response => response.json())
  .then(function (data) {
  // Call our function to generate a table body
    displayResults(data)
  })

// 2: Button Interactions
// ======================

document.getElementById('addTrain').addEventListener('click', function (event) {
  // we prevent the default of refreshing the page when the form button is pressed
  event.preventDefault()

  fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      train: document.getElementById('trainNameInput').value.trim(),
      trainDestination: document.getElementById('destinationInput').value.trim(),
      firstTrain: document.getElementById('startTimeInput').value.trim(),
      trainFrequency: document.getElementById('frequencyInput').value.trim()
    })
  })
    .then(response => response.json())
    .then(function (data) {
      // Call our function to regenerate train data
      console.log(data)
      console.log('maybe just the new train data was sent back?')
    })
    .then(fetch('/all')
      .then(response => response.json())
      .then(function (data) {
      // Call our function to generate a table body
        displayResults(data)
      }))

  // clear the form values to allow for easier entry
  document.getElementById('trainNameInput').value = ''
  document.getElementById('destinationInput').value = ''
  document.getElementById('startTimeInput').value = '05:45'
  document.getElementById('frequencyInput').value = ''
})
