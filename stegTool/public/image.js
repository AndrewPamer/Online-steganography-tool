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

//Set the default image for the canvases
document.querySelectorAll("canvas").forEach((canvas) => {
  const defaultImg = new Image();
  defaultImg.addEventListener("load", () => {
    const ctx = canvas.getContext("2d");
    canvas.width = defaultImg.width * 2;
    canvas.height = defaultImg.height * 2;
    ctx.drawImage(
      defaultImg,
      0,
      0,
      defaultImg.width * 2,
      defaultImg.height * 2
    );
  });
  defaultImg.src = "images/UploadIcon.svg";
});

//counter to keep track of characters in the message textbox
var messageInput = document.getElementById("messageInput");
var wordCount = document.getElementById("wordCount");
const encodeSelect = document.querySelector("#active select");
const maxChars = 10000;
var LSBMaxChars = undefined;
messageInput.addEventListener("input", () => {
  const currentChars = messageInput.value.length;
  if (encodeSelect.value == 1) {
    if (currentChars >= LSBMaxChars) {
      messageInput.value = messageInput.value.substring(0, maxChars);
    }
  } else {
    if (currentChars >= maxChars) {
      messageInput.value = messageInput.value.substring(0, maxChars);
    }
  }

  var characters = messageInput.value.split("");
  //If LSB is selected
  if (document.querySelector("#active select").value == 1) {
    wordCount.innerText = LSBMaxChars
      ? `${characters.length} / ${LSBMaxChars}`
      : `${characters.length} / `;
  }
  //Padding is selected
  else {
    wordCount.innerText = `${characters.length} / ${maxChars}`;
  }
});

//Updates the text area
function updateTextNum() {
  const txtToChange = wordCount.innerText.indexOf("/");
  if (txtToChange != -1) {
    //LSB
    if (LSBMaxChars && encodeSelect.value == 1) {
      wordCount.innerText = `${wordCount.innerText.substring(
        0,
        txtToChange
      )} / ${LSBMaxChars}`;
    } else {
      wordCount.innerText = `${wordCount.innerText.substring(
        0,
        txtToChange
      )} / ${maxChars}`;
    }
  }
}
//Update the text area when the encoding method is changed
encodeSelect.addEventListener("change", () => {
  updateTextNum();
});

// document.getElementById("messageInput").addEventListener("input", () => {
//   let encodeButton = document.getElementById("encodeButton");
//   // Enable the button if there is any text inside the textarea
//   if (messageInput.value.length > 0) {
//     encodeButton.removeAttribute("disabled");
//   } else {
//     encodeButton.setAttribute("disabled", "true");
//   }
// });

