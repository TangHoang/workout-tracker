let date = new Date().toLocaleDateString("de-DE");
let otherDate = new Date();
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
let currentDay = days[otherDate.getDay()];
let setNumber = 1;
let exerciseNumber = 1;
let benchPressList = [];
let exerciseList = ["Bench Press", "Squat", "Deadlift", "Pull Up", "Dips", "Leg Press", "Bicep Curl", "Skullcrushers", "Lateral Raises"];

let dateContainer = document.getElementById("date");
const addSetButton = document.querySelector(".add-set");
const finishExerciseButton = document.querySelector(".finish-exercise");
const displayCurrentDay = document.getElementById("current-day");
const addExerciseButton = document.getElementById("add-exercise");
const htmlBody = document.querySelector("body");
const deleteExerciseButton = document.getElementById("delete-exercise1");

addSetButton.addEventListener("click", addSet);
finishExerciseButton.addEventListener("click", pushData);
addExerciseButton.addEventListener("click", addExercise);
deleteExerciseButton.addEventListener("click", deleteExercise);

dateContainer.innerHTML = date;
displayCurrentDay.innerHTML = currentDay;

function getCurrentExerciseNumber(e){
    let currentExerciseNumber = e.target.id;
    currentExerciseNumber = currentExerciseNumber.charAt(currentExerciseNumber.length - 1);
    return currentExerciseNumber;
}

function pushData() {
    let exerciseName = document.getElementById("exercise-").value;
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

    const exerciseBody = document.getElementById(`exercise-${exerciseNumber}`);
    exerciseBody.style.background = "#B9deb7";
}

function saveToLocalStorage(benchPressList, date, exerciseName) {
    let key = date + " " + exerciseName;
    localStorage.setItem(`${key}`, JSON.stringify(benchPressList));
}

function getFromLocalStorage(key) {
    let data = JSON.parse(localStorage.getItem(`${key}`));
}

function deleteExercise(e) {
    exerciseNumber--;
    let deleteExerciseDiv = document.getElementById(`exercise-${getCurrentExerciseNumber(e)}`);
    deleteExerciseDiv.replaceChildren();
    deleteExerciseDiv.remove();
}

function addSet(e) {
    const exercisePage = document.getElementById(`log-${getCurrentExerciseNumber(e)}`);

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

    exercisePage.appendChild(newDiv);
    exercisePage.appendChild(kgInput);
    exercisePage.appendChild(repsInput);
    exercisePage.appendChild(okButton);
    
}

function addExercise() {
    setNumber = 0;
    exerciseNumber++;
    console.log(exerciseNumber);
    // create new exercise Card
    // by creating nodes first
    let createExerciseDiv = document.createElement("div");
    createExerciseDiv.setAttribute("class", "exercise");
    createExerciseDiv.setAttribute("id", `exercise-${exerciseNumber}`);

    const createExerciseControlDiv = document.createElement("div");
    createExerciseControlDiv.setAttribute("class", "exercise-control");

    const createTextContainerDiv = document.createElement("div");
    createTextContainerDiv.setAttribute("class", "text-container");

    const createInputDiv = document.createElement("input");
    createInputDiv.setAttribute("type", "text");
    createInputDiv.setAttribute("list", "exerciseList");
    createInputDiv.setAttribute("placeholder", "Enter Here");
    createInputDiv.setAttribute("class", "exercise-input");
    createInputDiv.setAttribute("id", `exercise-${exerciseNumber}`);

    const createDatalist = document.createElement("datalist");
    createDatalist.setAttribute("id", "exerciseList");

    const createSaveExerciseButton = document.createElement("button");
    createSaveExerciseButton.setAttribute("class", "save-exercise");
    createSaveExerciseButton.setAttribute("id", `save-exercise${exerciseNumber}`);
    createSaveExerciseButton.innerHTML = "OK";

    const createDeleteExerciseButton = document.createElement("button");
    createDeleteExerciseButton.setAttribute("class", "delete-exercise");
    createDeleteExerciseButton.setAttribute("id", `delete-exercise${exerciseNumber}`);
    createDeleteExerciseButton.innerHTML = "X";
   
    const createLogDiv = document.createElement("div");
    createLogDiv.setAttribute("class", "log");
    createLogDiv.setAttribute("id", `log-${exerciseNumber}`);

    const createSetDiv = document.createElement("div");
    createSetDiv.setAttribute("class", "set");
    createSetDiv.innerHTML = "Set";

    const createKgDiv = document.createElement("div");
    createKgDiv.setAttribute("class", "reps");
    createKgDiv.innerHTML = "kg";

    const createRepsDiv = document.createElement("div");
    createRepsDiv.setAttribute("class", "blank");
    createRepsDiv.innerHTML = "Reps";
    const createBlankDiv = document.createElement("div");

    const createButtonContainer = document.createElement("div");
    createButtonContainer.setAttribute("class", "button-container");
    
    const createAddSetButton = document.createElement("button");
    createAddSetButton.setAttribute("class", "add-set");
    createAddSetButton.setAttribute("id", `add-set${exerciseNumber}`)
    createAddSetButton.innerHTML = "+ Set";

    const createFinishExerciseButton = document.createElement("button");
    createFinishExerciseButton.setAttribute("class", "finish-exercise");
    createFinishExerciseButton.setAttribute("id", `add-set${exerciseNumber}`);
    createFinishExerciseButton.innerHTML = "Finish";
    
    //then creating html document structure
    htmlBody.appendChild(createExerciseDiv);
        createExerciseDiv.appendChild(createExerciseControlDiv);
            createExerciseControlDiv.appendChild(createTextContainerDiv);
                createTextContainerDiv.appendChild(createInputDiv);
                createTextContainerDiv.appendChild(createDatalist);
            createExerciseControlDiv.appendChild(createSaveExerciseButton);
            createExerciseControlDiv.appendChild(createDeleteExerciseButton);
        createExerciseDiv.appendChild(createLogDiv);
            createLogDiv.appendChild(createSetDiv);
            createLogDiv.appendChild(createKgDiv);
            createLogDiv.appendChild(createRepsDiv);
            createLogDiv.appendChild(createBlankDiv);
         createExerciseDiv.appendChild(createButtonContainer);  
            createButtonContainer.appendChild(createAddSetButton);
    createButtonContainer.appendChild(createFinishExerciseButton);


    const newAddSetButton = document.getElementById(`finish-exercise${exerciseNumber}`);
    const newFinishExerciseButton = document.getElementById(`finish-exercise${exerciseNumber}`);
    createAddSetButton.addEventListener("click", addSet);
    createDeleteExerciseButton.addEventListener("click", deleteExercise);
}
