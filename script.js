const ulist = document.getElementById('main__list');

start();

async function start() {

  const data = await (
    fetch('https://picsum.photos/v2/list?page=1&limit=50')
    .then(response => response.json())
    .then(data => data.map(function(photo){
      let {author, download_url: url} = photo;
      
      url = url.replace(/(\/+)$/, '')
        .replace(/(\d+)\/(\d+)$/, (match, $width, $height) => {
          const $max = Math.max($width, $height);
          const max = Math.min($max, 1024);
        
          [$width, $height] = [$width, $height].map(dim => Math.round((dim / $max) * max));
        
          return `${$width}/${$height}`;
        });

      loadPhoto({url, author});
      
      return([url,photo.author]);
      
    }))
  
  );
  
  console.log(data);
  return data;
}

function loadPhoto({url, author} = {}){

    var node = document.createElement("li");
    var a = document.createElement('a');
    var i = document.createElement("img");
    var p = document.createElement("p");
    node.className += "main__list-item";

    a.href =  "#";
    a.addEventListener("click", onClick, false);
    i.src = url;
    p.innerText = author;
  
    a.appendChild(i);
    a.appendChild(p);
    node.appendChild(a);
    document.getElementById("main__list").appendChild(node);

}

function sort(text){
  
  console.log(text);
  
  const regex = RegExp(`^${text}`, 'i');
  
  const listItems = [...ulist.getElementsByTagName('li')]
    .forEach(item => {

      item.style.display = `${item.innerText}`
        .split(/[^a-z ]/ig)
        .some(w => regex.test(w)) ? "" : "none";

    });
  
}

function onClick(e) {
  
  e.preventDefault();
  
  sort(e.target.parentNode.lastChild.innerText);

}

function onKeyUp(e) {
  "use strict";
  e.preventDefault();
  
  sort(e.target.value);

}
