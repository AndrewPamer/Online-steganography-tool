//Where the image preview will show
const imagePreviewArea = document.querySelector(".image");
var inputImage = new Image();

//Previews the inputted image
function showImage(image) {
  const reader = new FileReader();
  if (image) {
    //Read the image as a file
    inputImage = reader.readAsDataURL(image);
  }

  //Event listener for when the image loads
  reader.addEventListener(
    "load",
    () => {
      imagePreviewArea.classList.remove("before");
      imagePreviewArea.classList.add("after");
      imagePreviewArea.src = reader.result;
    },
    false
  );
}

//Called when the user inputs and image from the 'Input Image' Button
function imageInputFromButton() {
  //Calls the function to show image
  showImage(document.querySelector("#inputImage").files[0]);
}

function dropImage(event) {
  event.preventDefault();
  if (event.dataTransfer.items) {
    console.log(event.dataTransfer.items);
    [...event.dataTransfer.items].forEach((item) => {
      if (item.kind == "file" && item.type.match(/image/)) {
        console.log(item);
        showImage(item.getAsFile());
      }
    });
  }
}

function dragImageOver(event) {
  console.log("file in area");
  event.preventDefault();
}


var messageInput = document.getElementById("messageInput");
var wordCount = document.getElementById("wordCount");

messageInput.addEventListener("keyup",function(){
    var characters = messageInput.value.split('');
    wordCount.innerText = characters.length;
});


const changeToEncode = document.getElementById("changeToEncode");
const changeToDecode = document.getElementById("changeToDecode");
const encodeStuff = document.getElementById("encodeStuff");
const decodeStuff = document.getElementById("decodeStuff");
changeToEncode.addEventListener("click", function() { 
    if(encodeStuff.style.display === "none" || decodeStuff.style.display === "block") {
        encodeStuff.style.display = "block";
        decodeStuff.style.display = "none";
    }
});
changeToDecode.addEventListener("click", function() {
    if(decodeStuff.style.display === "none" || encodeStuff.style.display === "block"){
        decodeStuff.style.display = "block";
        encodeStuff.style.display = "none";
    }
});


function encodeStart() {
    var selectElement = document.getElementById("encodingMethod");
    var selectedValue = selectElement.value;
  
    switch(selectedValue) {
      case "Option1":
        console.log("LSB");
        break;
      case "Option2":
        encodeFilePad();
        
        break;
      default:
        break;
    }
  }

  function encodeFilePad() {
    const blob = new Blob([inputImage], { type: "image/jpeg" });
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    var text = document.getElementById("messageInput");
    let bits = "";
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        for (let j = 7; j >= 0; j--) {
        bits += ((charCode >> j) & 1) + "";
        }
    }
    reader.onload = function() {
      const buffer = reader.result;
      console.log(buffer);
      const view = new DataView(buffer);
      const length = view.byteLength;
      const newBuffer = new ArrayBuffer(length + bits.length);
      const newView = new DataView(newBuffer);
  
      for (let i = 0; i < length; i++) {
        newView.setUint8(i, view.getUint8(i));
      }
  
      for (let i = 0; i < bits.length; i++) {
        newView.setUint8(length + i, bits[i]);
      }
    console.log(newBuffer);
      const modifiedImage = new Image([newBuffer]);
  
       // Create a data URL for the modified image
    const dataURL = URL.createObjectURL(modifiedImage);

    // Create a link element to download the modified image
    const link = document.createElement("a");
    link.download = "modified_image.jpg";
    link.href = dataURL;

    // Simulate a click on the link to download the modified image
    link.click();

    // Redirect the user to a new page that displays the modified image
    window.location.href = "imageDownload.jade?src=" + encodeURIComponent(dataURL);
    };
  }
  