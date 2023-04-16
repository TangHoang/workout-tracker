
let date = new Date().toLocaleDateString("de-DE", {dateStyle: "medium"});
let otherDate = new Date();
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let currentDay = days[otherDate.getDay()];
let setNumber = 1;
let exerciseNumber = 1;
const exerciseKey = "workouts";
let exerciseList = ["Bench Press", "Squat", "Deadlift", "Pull Up", "Dips", "Leg Press", "Bicep Curl", "Skullcrushers", "Lateral Raises"];
let exerciseObject = getFromLocalStorage(exerciseKey);
if(exerciseObject === null){
    exerciseObject = { "Bench Press": [], "Squat": [], "Deadlift": [], "Pull Up": [], "Dips": [], "Leg Press": [], "Bicep Curl": [], "Skullcrushers": [], "Lateral Raises": [] };
    localStorage.setItem(exerciseKey, JSON.stringify(exerciseObject));
}
let dayLogObject = getFromLocalStorage("dayKey");
if(dayLogObject === null){
    // init object with todays date
    let dayLogObject = {};
    dayLogObject[date] = [];
    localStorage.setItem("dayKey", JSON.stringify(dayLogObject));
}
// dayLogObject["12.04.2023"] = [{date: "12.04.2023, 12:50", sets: [["120", "5"]], exerciseName: "Bench Press"}];
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
const pageSpecificDayLogDiv = document.getElementById("specific-daylog_html");
const links = document.getElementsByClassName("icon");
const logsGrid = document.getElementById("logs-grid");

// switch pages
for (let i = 0; i < links.length; i++) {
    let self = links[i];
    self.addEventListener("click", togglePages);
}

addSetButton.addEventListener("click", addSet);
finishExerciseButton.addEventListener("click", pushData);
addExerciseButton.addEventListener("click", addExercise);
deleteExerciseButton.addEventListener("click", deleteExercise);

dateContainer.innerHTML = date;
displayCurrentDay.innerHTML = currentDay;

function togglePages(e) {
    // checks id of link tag
    let currentPage = e.target.id.substring(5);
    switch (currentPage) {
        case "index_html":
            pageCalenderDiv.style.display = "none";
            pageSpecificDayLogDiv.style.display = "none";
            pageIndexDiv.style.display = "flex";
            pageLogDiv.style.display = "none";
            pageSpecificLogDiv.style.display = "none";
            break;
        case "log_html":
            pageCalenderDiv.style.display = "none";
            pageSpecificDayLogDiv.style.display = "none";
            pageIndexDiv.style.display = "none";
            pageLogDiv.style.display = "flex";
            pageSpecificLogDiv.style.display = "none";
            break;
        case "calender_html":
            pageCalenderDiv.style.display = "flex";
            pageSpecificDayLogDiv.style.display = "none";
            pageIndexDiv.style.display = "none";
            pageLogDiv.style.display = "none";
            pageSpecificLogDiv.style.display = "none";
            loadCalenderPage();
    }
}

function loadLogPage() {
    for (let i = 0; i < exerciseList.length; i++) {
        let modifiedString = exerciseList[i].replace((/\s+/g, '')).toLowerCase();

        let gridElement = document.createElement("div");
        gridElement.setAttribute("class", "log-grid-element");
        gridElement.setAttribute("id", `link-${modifiedString}_html`);
        gridElement.innerHTML = `${exerciseList[i]}`;
        gridElement.addEventListener("click", function () {
            openExerciseLog(exerciseList[i])
        });
        logsGrid.appendChild(gridElement);
    }
}

function loadCalenderPage() {
    const calenderButtons = document.getElementsByClassName("fc-button");
    const fcChunks = document.getElementsByClassName("fc-toolbar-chunk");
    for(let i=0; i<calenderButtons.length; i++){
        let element = calenderButtons[i];
        let chunk = fcChunks[i];
        element.style.padding = "0 0.7em";
        chunk.style.minWidth = "50px";
        chunk.addEventListener("click", addCalenderEventListeners);
    }
    addCalenderEventListeners();
}

