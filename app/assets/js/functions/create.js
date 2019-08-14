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

