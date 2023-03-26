//Where the image preview will show
const imageShow = document.querySelector(".image");

//Called when the user inputs and image from the 'Input Image' Button
function imageInputFromButton() {
  //Calls the function to show image
  showImage(document.querySelector("#inputImage").files[0]);
}

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
      imageShow.classList.remove("before");
      imageShow.classList.add("after");
      imageShow.src = reader.result;
    },
    false
  );
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
  showImage();
}

function dragImageOver(event) {
  console.log("file in area");
  event.preventDefault();
}
