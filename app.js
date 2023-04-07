let date = new Date().toLocaleDateString("de-DE");
let otherDate = new Date();
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
let currentDay = days[otherDate.getDay()];
let setNumber = 1;
let exerciseNumber = 1;
let benchPressLog, squatLog, deadliftLog, pullUpLog, dipsLog, legPressLog, bicepCurlLog, skullcrushersLog, lateralRaisesLog = [];
let logs = [benchPressLog, squatLog, deadliftLog, pullUpLog, dipsLog, legPressLog, bicepCurlLog, skullcrushersLog, lateralRaisesLog];
let exerciseList = ["Bench Press", "Squat", "Deadlift", "Pull Up", "Dips", "Leg Press", "Bicep Curl", "Skullcrushers", "Lateral Raises"];

let dateContainer = document.getElementById("date");
const addSetButton = document.querySelector(".add-set");
const finishExerciseButton = document.querySelector(".finish-exercise");
const displayCurrentDay = document.getElementById("current-day");
const addExerciseButton = document.querySelector(".add-exercise");
const htmlBody = document.querySelector("body");
const deleteExerciseButton = document.getElementById("delete-exercise1");
const pageIndexDiv = document.getElementById("index_html");
const pageCalenderDiv = document.getElementById("calender_html");
const pageLogDiv = document.getElementById("log_html");
const pageSpecificLogDiv = document.getElementById("specific-log_html");
const links = document.getElementsByClassName("icon");
const logsGrid = document.getElementById("logs-grid");

function togglePages(e) {
    // checks id of link tag
    let currentPage = e.target.id.substring(5);
    switch(currentPage) {
        case "index_html":
            pageCalenderDiv.style.display = "none";
            pageIndexDiv.style.display = "flex";
            pageLogDiv.style.display = "none";
            pageSpecificLogDiv.style.display = "none";
            break;
        case "log_html":
            pageCalenderDiv.style.display = "none";
            pageIndexDiv.style.display = "none";
            pageLogDiv.style.display = "flex";
            pageSpecificLogDiv.style.display = "none";
            break;
        case "calender_html":
            pageCalenderDiv.style.display = "flex";
            pageIndexDiv.style.display = "none";
            pageLogDiv.style.display = "none";
            pageSpecificLogDiv.style.display = "none";
    }
}

// switch pages
for(let i=0; i<links.length; i++) {
    let self = links[i];
    self.addEventListener("click", togglePages);
}

addSetButton.addEventListener("click", addSet);
finishExerciseButton.addEventListener("click", pushData);
addExerciseButton.addEventListener("click", addExercise);
deleteExerciseButton.addEventListener("click", deleteExercise);

dateContainer.innerHTML = date;
displayCurrentDay.innerHTML = currentDay;

