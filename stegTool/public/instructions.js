const infoContainer = document.querySelector('.info-container');

const encodeInstructions = [
  'To encode an image, select the image which you wish to encode. You can click the box below to upload an image from your device, or you can drag and drop an image into the box to upload it.',
  'Input the text you wish to encode into the image below. For LSB method, the size of the text to encoded will be limited by the size of the uploaded image. File padding method is limited to 30 characters. ',
  'Choose which encoding method you want to perform.',
  'Press the encode image button to download your new encyrpted image.'
];

const encodeCssClasses = [
  'instruction-1',
  'instruction-2',
  'instruction-3',
  'instruction-4'
];

const decodeInstructions = [
  'To decode an image, select the image which you wish to decode. You can click the box below to upload an image from your device, or you can drag and drop an image into the box to upload it.',
  'Once you press the Decode button, any encoded text will be displayed along with the metadata and bitplanes of the image.'
];

const decodeCssClasses = [
  'dinstruction-1',
  'dinstruction-2'
];

let instructionIndex = 0;
let popupsShown = false;

infoContainer.addEventListener('click', function() {
  if (!popupsShown) {
    popupsShown = true;
    const popup = document.createElement('div');
    popup.classList.add('popup');

    let instructions, cssClasses;

    if (document.querySelector("#activeButton").innerText === "Encode") {
      instructions = encodeInstructions;
      cssClasses = encodeCssClasses;
    } else {
      instructions = decodeInstructions;
      cssClasses = decodeCssClasses;
    }

    popup.classList.add(cssClasses[instructionIndex]);

    const heading = document.createElement('h2');
    heading.innerText = 'Step ' + (instructionIndex + 1);

    const instruction = document.createElement('p');
    instruction.classList.add('instruction');
    instruction.innerText = instructions[instructionIndex];

    const nextButton = document.createElement('button');
    nextButton.classList.add('next-button');
    nextButton.innerText = 'Next';

    nextButton.addEventListener('click', function() {
      instructionIndex++;
      if (instructionIndex < instructions.length) {
        heading.innerText = 'Step ' + (instructionIndex + 1);
        instruction.innerText = instructions[instructionIndex];
        popup.classList.remove(cssClasses[instructionIndex - 1]);
        popup.classList.add(cssClasses[instructionIndex]);
      } else {
        document.body.removeChild(popup);
        instructionIndex = 0; 
      }
      
      if (instructionIndex >= instructions.length) {
        instructionIndex = 0;
      }
    });

    popup.appendChild(heading);
    popup.appendChild(instruction);
    popup.appendChild(nextButton);

    document.body.appendChild(popup);
  }
});

const encodeButton = document.querySelector('#encodeButton');
const decodeButton = document.querySelector('#decodeButton');

encodeButton.addEventListener('click', function() {
  popupsShown = false;
});

decodeButton.addEventListener('click', function() {
  popupsShown = false;
});

document.addEventListener('click', function() {
  popupsShown = false;
});
