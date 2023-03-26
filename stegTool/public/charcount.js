// live word count 
var messageInput = document.getElementById("messageInput");
var wordCount = document.getElementById("wordCount");

messageInput.addEventListener("input", function() {
  var count = messageInput.value.length;
  wordCount.innerText = count;
});

