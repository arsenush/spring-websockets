(function () {
    window.onload = function () {
        establishConnection();
        addCustomFormSubmission();
    };

    var stompClient;

    function establishConnection() {
        var socket = new SockJS('/speak');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, function(frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/messages', function(message){
                showMessage(JSON.parse(message.body).text);
            });
        });
    }

    function addCustomFormSubmission() {
        var messageForm = document.getElementById("messageForm");
        messageForm.addEventListener("submit", function (e) {
            e.preventDefault();
            sendMessage();
        });
    }

    function showMessage(message) {
        var messagesDiv = document.getElementById("messages");
        var paragraph = document.createElement("p");
        var node = document.createTextNode(message);
        paragraph.appendChild(node);
        messagesDiv.appendChild(paragraph);
    }

    function sendMessage() {
        var messageText = document.getElementById("message").value;
        stompClient.send("/app/speak", {}, JSON.stringify({"text": messageText }));
    }

})();