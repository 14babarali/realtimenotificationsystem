// src/server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO on the server
const io = new Server(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Array to keep track of online users
let onlineUsers = [];

// When a client connects
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Add user to the online users array
    onlineUsers.push(socket.id);
    
    // Send a welcome notification to the newly connected user
    socket.emit('notification', { title: 'Welcome!', message: 'You are now connected to the Notification System' });

    // Notify others that a user has joined
    socket.broadcast.emit('notification', { title: 'User Joined', message: `A new user has joined: ${socket.id}` });

    // Event for manual notifications from the server
    socket.on('triggerNotification', (notificationData) => {
        io.emit('notification', notificationData);  // Broadcast notification to all clients
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        onlineUsers = onlineUsers.filter(id => id !== socket.id);
        io.emit('notification', { title: 'User Left', message: `User ${socket.id} has left the chat.` });
    });
});

// RESTful API route for triggering notifications
app.get('/notify', (req, res) => {
    const { title, message } = req.query;

    if (title && message) {
        io.emit('notification', { title, message }); // Broadcast notification to all users
        return res.status(200).json({ success: true, message: 'Notification sent!' });
    } else {
        return res.status(400).json({ success: false, message: 'Title and message are required' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