function addCalenderEventListeners() {
    let currentDayLogObject = JSON.parse(localStorage.getItem("dayKey"));
    let dayLogKeys = Object.keys(currentDayLogObject);
    for(const datekey of dayLogKeys){
        formattedDate = datekey.split(".").reverse().join(".").replaceAll(".", "-"); // turning dd.mm.yyyy to yyyy-mm-dd to find the calendar cell
        const calendarCell = document.querySelector(`[data-date="${formattedDate}"]`);
        if(calendarCell !== null){
            calendarCell.addEventListener("click", function(){
                openDayLog(datekey);
            });
            calendarCell.style.backgroundColor = "mediumseagreen";
        }
    }
    return;
}

function openDayLog(currentDate){
    pageSpecificDayLogDiv.innerHTML = ""; // clear page
    pageCalenderDiv.style.display = "none";
    pageSpecificDayLogDiv.style.display = "flex";
    // build header
    let headerDiv = document.createElement("div");
    pageSpecificDayLogDiv.appendChild(headerDiv);
    let headerH1 = document.createElement("h1");
    headerDiv.appendChild(headerH1);
    headerDiv.setAttribute("class", "log-header");
    headerH1.innerHTML = currentDate;
    let data = [];
    let dayLogObject = getFromLocalStorage("dayKey");
    for (let i = 0; i < dayLogObject[currentDate].length; i++) {
        data.push(dayLogObject[currentDate][i]); // save all data in array (array of objects)        
    }

    buildDayLogPageCards(data, currentDate);
}

function buildDayLogPageCards(data, currentDate){
    for (let i = 0; i < data.length; i++) {
        let logCard = document.createElement("div");
        let cardTitle = document.createElement("div");
        let titleContainer = document.createElement("div");
        let currentExerciseName = data[i]["exerciseName"];
        buildDayLogPageCardTitle(data, logCard, cardTitle, titleContainer, i, currentDate);
        buildLogPageCardDeleteButton(data, currentExerciseName, cardTitle, i);
        for (let j = 0; j < data[i]["sets"].length; j++) {
            let logEntry = document.createElement("div");
            buildDayLogPageCardEntries(data, logCard, logEntry, i, j);
        }
    }
}

function buildDayLogPageCardTitle(data, logCard, cardTitle, titleContainer, i, currentDate){
    logCard.setAttribute("class", "log-card");
    cardTitle.setAttribute("class", "card-title");
    titleContainer.setAttribute("class", "title-container");
    logCard.appendChild(cardTitle);
    cardTitle.appendChild(titleContainer);
    let currentExerciseName = data[i]["exerciseName"];
    titleContainer.innerHTML = currentExerciseName;
    pageSpecificDayLogDiv.appendChild(logCard);
}

function buildDayLogPageCardEntries(data, logCard, logEntry, i, j){
    logEntry.setAttribute("class", "log-entry");
    logCard.appendChild(logEntry);
    logEntry.innerHTML = data[i]["sets"][j][0] + "kg   x   " + data[i]["sets"][j][1];
}

function openExerciseLog(currentExerciseName) {
    pageSpecificLogDiv.innerHTML = "";      // clear page
    pageCalenderDiv.style.display = "none";
    pageIndexDiv.style.display = "none";
    pageLogDiv.style.display = "none";
    pageSpecificLogDiv.style.display = "flex";
    let data = [];

    for (let i = 0; i < exerciseObject[currentExerciseName].length; i++) {
        data.push(exerciseObject[currentExerciseName][i]); // save all data in array (array of objects)        
    }
    buildLogPageHeader(data, currentExerciseName);
    buildLogPageCards(data, currentExerciseName);
}

function buildLogPageHeader(data, currentTitle) {
    let headerDiv = document.createElement("div");
    pageSpecificLogDiv.appendChild(headerDiv);
    let headerH1 = document.createElement("h1");
    headerDiv.appendChild(headerH1);
    headerDiv.setAttribute("class", "log-header");
    if (data.length == 0) {
        headerH1.innerHTML = "<br />" + "empty...";
        return;
    }
    headerH1.innerHTML = currentTitle;
}

