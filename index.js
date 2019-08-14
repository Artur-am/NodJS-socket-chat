const NODE_PATH ='./gulp/node_modules/';

const express = require( NODE_PATH +"express");
const app = express();
const io = require(NODE_PATH + "socket.io").listen(8888);

app.listen(9000);

app.use(express.static(__dirname  + "/build/assets/"));

app.get("/", function(req, res){
    res.sendFile(__dirname + '/build/index.html');
});


io.sockets.on("connection", (socket) => {
    
	socket.json.emit("conected", {});

    socket.on("message", (message) => {
        socket.broadcast.json.emit("message", message);
        socket.json.emit("message", message);
    });

});