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

document.getElementById("messageInput").addEventListener("input",  () => {
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
      })
      reader.addEventListener("error", (error) => {
        reject(error);
      })
      reader.readAsDataURL(image);
    })
    
    //Set the class of the image to be after
    imagePreviewArea.classList.remove("before");
    imagePreviewArea.classList.add("after");

    //Set the source of the image
    imagePreviewArea.src = readImageURL;
  }
  catch(error) {
    console.error(error);
  }
}


//Reads a file and returns it as an array buffer
function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve(reader.result);
    })
    reader.addEventListener("error", (error) => {
      reject(error);
    })
    reader.readAsArrayBuffer(file);
  })
}

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
    const imgObj = showEncodeImage(encodedImageURL)
    imgObj.addEventListener("load", () => {
      imgObj.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }
  catch(error) {
    console.error(error);
  }
}

function paddingEncode(imgBuffer, txtBuffer) {
  return new Uint8Array([
    ...new Uint8Array(imgBuffer),
    ...txtBuffer,
  ]);
}

function LSB(imgBuffer, txtxBuffer) {
  //TODO
}

function showEncodeImage(imgSrc) {
  const encodeContainer = document.querySelector(".encoded-container");
  let imgObj = encodeContainer.querySelector("img");
  if(!imgObj) {
    //Create the "Encoded Image" Text
    encodeContainer.appendChild(
      document.createElement("h2")
    ).textContent = "Encoded Image";

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

// function encodeImage() {
//   // document.getElementById("encodeButton").disabled = true;
//   const dataReader = new FileReader();
//   if (encodeImageBlob) {
//     dataReader.readAsArrayBuffer(encodeImageBlob);
//   }

//   dataReader.addEventListener(
//     "load",
//     () => {
//       //Get the text input
//       const text = document.querySelector("#active textarea").value;
//       //Text encoder for the inputted text
//       const encoder = new TextEncoder();
//       //Encode the text into Uint8Array
//       const encodedText = encoder.encode(text);
//       console.log(text);

//       //Combine the Uint8Arrays of the image and the text
//       var combinedBuffers = new Uint8Array([
//         ...new Uint8Array(dataReader.result),
//         ...encodedText,
//       ]);
//       //Create URL image from the buffer
//       const encodedImageURL = URL.createObjectURL(
//         new Blob([combinedBuffers], { type: "image/jpg" })
//       );

//       //Get the container for the encoded image
//       const encodeContainer = document.querySelector(".encoded-container");

//       //variable for the img elment
//       var imgObj;
//       //Check if the element has been created yet
//       if(encodeContainer.querySelector("h2")) {
//         encodeContainer.querySelector("img").src = encodedImageURL;
//         imgObj = encodeContainer.querySelector("img");
//       }
//       else {
//         const encodeHeader = encodeContainer.appendChild(
//           document.createElement("h2")
//         );
//         encodeHeader.textContent = "Encoded Image";

//         imgObj = encodeContainer.appendChild(document.createElement("img"));
//         imgObj.classList.add("encodedImage");
//         imgObj.src = encodedImageURL;

//         const downloadButton = encodeContainer.appendChild(
//           document.createElement("button")
//         );
//         downloadButton.classList.add("button");
//         downloadButton.id = "download";
//         downloadButton.textContent = "Download";
//         downloadButton.setAttribute("onClick", "downloadImage()");
//       }

//       imgObj.addEventListener("load", () => {
//         imgObj.scrollIntoView({ behavior: "smooth", block: "end" });
//       });
//     },
//     false
//   );
// }


async function decodeImage() {
  try {
    //Read the image to decode as an array buffer
    const decodeReader = await readAsArrayBuffer(decodeImageBlob);

    //Get the area to show the decoded text
    const decodeTextArea = document.querySelector("#active textarea");

    //Check which decoded method we need to do: LSB or file 
    let decodedText;
    if(/*File padding */) {
      //Call file padding decode function
      decodedText = paddingDecode(decodeReader);
    }
    else {
      //call LSB decode function
      //This function will also check if there isn't any decoded text
      decodedText = LSBdecode(decodeReader);
    }
    //set the decodeTextArea to the decoded text returned by a function if there is any


    //Call the function to show the image analysis
    imageAnalysis();
  }
  catch(error) {
    console.error(error);
  }
}
function decodeImage() {
  // document.getElementById("decodeButton").disabled = true;
  // const imageToDecode = document.querySelector("#active #inputImage").files[0];
  const imageToDecode = decodeImageBlob;
  console.log(imageToDecode);
  // const imageToDecode = new File([decodeImageBlob], "t.jpg", {type: "image/jpg"});
  const decodeTextArea = document.querySelector("#active textarea");
  const decodeReader = new FileReader();

  if (decodeImageBlob) {
    decodeReader.readAsArrayBuffer(decodeImageBlob);
  }

  decodeReader.addEventListener("load", () => {
    console.log(decodeReader);
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
        const decodedContainer = document.querySelector(".decoded-container");
        //Check if the table is already created
        var metadata;
        if(decodedContainer.querySelector("h1")) {
          metadata = [
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
          const table = decodedContainer.querySelector("table");
          for(var i = 0; i < table.rows.length; i++) {
            table.rows[i].querySelectorAll("td")[1].textContent = metadata[i][1];
          }
          
        }
        else {
          const title = document.createElement("h1");
          title.textContent = "Image Analysis";
          title.style.textAlign = "center";
          decodedContainer.appendChild(title);
          // Table created
          const table = document.createElement("table");
          table.id = "metadataTable";
          decodedContainer.appendChild(table);
          metadata = [
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
        }
      });
      img.src = URL.createObjectURL(decodeImageBlob);
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
