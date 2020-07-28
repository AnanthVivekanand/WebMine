# WebMine

WebMine is a service that allows users to mine cryptocurrencies in the browser through an easy-to-use framework. As of right now, it supports Allium coins, but
other cryptocurrencies can easily be ported by swapping out the wasm binaries.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

The deployment of this project needs a web server and a proxy to transfer data between raw TCP sockets and WebSockets. This guide will assume your web server is set up correctly.

All communication with the mining pool is done in the browser; however, due to the limitations of the browser environment, this communication cannot occur directly. The browser first sends data to a proxy, which forward the message to the mining pool, and similarly for the reverse.

wsProxy is a convient proxy server that can help us do this: https://github.com/herenow/wsProxy

```
$ npm install wsproxy -g

$ wsproxy -p 8080 -t 1
[Status]: Starting wsProxy on port 8080...

```

### Installing

Now that we have our communications proxy up, deploy `index.html`, `index.js`, `allium.js`, `allium.wasm`, and `worker.js` to your webserver.

We need to change a line in our index.html to use the proxy server that was set up. Look at line 343 in `index.html`

```socket = new WebSocket('ws://webmine.tuxtoke.life:8080/' + document.getElementById('poolurl').value);```

Change "webmine.tuxtoke.life:8080" to the ip address and port of your proxy server. You're ready to go! 

## Running the tests

Try to naviagte to `index.html` on your web server. Enter some pool information for testing and click "Connect to pool". If all is well, then you should see "YAY! Successful authorization with pool!" and new mining jobs appear.

![Successful Authorization Message](http://i.imgur.com/KZOwkRB.png)


### Break down into end to end tests

We have verified that our web miner is talking to our pool. Now, we need to verify that it actually mines! Once you have receieved a mining job, usually shortly after your authorization, click "Start mining"

You should start to see hashrate reports on your graph!

![Mining away!](http://i.imgur.com/gIxWGws.png)


## Built With

* [wsProxy](https://github.com/herenow/wsProxy) - wsProxy is a TCP raw socket/WebSocket proxy that allows socket access to the browser.
* [WASM](https://webassembly.org/) - WebAssembly (abbreviated Wasm) is a binary instruction format for a stack-based virtual machine. 
* A lot of love!  ❤️ ❤️ ❤️

## Authors

* **Ananth Vivekanand** - [Github](https://github.com/AnanthVivekanand)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Thanks to Kryptonite, who provided WebAssembly compilation instructions for the Allium algorithm!
