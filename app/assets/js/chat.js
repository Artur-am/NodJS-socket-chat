function Chat(){
    
    function getFormData(){
        let form = document.forms["form-message"].elements;
        let date = new Date();
    
        this.login = userLogin;
        this.message = form.message.value;
        this.date = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    function NewMessage(messageObject){
        let li = document.createElement("li");
          li.appendChild( create({"tag" : "span", "text" : messageObject.login}));
          li.appendChild( create({"tag" : "span", "class" : "list-message", "text" : messageObject.message}));
          li.appendChild( create({"tag" : "span", "text" : messageObject.date}));
        document.getElementsByClassName("lists")[0].appendChild(li);
    }

    function SendMessage(event){
        event.preventDefault();

        let data = new getFormData();
        socket.emit("message", data);
    }

    socket.on("message", NewMessage);
    document.forms["form-message"].addEventListener("submit", SendMessage);

}