//counter to keep track of characters in the message textbox
var messageInput = document.getElementById("messageInput");
var wordCount = document.getElementById("wordCount");

messageInput.addEventListener("keyup",function(){
    var characters = messageInput.value.split('');
    wordCount.innerText = characters.length;
});
//limit set to the amount of characters you can put into the textbox
const textarea = document.getElementById('messageInput');
const maxChars = 31;
textarea.addEventListener('input', function() {
  const currentChars = textarea.value.length;
  if (currentChars >= maxChars) {
    textarea.disabled = true;
  }
});