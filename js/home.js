const partNameText = document.querySelector("#partNameText");
const bodyPart = document.querySelectorAll(".body-part");

// Changes the text with fade animation
function fadeTextChange(element, newText) {
  element.classList.add("fading");

  setTimeout(() => {
    element.textContent = newText;

    element.classList.remove("fading");
  }, 100);
}

// Changes/adds colour and glow to an element
function selectedPart(partName) {
  bodyPart.forEach((part) => {
    part.classList.remove("fillGlow");
  });

  partName.classList.add("fillGlow");
}

// Changes colour and glow of clicked body part
let selectedBodyPartText;
let selectedBodyPart;

bodyPart.forEach((part) => {
  const partName = part.dataset.partname;

  part.addEventListener("click", () => {
    console.log("Clicked " + partName); // remove later; for debugging
    fadeTextChange(partNameText, partName + " Measurements!");
    selectedBodyPartText = partName;
    selectedBodyPart = part;

    selectedPart(part);
    createList(part);
    createChart(part);
  });
});

// Deselects alls body parts upon clicking esc
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    bodyPart.forEach((part) => {
      part.classList.remove("fillGlow");
    })

    selectedBodyPartText = null;
    selectedBodyPart = null;

    partNameText.textContent = "Track your measurements!";
    table.textContent = "";
  }
});

// Displays the name of hovered body part
bodyPart.forEach((part) => {
  const partName = part.dataset.partname;

  part.addEventListener("mouseenter", () => {
    console.log(partName); // remove later; for debugging
    fadeTextChange(partNameText, partName);
    part.classList.add("fill");
  });

  part.addEventListener("mouseleave", () => {
    if (!selectedBodyPartText) {
      fadeTextChange(partNameText, "Track your measurements!");
    } else {
      fadeTextChange(partNameText, selectedBodyPartText + " Measurements!");
    }

    part.classList.remove("fill");
  });
});

// Add measurements to a body part
const inputField = document.querySelector("#input");
const submitButton = document.querySelector("#submit");

// Error Handling
let selectedUnit;
submitButton.addEventListener("click", (e) => {
  e.preventDefault();

  // Prevents error if no part selected or measurement value is empty
  console.log(selectedBodyPart); // remove later; for debugging
  if (!selectedBodyPart) {
    console.log("no part selected!"); // remove later; for debugging
    warn();
    return;
  } else if (inputField.value == "") {
    console.log("empty measurement value"); // remove later; for debugging
    return;
  }


  const now = new Date();

  // Adds measurements to localStorage with Date
  let i = 0;
  while (true) {
    if (localStorage.getItem(selectedBodyPart.id + i)) {
      i++;
    } else {
      const month = now.toLocaleString("default", { month: "short" });
      const date = now.getDate();
      const fullDate = now.toLocaleString("sv-SE", { year: "numeric", month: "numeric", day: "numeric" });

      // get selected unit
      toggleButtons.forEach((button) => {
        if (button.classList.contains("unitButtonActive")) {
          selectedUnit = button.id;
        }
      });

      const data = {
        value: inputField.value,
        unit: selectedUnit,
        month: month,
        date: date,
        fullDate: fullDate
      };

      localStorage.setItem(selectedBodyPart.id + i, JSON.stringify(data));

      createList(selectedBodyPart);
      inputField.value = "";
      console.log(inputField.value); // remove later; for debugging
      break;
    }
  }
});

// Prevents input of invalid numbers
inputField.addEventListener('keydown', (e) => {
  if (["e", "+", "-", "E"].includes(e.key)) e.preventDefault();
});

// Create a list entry for added measurements
const table = document.querySelector("#listOfMeasurements");
function createList(part) {
  table.innerHTML = "";
  for (let i = 0; true; i++) {
    if (localStorage.getItem(part.id + i)) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");

      const partData = JSON.parse(localStorage.getItem(part.id + i));
      td.textContent = `${partData.month} ${partData.date}`;

      table.appendChild(tr);
      tr.appendChild(td);
      createDeleteButton(part, i, tr, partData);
      createChart(part);
    } else {
      break;
    }
  }
}

// Creates the RHS of the list
function createDeleteButton(part, i, li, partData) {
  // creates the delete button
  const button = document.createElement("button");
  button.innerHTML = '<img src="images/remove.svg" alt="remove measurement">';
  button.classList.add("deleteButton");
  button.addEventListener("click", () => {
    localStorage.removeItem(part.id + i);

    while (true) {
      if (localStorage.getItem(part.id + (i + 1))) {
        let v = localStorage.getItem(part.id + (i + 1));
        localStorage.setItem(part.id + i, v);
        localStorage.removeItem(part.id + (i + 1));
        i++;
      } else {
        break;
      }
    }

    createList(selectedBodyPart);
  });

  const div = document.createElement("div"); // creates the RHS wrapper

  // creates the element to display the value in the list
  const valueObject = document.createElement("p");
  toggleButtons.forEach((button) => {
    if (button.classList.contains("unitButtonActive")) {
      selectedUnit = button.id;
    }
  });

  //
  let value = Number(partData.value);
  if (selectedUnit != partData.unit) {
    if (selectedUnit === "inch") {
      value = convertToInch(value);
    } else if (selectedUnit === "cm") {
      value = convertToCm(value);
    }
  }

  value = Math.round(value * 100) / 100;
  valueObject.textContent = `${value} ${selectedUnit}`

  // appends created elements
  div.classList.add("deleteButtonDiv");
  div.append(valueObject, button);
  li.appendChild(div);
}

// Highlights all body parts
function warn() {
  const allBodyParts = document.querySelectorAll(".body-part");
  allBodyParts.forEach((part) => {
    part.classList.add("fillGlow");
    partNameText.textContent = "Select a body part";

    setTimeout(() => {
      part.classList.remove("fillGlow");
      partNameText.textContent = "Track your measurements";
    }, 500);
  });
}

// Unit toggle button
const toggleButtons = document.querySelectorAll(".unitToggleButton");

toggleButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    toggleButtons.forEach((btn) => {
      btn.classList.remove("unitButtonActive");
    });

    button.classList.add("unitButtonActive");
    createList(selectedBodyPart);
  });
});

function convertToInch(value) {
  return value / 2.54;
}

function convertToCm(value) {
  return value * 2.54;
}

// Chart
const chartArea = document.getElementById('chartArea');
let progressChart = null;
let progressData = [];
function createChart(part) {
  progressData = [];
  for (let i = 0; localStorage.getItem(part.id + i) !== null; i++) {
    const partData = JSON.parse(localStorage.getItem(part.id + i));
    progressData.push({ x: partData.fullDate, y: partData.value });
  }

  if (progressData.length === 0) {
    document.getElementById("noDataText").style.display = "flex";
    document.getElementById("chart").classList.add("noDataOverlay");
    console.log('nodata'); // remove later; debug
  } else {
    document.getElementById("noDataText").style.display = "none"
    document.getElementById("chart").classList.remove("noDataOverlay");
  }
  
  if (progressChart) progressChart.destroy();
  progressChart = new Chart(document.getElementById('chart'), {
    type: 'line',
    data: {
      datasets: [{
        label: 'Progress',
        data: progressData,
        backgroundColor: 'rgba(75, 192, 192, 0.5)', // bar color
        borderColor: 'rgba(75, 192, 192, 1)', // border color
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM d'
            }
          }
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
};
