// javascript for train scheduler
'use strict'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyC-bIGYh2DHMV4G7SSHefSG6efG21o2Ta8",
    authDomain: "train-scheduler-e5986.firebaseapp.com",
    databaseURL: "https://train-scheduler-e5986.firebaseio.com",
    projectId: "train-scheduler-e5986",
    storageBucket: "train-scheduler-e5986.appspot.com",
    messagingSenderId: "1023685093546"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // adding new trains to the schedule list

  document.getElementById("addTrain").addEventListener("click", function(event) {
    // we prevent the default of refreshing the page when the form button is pressed  
    event.preventDefault();

    // store user input in variables
    var inputTrainName = document.getElementById("trainNameInput").value.trim();
    var inputDestination = document.getElementById("destinationInput").value.trim();
    var inputFirstTrain = document.getElementById("startTimeInput").value.trim();
    var inputFrequency = document.getElementById("frequencyInput").value.trim();

    var newTrain = {
        train: inputTrainName,
        trainDestination: inputDestination,
        firstTrain: inputFirstTrain,
        trainFrequency: inputFrequency
    };

    database.ref().push(newTrain);

    console.log(newTrain.train);
    console.log(newTrain.trainDestination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.trainFrequency);


    // clear the form values to allow for easier entry
    document.getElementById("trainNameInput").value = "";
    document.getElementById("destinationInput").value = "";
    document.getElementById("startTimeInput").value = "";
    document.getElementById("frequencyInput").value = "";


  });

  // each time another child (batch of data, new train in this case) is added to our db...
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    // we are taking data on our new train from our database
    var newTrainName = childSnapshot.val().train;
    var newTrainDestination = childSnapshot.val().trainDestination
    var newFirstTrain = childSnapshot.val().firstTrain;
    var newTrainFrequency = childSnapshot.val().trainFrequency;

    /* we need to create additional variables for our next arriving train
    and minutes away that will be calculated from our first train and train
    frequency data
    */

    // temp values to test display
    var newNextArrival = "12:40";
    var newMinutesAway = "40";



    /* we will not include the firstTrain value as it is
    in our table, but we will use the value to calculate when
    the next train is arriving
    */
    //firstTrain: newFirstTrain


    // create an object to store our firebase data
    let newTraindata = {
        name: newTrainName,
        destination: newTrainDestination,
        frequency: newTrainFrequency,
        nextArrival: newNextArrival,
        minutesAway: newMinutesAway
    };

    // parse data, momentJS

    //create a new row for our table
    var newScheduleRow = document.createElement("tr");

    // loop through our newly added train data and add it into our schedule table
    for (let traindata of Object.values(newTraindata)) {
        let newTd = document.createElement("td");
        newTd.textContent = traindata;
        newScheduleRow.appendChild(newTd);
    }

    // add our data to our train schedule by appending the new row
    document.querySelector("#trainScheduleTable > tbody").appendChild(newScheduleRow);

  });