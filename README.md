# node-traffic-lights-simulation
Traffic lights simulation written in node.js

## Summary of implementation 
My first idea was to prepare two rest services, one as a main controller, second as a traffic light client. Communication between services would be done with rest client libraries, eg. `http` from `node.js` main library. To check health of client, main controller would be sending health requests every once in a while.

But then I realized, that this is not exactly solution as author of task wants. The main problem with that solution are real time period, and many calls between services. So I read about websocket which provide open connections. This technology is similar for me, but I have no opportunities to use it before. However, after reading the documentation, I decided to use `ws` library.

### socket.io library
During implementation, when I had simple server-client services in `ws` I tried to use `socket.io` and `socket.io-client`. My observations show that after closing main controller, clients are still running. Maybe some actions on `close` event would be help here, but this could be next step to investigate in this task.

### ws library
Using `ws` library, without extra actions on close event, causes that every client are closing, while the main controller is turning off. For this task purposes is fair enough. However, my observations show that when client is shutting down, socket is not every time gone from pole wss sockets in controller memory. I found [similar questions](https://github.com/websockets/ws/issues/1444) but the responder wrote, that `ws` code is ok. It was helpful to me to use.
```
ws.terminate();
```
piece of code. This is the next thing which should be investigated.


## Things to improvement
* performance of sending information to Vue.js controller. This specific socket could be remembered in memory or should call a different endpoint. Searching it in every send event has low performance;
* more events handlers, especially in some errors in connection;
* interval health check of active sockets logic;
* check for the same unique id of clients;
