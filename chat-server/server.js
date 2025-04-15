const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
console.log('✅ WebSocket server running at ws://localhost:8080');

// Track all connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('🟢 Client connected');
  clients.add(ws);

  ws.on('message', (msg) => {
    const text = msg.toString().trim();

    if (!text) return; // Ignore empty messages

    console.log('📩 Received:', text);

    // Broadcast to all other connected clients
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(text);
      }
    }
  });

  ws.on('close', () => {
    console.log('🔌 Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (err) => {
    console.error('❌ WebSocket error:', err.message);
  });
});
