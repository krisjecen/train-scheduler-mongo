// javascript for train scheduler

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
    var trainName = document.getElementById("trainNameInput").value.trim();
    var destination = document.getElementById("destinationInput").value.trim();
    var startTime = document.getElementById("startTimeInput").value.trim();
    var frequency = document.getElementById("frequencyInput").value.trim();

    var newTrain = {
        train: trainName,
        trainDestination: destination,
        firstTrain: startTime,
        trainFrequency: frequency
    };

    // clear the form values to allow for easier entry
    document.getElementById("trainNameInput").value = "";
    document.getElementById("destinationInput").value = "";
    document.getElementById("startTimeInput").value = "";
    document.getElementById("frequencyInput").value = "";


  });