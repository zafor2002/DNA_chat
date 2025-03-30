// Main JavaScript file for functionality
// JavaScript (main.js)
'use strict';

let username = null;
let roomId = null;
let stompClient = null;
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const messageArea = document.querySelector('#messageArea');
const connectingElement = document.querySelector('.connecting');
const usernameForm = document.querySelector('#usernameForm');
const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');

function connect(event) {
    username = document.querySelector('#name').value.trim();
    roomId = document.querySelector('#room-id').value.trim();
    
    if(username && roomId) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');
        
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        
        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);
    
    // Tell your username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, content: username + ' joined!', type: 'JOIN', roomId: roomId})
    );
    
    // Load previous messages
    loadPreviousMessages();
    
    connectingElement.classList.add('hidden');
}

function loadPreviousMessages() {
    fetch(`/api/messages/room/${roomId}`)
        .then(response => response.json())
        .then(messages => {
            messages.forEach(message => {
                displayMessage(message);
            });
        })
        .catch(error => console.error('Error loading messages:', error));
}

function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

function sendMessage(event) {
    const messageContent = messageInput.value.trim();
    
    if(messageContent && stompClient) {
        const chatMessage = {
            sender: username,
            content: messageContent,
            roomId: roomId
        };
        
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    displayMessage(message);
}

function displayMessage(message) {
    const messageElement = document.createElement('li');
    messageElement.classList.add('chat-message');
    
    if(message.sender === username) {
        messageElement.classList.add('self');
    }
    
    const senderElement = document.createElement('span');
    senderElement.classList.add('sender');
    senderElement.textContent = message.sender;
    
    const textElement = document.createElement('span');
    textElement.textContent = message.content;
    
    messageElement.appendChild(senderElement);
    messageElement.appendChild(textElement);
    
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);