document.body.onload = loadSuites;



// const appState = require('../renderer/state');

window.fetch('./2-21-56PM.json')
  .then(response => {
    return response.json();
  })
  .then(theJson => {
    console.log(theJson)
  })

function loadSuites () {
  // require('')
  var newDiv = document.createElement("div"); 
  // and give it some content 
  var newContent = document.createTextNode("Hi there and greetings!"); 
  // add the text node to the newly created div
  newDiv.appendChild(newContent);  

  // add the newly created element and its content into the DOM 
  var currentDiv = document.getElementById("div1"); 
  document.body.insertBefore(newDiv, currentDiv); 
}

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      // select the html node that is the list
      const theList = document.querySelector('#the-list');
      // iterate through each data item
      data.forEach(d => {
        // create an li to represent the current data item
        const li = document.createElement('li');
        // set the text content of the li to the data item
        li.innerText = d;
        // add the data item to the ul in the DOM
        theList.appendChild(li);
      });