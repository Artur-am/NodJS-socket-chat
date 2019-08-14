function ModalWindow(modalItem, status = true){
    let method = status ? "add" : "remove";
    
    document.body.classList[method]("modal");
    document.getElementsByClassName(modalItem)[0].classList[method]("modal-active");
}