//For when the user clicks one of the navigation menu buttons
function navPage(showPage) {
  let active = document.querySelector("#active");
  let inactive = document.querySelector("#inactive");
  if (showPage === "Encode") {
    if (inactive.className === "encoding") {
      active.id = "inactive";
      inactive.id = "active";
    }
  } else {
    if (inactive.className === "decoding") {
      active.id = "inactive";
      inactive.id = "active";
    }
  }
}

//Previews the inputted image
function showImage(image) {
  console.log(image);
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
      // imageModifyTest(imagePreviewArea.src);
    },
    false
  );
}

//TEST FUNCTION
/*
function imageModifyTest(img) {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  console.log(img.src);
  let image = new Image();
  image.onload = () => {
    ctx.drawImage(image, 0, 0);
    var data = ctx.getImageData(0, 0, 500, 500);
    console.log(data);
  };
  image.src = img;
}
*/
//Called when the user inputs and image from the 'Input Image' Button
function imageInputFromButton() {
  //Calls the function to show image
  showImage(document.querySelector("#active #inputImage").files[0]);
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