function loadLogPage(){
    for(let i=0; i<exerciseList.length; i++){
        let modifiedString = exerciseList[i].replace((/\s+/g, '')).toLowerCase();

        let gridElement = document.createElement("div");
        gridElement.setAttribute("class", "log-grid-element");
        gridElement.setAttribute("id", `link-${modifiedString}_html`);
        gridElement.innerHTML = `${exerciseList[i]}`;
        gridElement.addEventListener("click", function(){
            openExerciseLog(exerciseList[i])
        });
        logsGrid.appendChild(gridElement);
    }
}
function openExerciseLog(currentExerciseName){
    // clear page
    pageSpecificLogDiv.innerHTML = "";
    pageCalenderDiv.style.display = "none";
    pageIndexDiv.style.display = "none";
    pageLogDiv.style.display = "none";
    pageSpecificLogDiv.style.display = "flex";
    let data = [];
    let keys = [];

    let allKeys = Object.keys(localStorage);
    for(let i=0; i<allKeys.length; i++){
        if(allKeys[i].includes(currentExerciseName)){
            data.push(getFromLocalStorage(allKeys[i])); // save all data in array
            keys.push(localStorage.key(i)); // save keys to delete them from localStorage if needed
        }
    }
    buildLogPageHeader(data);
    buildLogPageCards(data, keys);
    console.log(data);
}
function buildLogPageHeader(data){
    let headerDiv = document.createElement("div");
    pageSpecificLogDiv.appendChild(headerDiv);
    let headerH1 = document.createElement("h1");
    headerDiv.appendChild(headerH1);
    headerDiv.setAttribute("id", "log-header");
    headerH1.innerHTML = data[0][0][0];
}
function buildLogPageCards(data, keys){
    for(let i=0; i<data.length; i++){
        let logCard = document.createElement("div");
        let cardTitle = document.createElement("div");
        let titleContainer = document.createElement("div");
        buildLogPageCardTitle(data, logCard, cardTitle, titleContainer, i);
        buildLogPageCardDeleteButton(cardTitle, i, keys);
        for(let j=1; j<data[i].length; j++){
            let logEntry = document.createElement("div");
            buildLogPageCardEntries(data, logCard, logEntry, i, j);
        }
    }
}
function buildLogPageCardTitle(data, logCard, cardTitle, titleContainer, i){
    logCard.setAttribute("id", `log-card${i}`);
    logCard.setAttribute("class", "log-card");
    cardTitle.setAttribute("class", "card-title");
    titleContainer.setAttribute("class", "title-container");
    logCard.appendChild(cardTitle);
    cardTitle.appendChild(titleContainer);
    titleContainer.innerHTML = data[0][0][1]
    pageSpecificLogDiv.appendChild(logCard);
}
function buildLogPageCardEntries(data, logCard, logEntry, i, j){
    logEntry.setAttribute("class", "log-entry");
    logCard.appendChild(logEntry);
    logEntry.innerHTML = data[i][j][0] + "kg   x   " + data[i][j][1];
}
function buildLogPageCardDeleteButton(cardTitle, i, keys){
    let logDeleteButton = document.createElement("button");
    logDeleteButton.setAttribute("class", "delete-exercise delete-log");
    cardTitle.appendChild(logDeleteButton);
    logDeleteButton.innerHTML = "X";

    logDeleteButton.addEventListener("click", function(e){
        deleteExerciseLog(e, keys, i);
    })
}  
function deleteExerciseLog(e, keys, i){
    let key = keys[i];
    localStorage.removeItem(key);
    const deleteLogCard = document.getElementById(`log-card${i}`);
    deleteLogCard.remove();
}
function getCurrentExerciseNumber(e){
    let currentExerciseNumber = e.target.id;
    currentExerciseNumber = currentExerciseNumber.charAt(currentExerciseNumber.length - 1);
    return currentExerciseNumber;
}

function getCurrentExerciseName(e){
    let currentExerciseNumber = getCurrentExerciseNumber(e);
    let exerciseName = document.getElementById(`exercise-${currentExerciseNumber}`).value; //this ID is from the input node
    return exerciseName;
}

function changeBackgroundAfterFinish(e){
    const exerciseBody = document.getElementById(`exercise${getCurrentExerciseNumber(e)}`);
    exerciseBody.style.background = "#B9deb7";
}
// push data to local Storage
function pushData(e) {
    let exerciseName = getCurrentExerciseName(e);
    let currentExerciseNumber = getCurrentExerciseNumber(e);
    let exerciseDataArray = [];
    let exerciseLog = [];
    
    for(let i=1; i<=setNumber; i++){
        let exerciseData = document.getElementsByClassName(`${currentExerciseNumber}${i}`);
        exerciseDataArray = Array.from(exerciseData).map(t => t.value);
        exerciseLog.push(exerciseDataArray);
    }
    // insert at start of array
    exerciseLog.unshift([exerciseName, date]);
    saveToLocalStorage(exerciseLog, exerciseName);
    changeBackgroundAfterFinish(e);
}

