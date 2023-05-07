onmessage = function (e) {
  let pixels = e.data[0];
  let i = e.data[1];
  let j = e.data[2];
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

  self.postMessage(pixels);
};
