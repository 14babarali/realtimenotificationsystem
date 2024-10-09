// Connect to the server using Socket.IO
const socket = io();

// HTML element to display notifications
const notificationBox = document.getElementById('notificationBox');

// Listen for notification events from the server
socket.on('notification', (notificationData) => {
    const div = document.createElement('div');
    div.classList.add('alert', 'alert-info', 'mt-3');
    div.innerHTML = `<strong>${notificationData.title}</strong>: ${notificationData.message}`;
    notificationBox.appendChild(div);
    notificationBox.scrollTop = notificationBox.scrollHeight;
});
