// public/editor.js


const socket = io();
const editor = document.getElementById('editor');

// Emit text change events to the server
editor.addEventListener('input', () => {
    const content = editor.value;
    socket.emit('textChange', content);
});

// Listen for text updates from the server
socket.on('textUpdate', (data) => {
    editor.value = data; // Update the editor's content with received data
});
