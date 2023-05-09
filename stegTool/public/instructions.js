const infoContainer = document.querySelector(".info-container");

const encodeInstructions = [
  "Select an image to encode, upload it from your device, or drag and drop it into the box.",
  "Enter your text to encode below. LSB method size is limited by the size of the uploaded image, while file padding method has a 10000 character limit.",
  "Choose your encoding method: File padding encoding only works with JPG image files, while LSB works with any image file.",
  "Press the encode image button below to generate your encoded image!",
];

const decodeInstructions = [
  "Select an image to decode, upload it from your device, or drag and drop it into the box.",
  "Once you press the Decode button, any encoded text will be displayed along with the metadata and bitplanes of the image.",
];

let instructionIndex = 0;
let popupsShown = false;

infoContainer.addEventListener("click", function () {
  console.log(popupsShown);
  const encodeElements = [
    document.querySelector("#active .image-container"),
    document.querySelector("#active .message-input"),
    document.querySelector("#active .encode-input"),
    document.querySelector("#active #encodeButton"),
  ];
  const decodeElements = [
    document.querySelector("#active .image-container"),
    document.querySelector("#active .message-container"),
  ];
  if (!popupsShown) {
    popupsShown = true;
    const popup = document.createElement("div");
    popup.classList.add("popup");

    let instructions, elements;

    if (document.querySelector("#activeButton").innerText === "Encode") {
      instructions = encodeInstructions;
      elements = encodeElements;
    } else {
      instructions = decodeInstructions;
      elements = decodeElements;
    }

    const popupContent = document.createElement("div");
    popupContent.classList.add("popupcontent");

    const heading = document.createElement("h2");
    heading.innerText = "Step " + (instructionIndex + 1);

    const instruction = document.createElement("p");
    instruction.classList.add("instruction");
    instruction.innerText = instructions[instructionIndex];

    const nextButton = document.createElement("button");
    nextButton.classList.add("next-button");
    nextButton.innerText = "Next";

    nextButton.addEventListener("click", function () {
      instructionIndex++;
      if (instructionIndex < instructions.length) {
        heading.innerText = "Step " + (instructionIndex + 1);
        instruction.innerText = instructions[instructionIndex];
        popup.remove();
        elements[instructionIndex].appendChild(popup);
      } else {
        popup.remove();
        instructionIndex = 0;
        popupsShown = false;
      }

      if (instructionIndex >= instructions.length) {
        instructionIndex = 0;
      }
    });

    popupContent.appendChild(heading);
    popupContent.appendChild(instruction);
    popupContent.appendChild(nextButton);
    popup.appendChild(popupContent);
    elements[instructionIndex].appendChild(popup);
  }
});
