const ulist = document.getElementById('main__list');
var input = document.getElementById("header__search-input");
var pagecount = 1;
var hitPageLimit = false;
var loadingPages = false;

// input.focus();

fetchData();

window.addEventListener("scroll",function(){
  
  var limit = Math.max( document.body.scrollHeight, 
                           document.body.offsetHeight, 
                           document.documentElement.clientHeight, 
                           document.documentElement.scrollHeight, 
                           document.documentElement.offsetHeight );
  
  console.log(loadingPages);
  
  if(window.scrollY < 0.5){
     
     document.getElementById("header__bar").style.display = "none";
     
  } else if (!hitPageLimit && (window.innerHeight + window.scrollY) >= (limit * 0.75) && !loadingPages) {
            
      console.log("Loading more photos");
    
      loadingPages = true;
      (fetchData() == []) ? (hitPageLimit = true) : (hitPageLimit = false);
      console.log(hitPageLimit);
      limit = document.body.offsetHeight - window.innerHeight;
      limit = Math.max( document.body.scrollHeight, 
                           document.body.offsetHeight, 
                           document.documentElement.clientHeight, 
                           document.documentElement.scrollHeight, 
                           document.documentElement.offsetHeight );
    
  } else {
    
     document.getElementById("header__bar").style.display = "";
    
  }
  
},false);

setInterval(function(){
  
  var arr = Array.prototype.slice.call(ulist.getElementsByTagName('li'));
  var intElemScrollTop = document.body.scrollTop;
  
  var count = 0;
  
  for(var i =0;i < arr.length;i++){
    
    if(arr[i].style.display != "none"){
       
       count++;
       
    }
    
  }
  
  document.getElementById("photo-count").innerText = count;
  
},1000);

async function fetchData() {
  
    const data = await (
      fetch('https://picsum.photos/v2/list?page=' + pagecount +'&limit=96')
      .then(response => response.json())
      .then(data => data.map(function(photo){
        let {author, download_url: url} = photo;

        url = url.replace(/(\/+)$/, '')
          .replace(/(\d+)\/(\d+)$/, (match, $width, $height) => {
            const $max = Math.max($width, $height);
            const max = Math.min($max, 512);

            [$width, $height] = [$width, $height].map(dim => Math.round((dim / $max) * max));

            return `${$width}/${$height}`;
          });

        loadPhoto({url, author});

        return([url,photo.author]);

      }))

    );

    pagecount++;
    loadingPages = false;
  
    return data;
  
}

function loadPhoto({url, author} = {}){

    var node = document.createElement("li");
    var f = document.createElement('figure');
    var i = document.createElement("img");
    var c = document.createElement("span");
    node.className += "main__list-item";

    f.href =  "#";
    f.addEventListener("click", onClick, false);
    i.src = url;
    i.className = "item-img";
    c.innerText = author;
  
    f.appendChild(i);
    f.appendChild(c);
    node.appendChild(f);
    document.getElementById("main__list").appendChild(node);

}

function sort(text){
  
  console.log(text);
  input.value = text;
  const regex = RegExp(`^${text}`, 'i');
  
  const listItems = [...ulist.getElementsByTagName('li')]
    .forEach(item => {

      item.style.display = `${item.innerText}`
        .split(/[^a-z -+[0-9]]/ig)
        .some(w => regex.test(w)) ? "" : "none";

    });
  
}

function onClick(e) {
  
  e.preventDefault();
  
  sort(e.target.parentNode.lastChild.innerText);

}

function onKeyUp(e) {
  
  e.preventDefault();
  
  sort(e.target.value);

}

