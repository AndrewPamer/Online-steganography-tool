//Where the image preview will show
const imagePreviewArea = document.querySelector(".image");

//Previews the inputted image
function showImage(image) {
  const reader = new FileReader();
  if (image) {
    //Read the image as a file
    reader.readAsDataURL(image);
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
        console.log("File Padding");
        break;
      default:
        break;
    }
  }