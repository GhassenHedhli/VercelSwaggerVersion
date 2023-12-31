const ioClient = require("socket.io-client");

const PORT = process.env.PORT || 6001;
const socketClient = ioClient(`http://localhost:${PORT}`, { query: { role: 'nope' } });

// Listen for 'connect' event from the server
socketClient.on('connect', () => {
  console.log('Connected to server');
});

// Simulate sending a notification event to the server
setTimeout(() => {
  socketClient.emit('notification', { message: 'Test notification', newCandidates: [] });
}, 2000);
