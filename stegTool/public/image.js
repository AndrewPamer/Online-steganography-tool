//These two variables hold the data for the two uploaded images
let encodeImageBlob = null;
let decodeImageBlob = null;

//For when the user clicks one of the navigation menu buttons
function navPage(showPage) {
  let active = document.querySelector("#active");
  let inactive = document.querySelector("#inactive");

  let activeButton = document.querySelector("#activeButton");
  let inactiveButton = document.querySelector("#inactiveButton");

  if (showPage === "Encode") {
    if (inactive.querySelector("article").className === "encoding") {
      active.id = "inactive";
      activeButton.id = "inactiveButton";
      inactive.id = "active";
      inactiveButton.id = "activeButton";
    }
  } else {
    if (inactive.querySelector("article").className === "decoding") {
      active.id = "inactive";
      activeButton.id = "inactiveButton";
      inactive.id = "active";
      inactiveButton.id = "activeButton";
    }
  }
}

//Previews the inputted image
function showImage(image) {
  //Where the image preview will show
  const imagePreviewArea = document.querySelector("#active .image");
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
var messageInput = document.getElementById("messageInput");
var encodeButton = document.getElementById("encodeButton");

messageInput.addEventListener("input", function () {
  // Enable the button if there is any text inside the textarea
  if (messageInput.value.length > 0) {
    encodeButton.removeAttribute("disabled");
  } else {
    encodeButton.setAttribute("disabled", "true");
  }
});

function encodeImage() {
  document.getElementById("encodeButton").disabled = true;
  const dataReader = new FileReader();
  if (encodeImageBlob) {
    dataReader.readAsArrayBuffer(encodeImageBlob);
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
  // document.getElementById("decodeButton").disabled = true;
  const imageToDecode = document.querySelector("#active #inputImage").files[0];
  const decodeTextArea = document.querySelector("#active textarea");
  const decodeReader = new FileReader();

  if (decodeImageBlob) {
    decodeReader.readAsArrayBuffer(decodeImageBlob);
  }

  decodeReader.addEventListener("load", () => {
    const data = new Uint8Array(decodeReader.result);
    const lastIndex = data.lastIndexOf(217);
    if (lastIndex != -1) {
      const text = new TextDecoder().decode(data.subarray(lastIndex + 1));
      if (text === "") {
        alert("Could not find any encoded data!");
      }
      decodeTextArea.value = text;
      const img = new Image();
      img.addEventListener("load", () => {
        const title = document.createElement("h1");
        title.textContent = "Image Analysis";
        title.style.textAlign = "center";
        document.body.appendChild(title);
        // Table created
        const table = document.createElement("table");
        table.id = "metadataTable";
        document.body.appendChild(table);

        // Outputted metadata
        const metadata = [
          ["Filename", imageToDecode.name],
          ["File size", imageToDecode.size + " bytes"],
          ["File type", imageToDecode.type],
          [
            "Last modified",
            new Date(imageToDecode.lastModified).toLocaleString(),
          ],
          ["Width", img.width + " pixels"],
          ["Height", img.height + " pixels"],
        ];
        for (const [key, value] of metadata) {
          const row = table.insertRow();
          const cell1 = row.insertCell(0);
          const cell2 = row.insertCell(1);
          cell1.textContent = key;
          cell2.textContent = value;
        }
      });
      img.src = URL.createObjectURL(imageToDecode);
    } else {
      alert("Error with decoding the image");
      return;
    }
  });
}

function downloadImage() {
  const downloadLink = document.createElement("a");
  downloadLink.href = document.querySelector(
    "#active .encoded-container img"
  ).src;
  downloadLink.download = "encodedImage.jpg";
  downloadLink.click();
  console.log(downloadLink);
}

/********** INPUT **********/

// Called when the user inputs and image from the 'Input Image' Button
function imageInputFromButton() {
  var fileInput = document.querySelector("#active #inputImage");
  var file = fileInput.files[0];

  // Check if the file is a JPG,JPEG, or JFIF
  var fileName = file.name;
  var fileExtension = fileName.split(".").pop().toLowerCase();

  if (
    fileExtension !== "jpg" &&
    fileExtension !== "jpeg" &&
    fileExtension !== "jfif"
  ) {
    alert("Please select a JPG or JPEG image file.");
    fileInput.value = "";
    return;
  } else {
    //If file is correct, show image
    if (document.querySelector("#active article").className === "encoding") {
      encodeImageBlob = new Blob([file], { type: file.type });
      showImage(encodeImageBlob);
    } else {
      decodeImageBlob = new Blob([file], { type: file.type });
      showImage(decodeImageBlob);
    }
  }
}

function dropImage(event) {
  event.preventDefault();
  if (event.dataTransfer.items) {
    [...event.dataTransfer.items].forEach((item) => {
      if (
        item.kind == "file" &&
        (item.type === "image/jpeg" || item.type === "image/jpg")
      ) {
        if (
          document.querySelector("#active article").className === "encoding"
        ) {
          encodeImageBlob = new Blob([item.getAsFile()], {
            type: item.getAsFile().type,
          });
          showImage(encodeImageBlob);
        } else {
          decodeImageBlob = new Blob([item.getAsFile()], {
            type: item.getAsFile().type,
          });
          showImage(decodeImageBlob);
        }
      } else {
        // alert("Please select a JPG or JPEG image file.");
      }
    });
  }
}

function dragImageOver(event) {
  event.preventDefault();
}
