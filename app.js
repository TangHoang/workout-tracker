let date = new Date().toLocaleDateString("de-DE");
let otherDate = new Date();
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
let currentDay = days[otherDate.getDay()];
let setNumber = 1;
let exerciseNumber = 1;
let benchPressList = [];

let dateContainer = document.getElementById("date");
const addSetButton = document.getElementById("add-set");
const exercisePage = document.getElementsByClassName("log");
const finishExerciseButton = document.getElementById("finish-exercise");
const displayCurrentDay = document.getElementById("current-day");

addSetButton.addEventListener("click", addSet);
finishExerciseButton.addEventListener("click", pushData);

dateContainer.innerHTML = date;
displayCurrentDay.innerHTML = currentDay;


function pushData() {
    let exerciseName = document.getElementById("exercise-input").value;
    let exerciseDataArray = []
    for(let i=1; i<=setNumber; i++){
        // iterate through sets
        let exerciseData = document.getElementsByClassName(`${i}`);
        // get values of Nodes
        exerciseDataArray = Array.from(exerciseData).map(t => t.value);
        benchPressList.push(exerciseDataArray);
    }
    // insert at start of array
    benchPressList.unshift([date,exerciseName]);
    console.log(benchPressList);
    saveToLocalStorage(benchPressList, date, exerciseName);
    getFromLocalStorage();
}

function saveToLocalStorage(benchPressList, date, exerciseName) {
    let key = date + " " + exerciseName;
    localStorage.setItem(`${key}`, JSON.stringify(benchPressList));
}

function getFromLocalStorage(key) {
    let data = JSON.parse(localStorage.getItem(`${key}`));
}

function addSet() {
    setNumber++;

    const newDiv = document.createElement("div");
    const kgInput = document.createElement("input");
    const repsInput = document.createElement("input");
    const okButton = document.createElement("button");

    // add key: "setNumber" for later reference
    kgInput.classList.add(`${setNumber}`);
    repsInput.classList.add(`${setNumber}`);
    newDiv.innerHTML = `${setNumber}`;
    okButton.innerHTML = "X";

    exercisePage[0].appendChild(newDiv);
    exercisePage[0].appendChild(kgInput);
    exercisePage[0].appendChild(repsInput);
    exercisePage[0].appendChild(okButton);

}
