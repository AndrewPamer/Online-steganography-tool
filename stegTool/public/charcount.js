var messageInput = document.getElementById("messageInput");
var wordCount = document.getElementById("wordCount");

messageInput.addEventListener("keyup",function(){
    var characters = messageInput.value.split('');
    wordCount.innerText = characters.length;
});