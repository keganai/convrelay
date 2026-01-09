const express = require('express');
const OpenAI = require('openai');
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
	            model: 'gpt-5.2',
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
