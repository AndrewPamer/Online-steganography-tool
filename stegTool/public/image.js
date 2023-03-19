function showImage() {
  const reader = new FileReader();
  const imageShow = document.querySelector(".image");
  const image = document.querySelector("#inputImage").files[0];
  const b = document.querySelector(".image-preview");
  if (image) {
    reader.readAsDataURL(image);
  }

  reader.addEventListener(
    "load",
    () => {
      imageShow.src = reader.result;

      imageShow.style.border = "5px dotted white";
      b.style.border = "";
    },
    false
  );
}
