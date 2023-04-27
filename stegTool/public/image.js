//These two variables hold the files for the two uploaded images
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

document.getElementById("messageInput").addEventListener("input", () => {
  let encodeButton = document.getElementById("encodeButton");
  // Enable the button if there is any text inside the textarea
  if (messageInput.value.length > 0) {
    encodeButton.removeAttribute("disabled");
  } else {
    encodeButton.setAttribute("disabled", "true");
  }
});

async function showImage(image) {
  try {
    //Get the img element
    const imagePreviewArea = document.querySelector("#active .image");

    //Read the image as a data url
    const readImageURL = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        resolve(reader.result);
      });
      reader.addEventListener("error", (error) => {
        reject(error);
      });
      reader.readAsDataURL(image);
    });

    //Set the class of the image to be after
    imagePreviewArea.classList.remove("before");
    imagePreviewArea.classList.add("after");

    //Set the source of the image
    imagePreviewArea.src = readImageURL;
  } catch (error) {
    console.log(error, " : While Showing The Image");
  }
}

//Reads a file and returns it as an array buffer
function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve(reader.result);
    });
    reader.addEventListener("error", (error) => {
      reject(error);
    });
    reader.readAsArrayBuffer(file);
  });
}

/********** ENCODING **********/

async function encodeImage() {
  try {
    const encodeReader = await readAsArrayBuffer(encodeImageBlob);

    /** Encode Text **/
    const text = document.querySelector("#active textarea").value;
    const encodedText = new TextEncoder().encode(text);

    /** File Padding Encoding **/
    var combinedBuffers = paddingEncode(encodeReader, encodedText);

    /** Create new image **/
    const encodedImageURL = URL.createObjectURL(
      new Blob([combinedBuffers], { type: "image/jpg" })
    );

    /** Create / Update the encoded image **/
    const imgObj = showEncodeImage(encodedImageURL);
    imgObj.addEventListener("load", () => {
      imgObj.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  } catch (error) {
    console.log(error, " : While Encoding The Image");
  }
}

function paddingEncode(imgBuffer, txtBuffer) {
  return new Uint8Array([...new Uint8Array(imgBuffer), ...txtBuffer]);
}

function LSB(imgBuffer, txtxBuffer) {
  //TODO
}

function showEncodeImage(imgSrc) {
  const encodeContainer = document.querySelector(".encoded-container");
  let imgObj = encodeContainer.querySelector("img");
  if (!imgObj) {
    //Create the "Encoded Image" Text
    encodeContainer.appendChild(document.createElement("h2")).textContent =
      "Encoded Image";

    //Create the image object
    imgObj = encodeContainer.appendChild(document.createElement("img"));
    imgObj.classList.add("encodedImage");

    //Create the Download Button
    const downloadButton = encodeContainer.appendChild(
      document.createElement("button")
    );
    downloadButton.classList.add("button");
    downloadButton.id = "download";
    downloadButton.textContent = "Download";
    downloadButton.setAttribute("onClick", "downloadImage()");
  }
  //Set the source of the image
  imgObj.src = imgSrc;
  return imgObj;
}

/********** DECODING **********/

async function decodeImage() {
  try {
    //Read the image to decode as an array buffer
    const decodeReader = await readAsArrayBuffer(decodeImageBlob);

    //Read the image as a UInt8Array
    const decodeImageData = new Uint8Array(decodeReader);

    //Get the area to show the decoded text
    const decodeTextArea = document.querySelector("#active textarea");

    //Check which decoded method we need to do: LSB or file padding
    let decodedText;
    if (decodeImageData[decodeImageData.length - 1] !== 217) {
      //Call file padding decode function
      decodedText = paddingDecode(decodeImageData);
    } else {
      //call LSB decode function
      //This function will also check if there isn't any decoded text
      decodedText = LSBdecode(decodeImageData);
    }
    // Extract the bitplanes from the decoded image
    const decodedImage = new Image();
    decodedImage.onload = function() {
      extractBitplanes(decodedImage);
    };
    decodedImage.src = URL.createObjectURL(decodeImageBlob);
    //show the decoded text if there is any
    if (decodedText) {
      decodeTextArea.value = decodedText;
    } else {
      //Tell the user if no encoded data is found
      alert("Could not find any encoded data!");
    }

    //Call the function to show the image analysis
    imageAnalysis(decodeImageBlob);
  } catch (error) {
    console.log(error, " : While Decoding The Image");
  }
}

function extractBitplanes(image) {
  // New canvas created to draw the bitplaes
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const bitplaneContainer = document.createElement("div");
  bitplaneContainer.id = "bitplanes";
  bitplaneContainer.style.display = "flex";
  bitplaneContainer.style.flexDirection = "column"; 
  bitplaneContainer.style.alignItems = "center";
  bitplaneContainer.style.justifyContent = "flex-start";

  const title = document.createElement("h2");
  title.textContent = "Bit-Map";
  title.style.marginTop = "0";
  title.style.marginBottom = "10px";
  bitplaneContainer.appendChild(title);

  const canvasContainer = document.createElement("div");
  canvasContainer.style.display = "flex";
  canvasContainer.style.flexDirection = "row"; 
  canvasContainer.style.alignItems = "center";
  canvasContainer.style.justifyContent = "flex-start";

  // Create a canvas for each bitplane and append it to the bitplane container
  for (let i = 0; i < 8; i++) {
    const bitplaneCanvas = document.createElement("canvas");
    bitplaneCanvas.width = image.width;
    bitplaneCanvas.height = image.height;
    bitplaneCanvas.style.width = "100px";
    bitplaneCanvas.style.height = "100px";
    bitplaneCanvas.style.marginRight = "15px"; 
    bitplaneCanvas.classList.add("bitplane-canvas");
    const bitplaneCtx = bitplaneCanvas.getContext("2d");

    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const pixels = imageData.data;
    for (let j = 0; j < pixels.length; j += 4) {
      const pixelValue = pixels[j];
      const bitValue = (pixelValue >> i) & 1;
      pixels[j] = bitValue * 255;
      pixels[j + 1] = bitValue * 255;
      pixels[j + 2] = bitValue * 255;
    }
    bitplaneCtx.putImageData(imageData, 0, 0);

    canvasContainer.appendChild(bitplaneCanvas);
  }

  bitplaneContainer.appendChild(canvasContainer);

  // Remove any previous bitplane containers before appending the new one
  const previousBitplaneContainer = document.getElementById("bitplanes");
  if (previousBitplaneContainer) {
    previousBitplaneContainer.remove();
  }
  const active = document.getElementById("active");
  active.appendChild(bitplaneContainer);
}





function paddingDecode(decodeImageData) {
  const startOfText = decodeImageData.lastIndexOf(217);
  const decodedText = new TextDecoder().decode(
    decodeImageData.subarray(startOfText + 1)
  );
  return decodedText;
}

function LSBdecode(decodeImageData) {}

/********** ANALYSIS **********/

async function imageAnalysis(imageData) {
  try {
    //Create a new Image from the data
    const imgShow = await new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => {
        resolve(img);
      });
      img.addEventListener("error", (error) => {
        reject(error);
      });
      img.src = URL.createObjectURL(decodeImageBlob);
    });

    //Get the metadata
    const metadata = [
      ["Filename", imageData.name],
      ["File size", imageData.size + " bytes"],
      ["File type", imageData.type],
      ["Last modified", new Date(imageData.lastModified).toLocaleString()],
      ["Width", imgShow.width + " pixels"],
      ["Height", imgShow.height + " pixels"],
    ];

    //Get the container to show the meta data
    const decodedContainer = document.querySelector(".decoded-container");

    //Add the elements if they are not there
    if (!decodedContainer.children.length) {
      //Create the header
      decodedContainer.appendChild(document.createElement("h2")).textContent =
        "Image Analysis";

      //Create the table
      const table = decodedContainer.appendChild(
        document.createElement("table")
      );
      table.id = "metadataTable";

      //Add data to the table
      for (const [key, value] of metadata) {
        const row = table.insertRow();
        row.insertCell(0).textContent = key;
        row.insertCell(1).textContent = value;
      }
    } else {
      //The table already exists so we update it.
      const table = decodedContainer.querySelector("table");
      for (var i = 0; i < table.rows.length; i++) {
        table.rows[i].querySelectorAll("td")[1].textContent = metadata[i][1];
      }
    }
    decodedContainer
      .querySelector("table")
      .scrollIntoView({ behavior: "smooth", block: "end" });
  } catch (error) {
    console.log(error, " : At Image Analysis");
  }
}

function downloadImage() {
  const encodedImage = document.querySelector(".encodedImage");
  const link = document.createElement("a");
  link.download = "encodedImage.jpg";
  link.href = encodedImage.src;
  link.click();
}

/********** INPUT **********/

// Called when the user inputs and image from the 'Input Image' Button
function imageInputFromButton() {
  var fileInput = document.querySelector("#active #inputImage");
  var file = fileInput.files[0];

  // Check if the file is a JPG,JPEG, or JFIF
  if (file) {
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
        encodeImageBlob = file;
        showImage(encodeImageBlob);
      } else {
        decodeImageBlob = file;
        showImage(decodeImageBlob);
      }
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
          encodeImageBlob = item.getAsFile();
          showImage(encodeImageBlob);
        } else {
          decodeImageBlob = item.getAsFile();
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
