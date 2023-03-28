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
