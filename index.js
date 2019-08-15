const express = require("express");
const app = express();
const path = require("path");
const socketIO = require("socket.io");

let PORT = process.env.PORT || 9000;
let server = app.listen(PORT, function() {
    console.log('Node app is running on port', PORT);
});
const io = socketIO(server);

app.use(express.static(path.join(__dirname  + "/build/assets/")));

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

io.sockets.on("connection", (socket) => {
    
	socket.json.emit("conected", {});

    socket.on("message", (message) => {
        socket.broadcast.json.emit("other-message", message);
        socket.json.emit("message", message);
    });

});
