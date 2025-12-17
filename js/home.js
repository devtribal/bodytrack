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
  localStorage.setItem(selectedBodyPart.getAttribute("id"), inputField.value);
})
