/*
const express = require('express');
const OpenAI = require('OpenAI');
const fs = require('node:fs');
const { WebSocketServer } = require('ws');

//const webserver = express().listen(3000, () => console.log(`Listening on ${3000}`));
const openai = new OpenAI({apiKey : process.env.APIKEY});
const openaiprompt = fs.readFileSync('./prompt/' + process.env.PROMPT_FILE_NAME, 'utf8');
const sockserver = new WebSocketServer({ port: 3001 }, () => console.log(`Listening on ${3001}`));

sockserver.on('connection', ws => {	
	ws.on('message', async message => {
		const MSG = JSON.parse(message);
		if(MSG.type==='prompt'){
			console.log("A---" + MSG.voicePrompt);
			const response = await openai.chat.completions.create({
	            model: 'chatgpt-4o-latest',
	            messages: [{ role: 'system', content: openaiprompt },{ role: 'user', content: MSG.voicePrompt }],
	   	 	});
	   	 	const reply = response.choices[0].message.content;
       	 	ws.send(JSON.stringify({type: "text", token: reply, last : true}));
	   		console.log("B---" + reply);
		}
 	})
	ws.on('close', () => console.log('Client has disconnected!'));
 
	ws.onerror = function () {
		console.log('websocket error');
 	}
});
*/
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws, req) => {
  console.log('New connection from:', req.socket.remoteAddress);

  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
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
});
