let userLogin = "";
let socket = null;

function Connecte(){
    document.forms["form-message"].elements.submit.removeAttribute("disabled");
}

function Disconnect(){
    document.forms["form-message"].elements.submit.setAttribute("disabled", "");
}

function create(data){

  let tag = document.createElement(data.tag);

  if("attribute" in data){
    for(let att in data.attribute){
      tag.setAttribute(att, data.attribute[att]);
    }
  }

  if("text" in data){
    tag.textContent = data.text;
  }

  return tag;

}
function MessageNotification(){
    let audio = document.getElementsByClassName("message-notification")[0];
    audio.play();
}

function Chat(){
    
    function getFormData(){
        let form = document.forms["form-message"].elements;
        let date = new Date();
    
        this.login = userLogin;
        this.message = form.message.value;
        this.date = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        
        form.message.value = "";
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
    socket.on("other-message", function(messageObject){
        MessageNotification();
        NewMessage(messageObject);
    });
    document.forms["form-message"].addEventListener("submit", SendMessage);

}

(function(){
    
    let elScript = create({
        "tag" : "script",
        "attribute" : {
            "src" : location.protocol + "//" + location.host + "/socket.io/socket.io.js"
        }
    });
    
    document.head.appendChild(elScript);

    if("undefined" !== typeof(Storage)){
        userLogin = localStorage.getItem('login');
        if(userLogin){
            return null;
        }
    }

    function ModalWindow(modalItem, status = true){
        let method = status ? "add" : "remove";
        
        document.body.classList[method]("modal");
        document.getElementsByClassName(modalItem)[0].classList[method]("modal-active");
    }

    ModalWindow("modal-user-info");

    function GetLogin(event){
        event.preventDefault();
        let form = document.forms["get-login"].elements;
        let login = form.login.value.trim();            
        if(login){
            localStorage.setItem("login", login);
            userLogin = login;
            ModalWindow("modal-user-info", false);
        }
    }
    document.forms["get-login"].addEventListener("submit", GetLogin);
    
}());


window.addEventListener("load", function(){
    socket = io();

    socket.on("conected", Connecte);
    socket.on("disconnect", Disconnect);

    Chat();

});