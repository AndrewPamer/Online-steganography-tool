//For when the user clicks one of the navigation menu buttons
function navPage(showPage) {
  let active = document.querySelector("#active");
  let inactive = document.querySelector("#inactive");
  console.log(active, inactive);
  if (showPage === "Encode") {
    if (inactive.childNodes[0].className === "encoding") {
      active.id = "inactive";
      inactive.id = "active";
    }
  } else {
    if (inactive.childNodes[0].className === "decoding") {
      active.id = "inactive";
      inactive.id = "active";
    }
  }
}

var publicImage;
//Previews the inputted image
function showImage(image) {
  publicImage = image;
  // console.log(image);
  //Where the image preview will show
  const imagePreviewArea = document.querySelector("#active .image");
  console.log(imagePreviewArea);
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

function encodeImage() {
  const dataReader = new FileReader();
  if (publicImage) {
    dataReader.readAsArrayBuffer(publicImage);
  }

  dataReader.addEventListener(
    "load",
    () => {
      //Get the text input
      const text = document.querySelector("#active textarea").value;
      //Text encoder for the inputted text
      const encoder = new TextEncoder();
      //Encode the text into Uint8Array
      const encodedText = encoder.encode(text);

      //Combine the Uint8Arrays of the image and the text
      var combinedBuffers = new Uint8Array([
        ...new Uint8Array(dataReader.result),
        ...encodedText,
      ]);
      //Create URL image from the buffer
      const encodedImageURL = URL.createObjectURL(
        new Blob([combinedBuffers], { type: "image/jpg" })
      );

      //Create a new image object and set the source to the image
      const encodeContainer = document.querySelector(".encoded-container");
      const encodeHeader = encodeContainer.appendChild(
        document.createElement("h2")
      );
      encodeHeader.textContent = "Encoded Image";

      const imgObj = encodeContainer.appendChild(document.createElement("img"));
      imgObj.classList.add("encodedImage");
      imgObj.src = encodedImageURL;

      const downloadButton = encodeContainer.appendChild(
        document.createElement("button")
      );
      downloadButton.classList.add("button");
      downloadButton.id = "download";
      downloadButton.textContent = "Download";
      downloadButton.setAttribute("onClick", "downloadImage()");

      imgObj.addEventListener("load", () => {
        imgObj.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    },
    false
  );
}

function decodeImage() {
  const imageToDecode = document.querySelector("#active #inputImage").files[0];
  const decodeTextArea = document.querySelector("#active textarea");
  const decodeReader = new FileReader();
  if (imageToDecode) {
    decodeReader.readAsArrayBuffer(imageToDecode);
  }

  decodeReader.addEventListener("load", () => {
    const data = new Uint8Array(decodeReader.result);
    //Get to the FF D8 at the end of a jpg header
    const lastIndex = data.lastIndexOf(217);
    if (lastIndex != -1) {
      const text = new TextDecoder().decode(data.subarray(lastIndex + 1));
      if (text === "") {
        alert("Could not find any encoded data!");
      }
      decodeTextArea.value = text;
    } else {
      alert("Error with decoding the image");
      return;
    }
  });
}

function downloadImage() {
  // const downloadButton = document.querySelector("#active #download")
  // downloadButton.addEventListener
  const downloadLink = document.createElement("a");
  downloadLink.href = document.querySelector(
    "#active .encoded-container img"
  ).src;
  downloadLink.download = "encodedImage.jpg";
  downloadLink.click();
  console.log(downloadLink);
}

//Called when the user inputs and image from the 'Input Image' Button
function imageInputFromButton() {
  var fileInput = document.querySelector('#active #inputImage');
  var file = fileInput.files[0];
    
  // Check if the file is a JPG,JPEG, or JFIF
  var fileName = file.name;
  var fileExtension = fileName.split('.').pop().toLowerCase();
    
  if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' &&fileExtension !== 'jfif') {
    alert('Please select a JPG or JPEG image file.');
    fileInput.value = '';
    return;
  }
  else{
    //If file is correct, show image 
    showImage(document.querySelector("#active #inputImage").files[0]);
  }
}

function dropImage(event) {
  event.preventDefault();
  if (event.dataTransfer.items) {
    [...event.dataTransfer.items].forEach((item) => {
      if (item.kind == "file" && (item.type === "image/jpeg" || item.type === "image/jpg")) {
        showImage(item.getAsFile());
      } else {
        alert('Please select a JPG or JPEG image file.');
      }
    });
  }
}

function dragImageOver(event) {
  event.preventDefault();
}
