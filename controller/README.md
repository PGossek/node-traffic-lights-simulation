# Main controller
This is the main controller of traffic lights.

After a download and unpack project, remember to run `npm install`.

You can run:
* `npm run start` to fire service
* `npm run lint` to check and fix ESLint findings
* `npm run test` to run Mocha UTs
* `npm run coverage` to check coverage

## Green light heuristic
In code, I implemented simple green light choose heuristic. 
```
function getLightColor(actualColor, wsCount, greenColorsCount) {
    if (actualColor !== colors.GREEN && greenColorsCount*100/wsCount < 20) {
        return colors.GREEN;
    }
    let newCollor;
    while(!newCollor || newCollor === actualColor){
        newCollor = colors[Object.keys(colors)[Math.floor(Math.random() * Object.keys(colors).length)]];
    }
    return newCollor;
}
```
Code is very simple and whole is cover by UTs.

## Security discussion
In my opinion the best way to provide some security between client and server connection would be use https server and MTLS protocol, similar to code:
```
const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
 
const server = https.createServer({
  cert: fs.readFileSync('/path/to/cert.pem'),
  key: fs.readFileSync('/path/to/key.pem')
});
const wss = new WebSocket.Server({ server });
 
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
 
  ws.send('something');
});
 
server.listen(8080);
```
Then, each client could have own certificate, where fingerprint could be a unique id. All fingerprints would be imported to database before and main controller would be check if incoming traffic light is trusted.

Also, there are really many ways to authenticate clients. Using some encrypted body, specific http headers values etc.