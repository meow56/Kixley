import { fightHandler } from './fight.js';
import { displayInventory } from './items.js';

export { randomNumber, percentChance, requestNumber, requestRange, requestInput, writeTextWait, writeText };

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function percentChance(percent) {
  return (1 + (Math.random() * 99)) <= percent
}

function wFUIUpdates() { // waitForUserInputUpdates; mostly UI stuff
  fightHandler.showInfo();
  displayInventory(false);
  fightHandler.showHealth();
  fightHandler.showBlobs();
}

function requestNumber(whenDone, min, max) { // requests number from player using the "number" input
  answer = " ";
  var temp2 = document.getElementById("buttons");
  var temp3 = document.createElement("INPUT");
  temp3.id = "number_input";
  temp3.type = "number";
  if(min !== undefined) {
    temp3.min = min;
  }
  if(max !== undefined) {
    temp3.max = max;
  }
  temp2.appendChild(temp3);
  
  temp3 = document.createElement("BUTTON");
  temp3.id = "number_submit";
  temp3.textContent = "Submit";
  temp3.onclick = Function("answer = document.getElementById('number_input').value;");
  temp2.appendChild(temp3);
  
  waitForUserInput();
  
  function waitForUserInput() {
    if(answer === " ") {
      wFUIUpdates();
      setTimeout(waitForUserInput, 0);
    } else {
      temp2.removeChild(document.getElementById("number_input"));
      temp2.removeChild(document.getElementById("number_submit"));
      whenDone();
    }
  }
}

function requestRange(whenDone, min, max, step) { // requests number from player using the "range" input
  window.answer = " ";
  var temp2 = document.getElementById("buttons");
  var temp3 = document.createElement("INPUT");
  temp3.id = "range_input";
  temp3.type = "range";
  if(min !== undefined) {
    temp3.min = min;
  }
  if(max !== undefined) {
    temp3.max = max;
  }
  if(step !== undefined) {
    temp3.step = step;
  }
  temp2.appendChild(temp3);
  
  temp3 = document.createElement("BUTTON");
  temp3.id = "range_submit";
  temp3.textContent = "Submit";
  temp3.onclick = Function("window.answer = document.getElementById('range_input').value;");
  temp2.appendChild(temp3);
  
  waitForUserInput();
  
  function waitForUserInput() {
    if(window.answer === " ") {
      wFUIUpdates();
      setTimeout(waitForUserInput, 0);
    } else {
      temp2.removeChild(document.getElementById("number_input"));
      temp2.removeChild(document.getElementById("number_submit"));
      whenDone();
    }
  }
}

function requestInput(options, whenDone, flags) { // IMPORTANT: don't put anything that runs directly after this function. (ie don't call requestInput and follow it with an if statement, cuz the if statement will run even if there hasn't been an input yet. Put the if statement in requestInput() as whenDone, using function notation (function() {...}))
  window.answer = " ";
  var temp2 = document.getElementById("buttons"); // find the div for buttons
  for(var i = 0; i < options.length; i++) {
    var temp = document.createElement("BUTTON"); // create buttons
    temp.innerHTML = options[i]; // set button to have proper text
    temp.onclick = Function("window.answer = \"" + options[i] + "\""); // set onclick so the buttons do stuff
    temp2.appendChild(temp); // put the new button in the div
    var temp3 = document.createElement("BR");
    temp2.appendChild(temp3);
  }
  
  waitForUserInput(flags); // wait for the player to select an option
  
  function waitForUserInput(options) {
    if(window.answer === " ") {
      wFUIUpdates();
      setTimeout(waitForUserInput, 0);
    } else {
      while(temp2.firstChild !== null) {
        temp2.removeChild(temp2.firstChild); // remove buttons
      }
      temp2 = document.getElementById("text");
      while(temp2.firstChild !== null) {
        temp2.removeChild(temp2.firstChild); // remove text
      }
      whenDone(flags); // run whatever's next
    }
  }
}

function writeTextWait(text, whenDone) {
  var temp = document.getElementById("text");
  var temp2 = document.createElement("PARAGRAPH");
  temp2.innerHTML = text;
  temp.appendChild(temp2);
  temp2 = document.createElement("BR");
  temp.appendChild(temp2);
  temp = document.getElementById("buttons");
  temp2 = document.createElement("BUTTON");
  temp2.innerHTML = "Next";
  temp2.onclick = Function("window.answer = 'Next';");
  temp.appendChild(temp2);
  window.answer = " ";
  
  waitForUserInput(); // wait for the player to select next
  
  function waitForUserInput() {
    if(window.answer === " ") {
      wFUIUpdates();
      setTimeout(waitForUserInput, 0);
    } else {
      temp = document.getElementById("buttons");
      temp.removeChild(temp.firstChild); // remove button
      clearText();
      whenDone(); // run whatever's next
    }
  }
}

function writeText(text) {
  var temp = document.getElementById("text");
  var temp2 = document.createElement("PARAGRAPH");
  temp2.innerHTML = text;
  temp.appendChild(temp2);
  temp2 = document.createElement("BR");
  temp.appendChild(temp2);
}

function clearText() {
  var temp = document.getElementById("text");
  while(temp.firstChild !== null) {
    temp.removeChild(temp.firstChild);
  }
}


