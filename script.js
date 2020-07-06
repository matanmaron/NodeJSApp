const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const name = prompt('Name Please?');
const color = getRandomColor();
appendMessage('You Joined', color);
socket.emit('new-user', { name: name, color: color });

socket.on('chat-message', data=>{
    appendMessage(`${data.user.name}: ${data.message}`, data.user.color);
})

socket.on('user-connected', user=>{
    appendMessage(`${user.name} connected`, user.color);
})

socket.on('user-disconnected', user=>{
    appendMessage(`${user.name} disconnected`, user.color);
})

messageForm.addEventListener('submit', e=>{
    e.preventDefault();
    const message = messageInput.value;
    socket.emit('filter', message);
});

socket.on('filter', message=>{
    appendMessage(`You: ${message}`, color);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
})

function appendMessage(message, color)
{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.style.background = color;
    messageContainer.append(messageElement);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }