let date = new Date().toLocaleDateString("de-DE");
let setNumber = 1;
let dateContainer = document.getElementById("date");
const addSetButton = document.getElementById("add-set");
const exercisePage = document.getElementsByClassName("log");

addSetButton.addEventListener("click", addSet);



function addSet() {
    setNumber++;

    const newDiv = document.createElement("div");
    const kgInput = document.createElement("input");
    const repsInput = document.createElement("input");
    const okButton = document.createElement("button");

    newDiv.innerHTML = `${setNumber}`;
    okButton.innerHTML = "OK";

    exercisePage[0].appendChild(newDiv);
    exercisePage[0].appendChild(kgInput);
    exercisePage[0].appendChild(repsInput);
    exercisePage[0].appendChild(okButton);

}
dateContainer.innerHTML = date;