function buildLogPageCards(data, currentExerciseName) {
    for (let i = 0; i < data.length; i++) {
        let logCard = document.createElement("div");
        let cardTitle = document.createElement("div");
        let titleContainer = document.createElement("div");
        buildLogPageCardTitle(data, logCard, cardTitle, titleContainer, i, currentExerciseName);
        buildLogPageCardDeleteButton(data, currentExerciseName, cardTitle, i);
        for (let j = 0; j < data[i]["sets"].length; j++) {
            let logEntry = document.createElement("div");
            buildLogPageCardEntries(data, logCard, logEntry, i, j);
        }
    }
}

function buildLogPageCardTitle(data, logCard, cardTitle, titleContainer, i) {
    logCard.setAttribute("id", data[i]["date"]);
    logCard.setAttribute("class", "log-card");
    cardTitle.setAttribute("class", "card-title");
    titleContainer.setAttribute("class", "title-container");
    logCard.appendChild(cardTitle);
    cardTitle.appendChild(titleContainer);
    titleContainer.innerHTML = data[i]["date"];
    pageSpecificLogDiv.appendChild(logCard);
}

function buildLogPageCardEntries(data, logCard, logEntry, i, j) {
    logEntry.setAttribute("class", "log-entry");
    logCard.appendChild(logEntry);
    logEntry.innerHTML = data[i]["sets"][j][0] + "kg   x   " + data[i]["sets"][j][1];
}

function buildLogPageCardDeleteButton(data, currentExerciseName, cardTitle, i) {
    let logDeleteButton = document.createElement("button");
    logDeleteButton.setAttribute("class", "delete-exercise delete-log");
    cardTitle.appendChild(logDeleteButton);
    logDeleteButton.innerHTML = "X";

    logDeleteButton.addEventListener("click", function () {
        deleteExerciseLog(data, currentExerciseName, i);
    })
}

function deleteExerciseLog(data, currentExerciseName, i) {
    // delete on log page
    let tempLog = JSON.parse(localStorage.getItem(exerciseKey));
    let filteredLog = tempLog[currentExerciseName].filter(entry => entry["date"] != data[i]["date"]);
    tempLog[currentExerciseName] = filteredLog;
    localStorage.setItem(exerciseKey, JSON.stringify(tempLog));

    // delete on dayLog page
    let tempDayLog = JSON.parse(localStorage.getItem("dayKey"));
    let currentDay = data[i]["date"].substring(0, 10);
    let filteredDayLog = tempDayLog[currentDay].filter(entry => entry["exerciseName"] != currentExerciseName);
    tempDayLog[currentDay] = filteredDayLog;
    localStorage.setItem("dayKey", JSON.stringify(tempDayLog));

    const deleteLogCard = document.getElementById(data[i]["date"]);
    if(deleteLogCard !== null){
        deleteLogCard.remove();
    }
    else{
        openDayLog(currentDay);
    }
}

// push data to local Storage
function pushData(e) {
    // for logs
    let exerciseName = getCurrentExerciseName(e);
    let currentExerciseNumber = getCurrentExerciseNumber(e);
    let exerciseDataArray = [];
    let exerciseLog = [];

    for (let i = 1; i <= setNumber; i++) {
        let exerciseData = document.getElementsByClassName(`${currentExerciseNumber}${i}`);
        exerciseDataArray = Array.from(exerciseData).map(t => t.value);
        exerciseLog.push(exerciseDataArray);
    }
    saveToLocalStorage(exerciseLog, exerciseName);
    // for calender
    localStorage.setItem("dayKey", JSON.stringify(dayLogObject));
    getExercisesOnDay();
    changeBackgroundAfterFinish(e);
}

function saveToLocalStorage(exerciseLog, exerciseName) {
    exerciseObject[exerciseName].push({ date: new Date().toLocaleString("de-DE", {dateStyle: "medium", timeStyle: "short"}), sets: exerciseLog });
    localStorage.setItem(exerciseKey, JSON.stringify(exerciseObject));
}

function getFromLocalStorage(key) {
    let data = JSON.parse(localStorage.getItem(key));
    return data;
}

