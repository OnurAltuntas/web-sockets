const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const PORT = process.env.PORT || 5000;



const router = require('./router');
const app = express();
const server = http.createServer(app);

const io = socketIo(server); // < Interesting!

io.on('connection',(socket)=>{
	console.log('We have a new connection');

	socket.on('disconnect', () =>{
		console.log('user just had left');
	})
})

app.use(router);

server.listen(PORT,() => console.log(`Server has started on port ${PORT}`));
