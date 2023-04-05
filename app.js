let date = new Date().toLocaleDateString("de-DE");
let setNumber = 1;
let exerciseNumber = 1;

let benchPressList = [];
// test


let dateContainer = document.getElementById("date");
const addSetButton = document.getElementById("add-set");
const exercisePage = document.getElementsByClassName("log");
const finishExerciseButton = document.getElementById("finish-exercise");

addSetButton.addEventListener("click", addSet);
finishExerciseButton.addEventListener("click", pushData);

function pushData() {
    let exerciseName = document.getElementById("exercise-input").value;
    let exerciseDataArray = []
    for(let i=1; i<=setNumber; i++){
        let exerciseData = document.getElementsByClassName(`${i}`);
        exerciseDataArray = Array.from(exerciseData).map(t => t.value);
        benchPressList.push(exerciseDataArray);
    }
    benchPressList.unshift([date,exerciseName]);
    console.log(benchPressList);
}

function addSet() {
    setNumber++;

    const newDiv = document.createElement("div");
    const kgInput = document.createElement("input");
    const repsInput = document.createElement("input");
    const okButton = document.createElement("button");

    kgInput.classList.add(`${setNumber}`);
    repsInput.classList.add(`${setNumber}`);
    newDiv.innerHTML = `${setNumber}`;
    okButton.innerHTML = "X";

    exercisePage[0].appendChild(newDiv);
    exercisePage[0].appendChild(kgInput);
    exercisePage[0].appendChild(repsInput);
    exercisePage[0].appendChild(okButton);

}
dateContainer.innerHTML = date;