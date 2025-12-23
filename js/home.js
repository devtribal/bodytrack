const partNameText = document.querySelector('#partNameText');
const bodyPart = document.querySelectorAll('.body-part');

// changes the text with fade animation 
// i wont lie this was made with the help of AI but I did not copy paste
// i did my best to understand and coded it myself
function fadeTextChange(element, newText) {
  element.classList.add('fading');

  setTimeout(() => {
      element.textContent = newText;

      element.classList.remove('fading');
  }, 100);
}

// Changes/adds colour and glow to an element
function selectedPart(partName) {
  bodyPart.forEach (part => {
    part.classList.remove('fillGlow');
  })
  
  partName.classList.add('fillGlow');
}

// Changes colour and glow of clicked body part
let selectedBodyPartText;
let selectedBodyPart;

bodyPart.forEach(part => {
  const partName = part.dataset.partname;

  part.addEventListener ('click', () => {
    console.log('Clicked ' + partName); // remove later; for debugging
    fadeTextChange(partNameText, partName+" Measurements!")
    selectedBodyPartText = partName;
    selectedBodyPart = part;

    selectedPart(part);
    createList(part);
  })
})

// Displays the name of hovered body part

bodyPart.forEach(part => {
  const partName = part.dataset.partname;

  part.addEventListener ('mouseenter', () => {
    console.log(partName); // remove later; for debugging
    fadeTextChange(partNameText, partName);
    part.classList.add("fill");
  })

  part.addEventListener ('mouseleave', () => {
    if (!selectedBodyPartText) {
      fadeTextChange(partNameText, "Track your measurements!")
    } else {
      fadeTextChange(partNameText, selectedBodyPartText+" Measurements!")
    }
    
    part.classList.remove("fill");
  })
})

// Add measurements to a body part
const inputField = document.querySelector("#input");
const submitButton = document.querySelector("#submit");

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(selectedBodyPart); // remove later; for debugging
  if (inputField.value == "" || !selectedBodyPart) {
    console.log('empty measurement value or no part selected!'); // remove later; for debugging
    return;
  }
  
  let i = 0;
  while (true) {
    if (localStorage.getItem(selectedBodyPart.id+i)) {
      i++;
    } else {
      localStorage.setItem(selectedBodyPart.id+i, inputField.value);
      createList(selectedBodyPart);
      inputField.value = "";
      console.log(inputField.value); // remove later; for debugging
      break;
    }
  }
})

// Create a list entry for added measurements
const table = document.querySelector("#listOfMeasurements");
function createList(part) {
  table.innerHTML = "";
  for (let i = 0; true; i++) {
    if (localStorage.getItem(part.id + i)) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      
      td.textContent = part.dataset.partname + ": " + localStorage.getItem(part.id+i);
      
      table.appendChild(tr);
      tr.appendChild(td);
      createDeleteButton(part, i, tr);
    } else {
      break;
    }
  }
}

// Adds a delete button to delete selected items
function createDeleteButton (part, i, li) {
  const button = document.createElement("button");
  button.innerHTML = '<img src="images/remove.svg" alt="remove measurement">';
  button.classList.add('deleteButton');
  button.addEventListener("click", () => {
    localStorage.removeItem(part.id+i);
    
    while (true) {
      if (localStorage.getItem(part.id+(i+1))) {
        let v = localStorage.getItem(part.id+(i+1));
        localStorage.setItem(part.id+i, v);
        localStorage.removeItem(part.id+(i+1));
        i++;
      } else {
        break;
      }
    }
    
    createList(selectedBodyPart);
  })

  const td = document.createElement('td');
  td.appendChild(button);
  li.appendChild(td);
}