function getExercisesOnDay(){
    let currentExerciseObject = JSON.parse(localStorage.getItem(exerciseKey));
    let exerciseKeys = Object.keys(currentExerciseObject);
    let currentDayLogObject = JSON.parse(localStorage.getItem("dayKey"));
    let dayLogKeys = Object.keys(currentDayLogObject);
    for (const dateKey of dayLogKeys){
        for(const key of exerciseKeys){
            for(let i=0; i<currentExerciseObject[key].length; i++){
                if(currentExerciseObject[key][i]["date"].includes(dateKey)){
                    currentExerciseObject[key][i].exerciseName = key;
                    currentDayLogObject[dateKey].push(currentExerciseObject[key][i]);
                }
            } 
        }   
    }
    localStorage.setItem("dayKey", JSON.stringify(currentDayLogObject));  
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
    // const okButton = document.createElement("button");
    const blankDiv = document.createElement("div");

    // add key: "exerciseNumber + setNumber" for later reference
    kgInput.classList.add(`${exerciseNumber}${setNumber}`);
    repsInput.classList.add(`${exerciseNumber}${setNumber}`);
    newDiv.innerHTML = `${setNumber}`;
    // okButton.innerHTML = "X";

    exercisePage.appendChild(newDiv);
    exercisePage.appendChild(kgInput);
    exercisePage.appendChild(repsInput);
    // exercisePage.appendChild(okButton);
    exercisePage.appendChild(blankDiv);
}

function addExercise() {
    setNumber = 1;
    exerciseNumber++;
    // create new exercise Card
    let templateString = `<div class="exercise" id="exercise${exerciseNumber}"> 
                                <div class="exercise-control"> 
                                    <div class="text-container">
                                        <input type="text" list="exerciseList" placeholder="Enter Here" class="exercise-input" id="exercise-${exerciseNumber}">
                                    </div>
                                    <button class="save-exercise" id="save-exercise${exerciseNumber}"> OK </button>
                                    <button class="delete-exercise" id="delete-exercise${exerciseNumber}"> X </button>
                                </div>
                                <div class="log" id="log-${exerciseNumber}">
                                    <div class="set"> Set </div>
                                    <div class="kg"> kg </div>
                                    <div class="reps"> Reps </div>
                                    <div class="blank"> </div>
                                    <div> 1 </div>
                                    <input type="" class="kg-input ${exerciseNumber}${setNumber}">
                                    <input type="" class="reps-input ${exerciseNumber}${setNumber}">
                                    <div class="blank"> </div>
                                </div>
                                <div class="button-container">
                                    <button class="add-set" id="add-set${exerciseNumber}"> + Set </button>
                                    <button class="finish-exercise" id="finish-exercise${exerciseNumber}"> Finish </button>
                                </div>
                          </div>          
                        `;
    pageIndexDiv.insertAdjacentHTML("beforeend", templateString);

    const createAddSetButton = document.getElementById(`add-set${exerciseNumber}`);
    createAddSetButton.addEventListener("click", addSet);
    const createDeleteExerciseButton = document.getElementById(`delete-exercise${exerciseNumber}`);
    createDeleteExerciseButton.addEventListener("click", deleteExercise);
    const createFinishExerciseButton = document.getElementById(`finish-exercise${exerciseNumber}`)
    createFinishExerciseButton.addEventListener("click", pushData);
}

function getCurrentExerciseNumber(e) {
    let currentExerciseNumber = e.target.id;
    currentExerciseNumber = currentExerciseNumber.charAt(currentExerciseNumber.length - 1);
    return currentExerciseNumber;
}

function getCurrentExerciseName(e) {
    let currentExerciseNumber = getCurrentExerciseNumber(e);
    let exerciseName = document.getElementById(`exercise-${currentExerciseNumber}`).value; //this ID is from the input node
    return exerciseName;
}

function changeBackgroundAfterFinish(e) {
    const exerciseBody = document.getElementById(`exercise${getCurrentExerciseNumber(e)}`);
    exerciseBody.style.background = "#B9deb7";

}

loadLogPage();

