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

// Displays the name of hovered body part
bodyPart.forEach(part => {
  const partName = part.dataset.partname;

  part.addEventListener ('mouseenter', () => {
    console.log(partName); // remove later; for debugging
    fadeTextChange(partNameText, partName);
  })

  part.addEventListener ('mouseleave', () => {
    fadeTextChange(partNameText, "Track your measurements!")
  })
})


