(function () {
    window.onload = function () {
        establishConnection();
        addCustomFormSubmission();
    };

    let stompClient;

    function establishConnection() {
        const socket = new SockJS('/speak');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/messages', function (message) {
                showMessage(message);
            });
        });
    }

    function addCustomFormSubmission() {
        const messageForm = document.getElementById("messageForm");
        messageForm.addEventListener("submit", function (e) {
            e.preventDefault();
            sendMessage();
        });
    }

    function showMessage(message) {
        const author = getParsedProperty(message, "author");
        const messageText = getParsedProperty(message, "text");

        const messagesDiv = document.getElementById("messages");
        const paragraph = document.createElement("p");
        const node = document.createTextNode(`${author}: ${messageText}`);
        paragraph.appendChild(node);
        messagesDiv.appendChild(paragraph);
    }

    function getParsedProperty(json, propertyName) {
        return JSON.parse(json.body)[propertyName];
    }

    function sendMessage() {
        const messageText = document.getElementById("message").value;
        stompClient.send("/app/speak", {}, JSON.stringify({"text": messageText}));
    }

})();