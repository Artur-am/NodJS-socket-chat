let elScript = create({
    "tag" : "script",
    "attribute" : {
        "src" : location.protocol + "//" + location.host + "/socket.io/socket.io.js"
    }
});

document.head.appendChild(elScript);