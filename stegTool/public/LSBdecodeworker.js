onmessage = function (e) {
  var decodedString = "";
  var tempString = "";
  var bitCount = 0;
  decodeImageData = e.data;
  for (let i = 0; i < decodeImageData.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      if (bitCount === 8) {
        decodedString += String.fromCharCode(parseInt(tempString, 2));
        tempString = "";
        bitCount = 0;
      }
      tempString += decodeImageData[i + j] & 1;
      bitCount += 1;
    }
  }
  this.postMessage(decodedString);
};
