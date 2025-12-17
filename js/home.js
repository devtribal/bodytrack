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
bodyPart.forEach(part => {
  const partName = part.dataset.partname;

  part.addEventListener ('mousedown', () => {
    console.log('Clicked ' + partName); // remove later; for debugging
    fadeTextChange(partNameText, partName+" Measurements!")
    isSelected = true;
    selectedBodyPartText = partName+" Measurements!";

    selectedPart(part);
  })
})

// Displays the name of hovered body part

let selectedBodyPartText;
let isSelected = false;

bodyPart.forEach(part => {
  const partName = part.dataset.partname;

  part.addEventListener ('mouseenter', () => {
    console.log(partName); // remove later; for debugging
    fadeTextChange(partNameText, partName);
    part.classList.add("fill");
  })

  part.addEventListener ('mouseleave', () => {
    if (isSelected == false) {
      fadeTextChange(partNameText, "Track your measurements!")
    } else {
      fadeTextChange(partNameText, selectedBodyPartText)
    }

    part.classList.remove("fill");
  })
})
