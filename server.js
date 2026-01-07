const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws, req) => {
  console.log('New connection from:', req.socket.remoteAddress);

  ws.on('message', (msg) => {
    let data;
    try {
      data = JSON.parse(msg);
    } catch (err) {
      console.error('Invalid JSON received:', msg);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
      return;
    }

    console.log('Received:', data);

    if (data.type === 'prompt') {
      const reply = {
        type: 'text',
        token: `あなたは「${data.voicePrompt}」と言いましたね。`,
        last: true,
      };
      ws.send(JSON.stringify(reply));
    }
  });

  ws.on('close', () => {
    console.log('Connection closed');
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});
