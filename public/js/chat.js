const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
const socket = new WebSocket(protocol + window.location.host + '/chatbot');

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-message');
const sendButton = document.getElementById('send-message');

// Show initial greeting
window.onload = () => {
    setTimeout(() => {
        appendMessage('bot', 'Hello! How can I help you today?');
    }, 500);
};

// Handle incoming messages
socket.onmessage = (event) => {
    const response = JSON.parse(event.data);
    appendMessage('bot', response.message);
};

// Handle sending messages
sendButton.onclick = () => {
    const message = userInput.value;
    if (message.trim()) {
        appendMessage('user', message);
        socket.send(message);
        userInput.value = '';
    }
};

// Handle enter key press
userInput.onkeypress = (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
};

// Function to append messages to chat
function appendMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
