// Select the container element for the information popups
const infoContainer = document.querySelector('.info-container');

// Define the instructions to show in the popups
const instructions = [
  'To encode an image, select the image which you wish to encode. You can click the box below to upload an image from your device, or you can drag and drop an image into the box to upload it.',
  'Input the text you wish to encode into the image below. For LSB method, the size of the text to encoded will be limited by the size of the uploaded image. File padding method is limited to 30 characters. ',
  'Choose which encoding method you want to perform.'
];

// Create an array of CSS classes for each instruction
const cssClasses = [
  'instruction-1',
  'instruction-2',
  'instruction-3'
];

let instructionIndex = 0;
let popupsShown = false;

// Add an event listener to the container element for clicks
infoContainer.addEventListener('click', function() {
  // Check if the popups have already been shown and if the encode button is active
  if (!popupsShown && document.querySelector("#activeButton").innerText === "Encode") {
    popupsShown = true;
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.classList.add(cssClasses[instructionIndex]);

    // Create a heading for the popup and add the instruction text
    const heading = document.createElement('h2');
    heading.innerText = 'Step ' + (instructionIndex + 1);

    const instruction = document.createElement('p');
    instruction.classList.add('instruction');
    instruction.innerText = instructions[instructionIndex];

    // Create a button to go to the next instruction
    const nextButton = document.createElement('button');
    nextButton.classList.add('next-button');
    nextButton.innerText = 'Next';

    // Add an event listener to the button to show the next instruction
    nextButton.addEventListener('click', function() {
      instructionIndex++;
      if (instructionIndex < instructions.length) {
        heading.innerText = 'Step ' + (instructionIndex + 1);
        instruction.innerText = instructions[instructionIndex];
        popup.classList.remove(cssClasses[instructionIndex - 1]);
        popup.classList.add(cssClasses[instructionIndex]);
      } else {
        document.body.removeChild(popup);
      }
    });

    // Add the heading, instruction, and button to the popup
    popup.appendChild(heading);
    popup.appendChild(instruction);
    popup.appendChild(nextButton);

    // Add the popup to the document body
    document.body.appendChild(popup);
  }
});
