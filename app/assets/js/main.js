let userLogin = "";
let socket = null;

function Connecte(){
    document.forms["form-message"].elements.submit.removeAttribute("disabled");
}

function Disconnect(){
    document.forms["form-message"].elements.submit.setAttribute("disabled", "");
}

//= ./functions/create.js
//= ./functions/message-notification.js

//= ./chat.js

(function(){
    
    //= functions/scriptSrc.js

    if("undefined" !== typeof(Storage)){
        userLogin = localStorage.getItem('login');
        if(userLogin){
            return null;
        }
    }

    //= ./functions/modal-window.js

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