function saveToLocalStorage(exerciseLog, exerciseName) {
    let date = new Date();
    let key = exerciseName + " " + date;
    localStorage.setItem(`${key}`, JSON.stringify(exerciseLog));
}

function getFromLocalStorage(key) {
    let data = JSON.parse(localStorage.getItem(`${key}`));
    return data;
}

function deleteExercise(e) {
    exerciseNumber--;
    let deleteExerciseDiv = document.getElementById(`exercise${getCurrentExerciseNumber(e)}`);
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

    // add key: "exerciseNumber + setNumber" for later reference
    kgInput.classList.add(`${exerciseNumber}${setNumber}`);
    repsInput.classList.add(`${exerciseNumber}${setNumber}`);
    newDiv.innerHTML = `${setNumber}`;
    okButton.innerHTML = "X";

    exercisePage.appendChild(newDiv);
    exercisePage.appendChild(kgInput);
    exercisePage.appendChild(repsInput);
    exercisePage.appendChild(okButton);
}

function addExercise() {
    setNumber = 1;
    exerciseNumber++;
    console.log(exerciseNumber);
    // create new exercise Card
    // by creating nodes first
    // MAKE THIS UGLY MESS PRETTIER PLEASE!
    let createExerciseDiv = document.createElement("div");
    createExerciseDiv.setAttribute("class", "exercise");
    createExerciseDiv.setAttribute("id", `exercise${exerciseNumber}`);

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

    // create suggestions for input field
    for(let i=0; i<exerciseList.length; i++) {
        let createOption = document.createElement("option");
        createOption.setAttribute("value", exerciseList[i]);
        createOption.innerHTML = exerciseList[i];

        createDatalist.appendChild(createOption);
    }

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
    createKgDiv.setAttribute("class", "kg");
    createKgDiv.innerHTML = "kg";

    const createRepsDiv = document.createElement("div");
    createRepsDiv.setAttribute("class", "reps");
    createRepsDiv.innerHTML = "Reps";

    const createBlankDiv = document.createElement("div");
    createBlankDiv.setAttribute("class", "blank");

    const createSetNumber = document.createElement("div");
    createSetNumber.innerHTML = "1";

    const createInputKg = document.createElement("input");
    createInputKg.setAttribute("type", "number");
    createInputKg.setAttribute("class", `kg-input ${exerciseNumber}${setNumber}`);
    const createInputReps = document.createElement("input");
    createInputReps.setAttribute("type", "number");
    createInputReps.setAttribute("class", `reps-input ${exerciseNumber}${setNumber}`);

    const createDeleteSetButton = document.createElement("button");
    createDeleteSetButton.innerHTML = "X";

    const createButtonContainer = document.createElement("div");
    createButtonContainer.setAttribute("class", "button-container");

    const createAddSetButton = document.createElement("button");
    createAddSetButton.setAttribute("class", "add-set");
    createAddSetButton.setAttribute("id", `add-set${exerciseNumber}`)
    createAddSetButton.innerHTML = "+ Set";

    const createFinishExerciseButton = document.createElement("button");
    createFinishExerciseButton.setAttribute("class", "finish-exercise");
    createFinishExerciseButton.setAttribute("id", `finish-exercise${exerciseNumber}`);
    createFinishExerciseButton.innerHTML = "Finish";

    //then creating html document structure
    pageIndexDiv.appendChild(createExerciseDiv);
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
            createLogDiv.appendChild(createSetNumber);
            createLogDiv.appendChild(createInputKg);
            createLogDiv.appendChild(createInputReps);
            createLogDiv.appendChild(createDeleteSetButton);
         createExerciseDiv.appendChild(createButtonContainer);
            createButtonContainer.appendChild(createAddSetButton);
    createButtonContainer.appendChild(createFinishExerciseButton);

    createAddSetButton.addEventListener("click", addSet);
    createDeleteExerciseButton.addEventListener("click", deleteExercise);
    createFinishExerciseButton.addEventListener("click", pushData);
}
loadLogPage();