async function showImage(image) {
  try {
    //Get the img element
    const imagePreviewArea = document.querySelector("#active .image");

    document.querySelector("#active button").removeAttribute("disabled");

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

    const img = new Image();
    img.addEventListener("load", () => {
      imagePreviewArea.classList.remove("before");
      imagePreviewArea.classList.add("after");
      const ctx = imagePreviewArea.getContext("2d");
      imagePreviewArea.width = img.width;
      imagePreviewArea.height = img.height;
      if (image === encodeImageBlob) {
        LSBMaxChars = img.width * img.height * 3;
        updateTextNum();
      }
      ctx.drawImage(img, 0, 0);
    });
    img.src = readImageURL;
  } catch (error) {
    console.error(error, " : While Showing The Image");
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
    /** Encode Text **/
    const text = document.querySelector("#active textarea").value;
    const encodedText = new TextEncoder().encode(text);

    const methodSelection = document.querySelector(
      "#active #encodingMethod"
    ).value;
    var encodedImageURL;
    if (methodSelection == 1) {
      //Use canvas element for LSB
      const imageToEncode = document.querySelector("#active .image");
      const encodectx = imageToEncode.getContext("2d");

      //Get the data for each pixel (RGBA)
      const imageToEncodeData = encodectx.getImageData(
        0,
        0,
        imageToEncode.width,
        imageToEncode.height
      );

      //Encode The Image with the data
      encodedImageURL = LSBEncode(imageToEncodeData, encodedText);
    } else {
      //Use File object for padding JPG images only
      if (encodeImageBlob.type === "image/jpeg") {
        const encodeReader = await readAsArrayBuffer(encodeImageBlob);
        encodedImageURL = await paddingEncode(encodeReader, encodedText);
      } else {
        alert("File Padding encode will only work for JPG images");
        return;
      }
    }

    /** Create / Update the encoded image **/
    const imgObj = showEncodeImage(encodedImageURL);
    imgObj.addEventListener("load", () => {
      imgObj.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  } catch (error) {
    console.error(error, " : While Encoding The Image");
  }
}

async function paddingEncode(imgBuffer, txtBuffer) {
  const encodeArray = new Uint8Array([
    ...new Uint8Array(imgBuffer),
    ...txtBuffer,
  ]);

  const encodeURL = URL.createObjectURL(
    new Blob([encodeArray], { type: "image/jpeg" })
  );

  return encodeURL;
}

function LSBEncode(ImageData, txtBuffer) {
  try {
    //Get the binary of the text into one string
    binaryBuffer = "";
    for (let i = 0; i < txtBuffer.length; i++) {
      binaryBuffer += txtBuffer[i].toString(2).padStart(8, "0");
    }
    let count = 0;
    for (let i = 0; count < binaryBuffer.length; i++) {
      if ((i + 1) % 4 === 0) continue;
      else {
        ImageData.data[i] =
          (ImageData.data[i] & 0xfe) | parseInt(binaryBuffer[count]);
        count += 1;
      }
    }

    return ImageData;
  } catch (error) {
    console.error(error, " : At LSB encode");
  }
}

function showEncodeImage(imgSrc) {
  const encodeContainer = document.querySelector(".encoded-container");
  let imgObj = encodeContainer.children[1];
  let needButton = false;
  if (!imgObj) {
    encodeContainer.appendChild(document.createElement("h2")).textContent =
      "Encoded Image";
    needButton = true;
  }

  //The data coming in could be canvas data or a file.
  //if its a file
  if (typeof imgSrc === "string") {
    if (imgObj instanceof HTMLCanvasElement) {
      imgObj.remove();
      imgObj = undefined;
      encodeContainer.querySelector("button").remove();
      needButton = true;
    }

    if (!imgObj) {
      //Create the image object
      imgObj = encodeContainer.appendChild(document.createElement("img"));
      imgObj.classList.add("encodedImage");
    }
    imgObj.src = imgSrc;
  }
  //The inputted data is LSB encoded pixel data
  else {
    if (imgObj instanceof HTMLImageElement) {
      imgObj.remove();
      imgObj = undefined;
      encodeContainer.querySelector("button").remove();
      needButton = true;
    }
    if (!imgObj) {
      imgObj = encodeContainer.appendChild(document.createElement("canvas"));
      imgObj.classList.add("encodedImage");
    }
    const ctxImgObj = imgObj.getContext("2d");
    ctxImgObj.clearRect(0, 0, imgObj.width, imgObj.height);
    imgObj.width = imgSrc.width;
    imgObj.height = imgSrc.height;
    ctxImgObj.putImageData(imgSrc, 0, 0);
  }
  if (needButton) {
    //Create the Download Button
    const downloadButton = encodeContainer.appendChild(
      document.createElement("button")
    );
    downloadButton.classList.add("button");
    downloadButton.id = "download";
    downloadButton.textContent = "Download";
    downloadButton.setAttribute("onClick", "downloadImage()");
  }
  return imgObj;
}

/********** DECODING **********/

async function decodeImage() {
  try {
    //Get the area to show the decoded text
    const decodeTextArea = document.querySelector("#active textarea");

    //Check which decoded method we need to do: LSB or file padding
    let decodedText;
    if (decodeImageBlob.type === "image/jpeg") {
      //Read the image to decode as an array buffer
      const decodeReader = await readAsArrayBuffer(decodeImageBlob);

      //Read the image as a UInt8Array
      const decodeImageData = new Uint8Array(decodeReader);
      //Call file padding decode function
      decodedText = paddingDecode(decodeImageData);
      decodedText
        ? (decodeTextArea.value = decodedText)
        : alert("No Encoded Text Found!");
    } else {
      //call LSB decode function
      const imageToDecode = document.querySelector("#active .image");
      const decodectx = imageToDecode.getContext("2d");

      //Get the data for each pixel (RGBA)
      const imageToDecodeData = decodectx.getImageData(
        0,
        0,
        imageToDecode.width,
        imageToDecode.height
      );

      decodedText = await LSBdecode(imageToDecodeData.data).then((e) => {
        decodeTextArea.value = e;
      });
    }
    // Extract the bitplanes from the decoded image
    extractBitplanes(document.querySelector("#active canvas"));

    //Call the function to show the image analysis
    imageAnalysis(decodeImageBlob);
  } catch (error) {
    console.error(error, " : While Decoding The Image");
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

  const title = document.createElement("h2");
  title.textContent = "Bit Planes";
  title.style.marginTop = "0";
  title.style.marginBottom = "10px";
  bitplaneContainer.appendChild(title);

  const colors = ["Red", "Green", "Blue"];

  // const offscreen = new OffscreenCanvas(image.width, image.height);
  // const offscreenctx = offscreen.getContext("2d");
  //Three values R G B
  for (let i = 0; i < 3; i++) {
    const bitPlaneTitle = document.createElement("h3");
    bitPlaneTitle.textContent = `${colors[i]} Bit Planes`;
    bitplaneContainer.appendChild(bitPlaneTitle);

    const canvasContainer = document.createElement("div");
    canvasContainer.classList.add("canvasContainer");

    //Each value is 1 byte (8bits)
    for (let j = 0; j < 8; j++) {
      const bitplaneCanvas = document.createElement("canvas");
      bitplaneCanvas.width = image.width;
      bitplaneCanvas.height = image.height;
      bitplaneCanvas.classList.add("bitplane-canvas");

      const bitplaneCtx = bitplaneCanvas.getContext("2d", {
        willReadFrequently: true,
        // alpha: false,
      });

      const imageData = ctx.getImageData(0, 0, image.width, image.height);
      const pixels = imageData.data;

      //Loop through each pixel
      for (let k = 0; k < pixels.length; k += 4) {
        //If the bit is set, we want to set all other bits as set.
        //Setting them all to 255 will make set bits appear as white because 255 is hex for white, which may be confusing.
        //For example, An all red image will show white for red bitplanes
        //thus, we should set bitSet to the opposite of its value.
        //This will make it more inline with what is expected
        const bitSet = !((pixels[k + i] >> j) % 2);
        for (let m = 0; m < 3; m++) {
          pixels[k + m] = bitSet * 255;
        }
      }
      bitplaneCtx.putImageData(imageData, 0, 0);

      canvasContainer.appendChild(bitplaneCanvas);
    }
    bitplaneContainer.appendChild(canvasContainer);
  }

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

async function LSBdecode(decodeImageData) {
  return new Promise((resolve) => {
    const LSBDecodeWorker = new Worker("LSBdecodeworker.js");
    LSBDecodeWorker.postMessage(decodeImageData);
    LSBDecodeWorker.onmessage = function (e) {
      resolve(e.data);
      LSBDecodeWorker.terminate();
    };
  });
}

/********** ANALYSIS **********/

async function imageAnalysis(imageData) {
  try {
    imgShow = document.querySelector("#active canvas");

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
    console.error(error, " : At Image Analysis");
  }
}

function downloadImage() {
  const encodedImage = document.querySelector(".encodedImage");
  const link = document.createElement("a");
  if (encodedImage instanceof HTMLCanvasElement) {
    link.href = encodedImage.toDataURL("image/png");
    link.download = "EncodedImage.png";
  } else {
    link.href = encodedImage.src;
    link.download = "EncodedImage.jpg";
  }
  link.click();
}

/********** INPUT **********/

// Called when the user inputs and image from the 'Input Image' Button
function imageInputFromButton() {
  var fileInput = document.querySelector("#active #inputImage");
  var file = fileInput.files[0];

  if (file) {
    if (document.querySelector("#active article").className === "encoding") {
      encodeImageBlob = file;
      showImage(encodeImageBlob);
    } else {
      decodeImageBlob = file;
      showImage(decodeImageBlob);
    }
  }
}

function dropImage(event) {
  event.preventDefault();
  if (event.dataTransfer.items) {
    [...event.dataTransfer.items].forEach((item) => {
      if (item.kind == "file") {
        if (
          document.querySelector("#active article").className === "encoding"
        ) {
          encodeImageBlob = item.getAsFile();
          showImage(encodeImageBlob);
        } else {
          decodeImageBlob = item.getAsFile();
          showImage(decodeImageBlob);
        }
      }
    });
  }
}

function dragImageOver(event) {
  event.preventDefault();
}
