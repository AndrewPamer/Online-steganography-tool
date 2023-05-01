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

    const img = new Image();
    img.addEventListener("load", () => {
      imagePreviewArea.classList.remove("before");
      imagePreviewArea.classList.add("after");
      const ctx = imagePreviewArea.getContext("2d");
      imagePreviewArea.width = img.width;
      imagePreviewArea.height = img.height;
      ctx.drawImage(img, 0, 0);
    });
    img.src = readImageURL;
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
      //Use File object for padding
      const encodeReader = await readAsArrayBuffer(encodeImageBlob);
      encodedImageURL = await paddingEncode(encodeReader, encodedText);
    }
    console.log(encodedImageURL);

    /** Create / Update the encoded image **/
    const imgObj = showEncodeImage(encodedImageURL);
    console.log(imgObj);
    imgObj.addEventListener("load", () => {
      imgObj.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  } catch (error) {
    console.log(error, " : While Encoding The Image");
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

  // console.log(encodeArray);
  // const k = await imagetest(encodeArray, document.createElement("canvas"));
  // console.log(k);
  // return k;
  // const encodeURL = URL.createObjectURL(
  //   new Blob([encodeArray], { type: "image/jpeg" })
  // );
  // const img = new Image();
  // img.addEventListener("load", () => {
  //   const canvas = document.createElement("canvas");
  //   canvas.width = img.width;
  //   canvas.height = img.height;
  //   const ctx = canvas.getContext("2d");
  //   ctx.drawImage(img, 0, 0);
  //   return ctx.getImageData(0, 0, canvas.width, canvas.height);
  // });
  // img.src = encodeURL;
}

function imagetest(imageSource, canvas) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => {
      canvas.width = img.width;
      canvas.height = img.height;
      // console.log(canvas.width, canvas.height);

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      resolve(imageData);
    });
    img.addEventListener("error", () => {
      reject(error);
    });
    img.src = URL.createObjectURL(
      new Blob([imageSource], { type: "image/jpg" })
    );
  });
}

function LSBEncode(ImageData, txtBuffer) {
  try {
    console.log(ImageData.data);
    //Get the binary of the text into one string
    binaryBuffer = "";
    for (let i = 0; i < txtBuffer.length; i++) {
      binaryBuffer += txtBuffer[i].toString(2).padStart(8, "0");
    }
    // console.log(ImageData);
    let count = 0;
    for (let i = 0; i < binaryBuffer.length; i++) {
      if ((i + 1) % 4 === 0) continue;
      else {
        ImageData.data[i] =
          (ImageData.data[i] & 0xfe) | parseInt(binaryBuffer[count]);
        count++;
      }
    }

    console.log(ImageData.data);

    return ImageData;
  } catch (error) {
    console.error(error, " : At LSB encode");
  }
}

function showEncodeImage(imgSrc) {
  const encodeContainer = document.querySelector(".encoded-container");
  //The data coming in could be canvas data or a file.
  if (typeof imgSrc === "string") {
  }
  //The inputted data is LSB encoded pixel data
  else {
  }

  let imgObj = encodeContainer.querySelector("canvas");
  if (!imgObj) {
    encodeContainer.appendChild(document.createElement("h2")).textContent =
      "Encoded Image";

    imgObj = encodeContainer.appendChild(document.createElement("canvas"));
    imgObj.classList.add("encodedImage");
    imgObj.width = imgSrc.width;
    imgObj.height = imgSrc.height;

    const ctxImgObj = imgObj.getContext("2d");
    ctxImgObj.putImageData(imgSrc, 0, 0);
    console.log(imgObj.toDataURL("image/jpeg", 0.8));

    const downloadButton = encodeContainer.appendChild(
      document.createElement("button")
    );
    downloadButton.classList.add("button");
    downloadButton.id = "download";
    downloadButton.textContent = "Download";
    downloadButton.setAttribute("onClick", "downloadImage()");
  }

  // let imgObj = encodeContainer.querySelector("img");
  // if (!imgObj) {
  //   //Create the "Encoded Image" Text
  //   encodeContainer.appendChild(document.createElement("h2")).textContent =
  //     "Encoded Image";

  //   //Create the image object
  //   imgObj = encodeContainer.appendChild(document.createElement("img"));
  //   imgObj.classList.add("encodedImage");

  //   //Create the Download Button
  //   const downloadButton = encodeContainer.appendChild(
  //     document.createElement("button")
  //   );
  //   downloadButton.classList.add("button");
  //   downloadButton.id = "download";
  //   downloadButton.textContent = "Download";
  //   downloadButton.setAttribute("onClick", "downloadImage()");
  // }
  // //Set the source of the image
  // imgObj.src = imgSrc;
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
    decodedImage.onload = function () {
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

async function LSBdecode(decodeImageData) {
  const canvas = document.createElement("canvas");
  const data = await imagetest(decodeImageData, canvas);
  console.log(data);
  decodeBuffer = "";
  for (let i = 0; i < 20; i++) {
    if ((i + 1) % 4 === 0) continue;
    else {
      console.log(data[i]);
      decodeBuffer += data[i] & 1;
    }
  }
  console.log(decodeBuffer);
}

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

  link.href = encodedImage.toDataURL("image/png");
  link.download = "EncodedImage.png";
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
