import { loadMusic, playMusic } from './music.js';
import { initializeUsers, MakeNewAccount, login } from './users.js';
import { fightHandler } from './fight.js';
import { diffSetting } from './classes.js';
import { displayInventory } from './items.js';

export { randomNumber, percentChance, StartUpMenu, requestNumber, requestInput, writeTextWait, writeText };

window.onerror = function(message, source, lineno, colno, error) {
  if(error.message === "Thanks for playing!") {
    writeText(error.message);
  } else if(error.message === "Cannot read property 'toUpperCase' of null" || error.message === "Cannot read property 'toLowerCase' of null"){
    alert("You just pressed the \"Cancel\" button. That causes the game to end.");
  } else {
    alert("Kixley-Utility has run into an unexpected error.");
    alert("To help in debugging, Kixley-Utility has this to say:");
    alert(message);
    alert("Error found on line " + lineno);
    alert("Error found on column " + colno);
  }
}

var openingMenu;
var loc;
var from;
var answer;

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

function requestNumber(whenDone, min, max) {
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
  temp3.innerHTML = "Submit";
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

function requestInput(options, whenDone) { // IMPORTANT: don't put anything that runs directly after this function. (ie don't call requestInput and follow it with an if statement, cuz the if statement will run even if there hasn't been an input yet. Put the if statement in requestInput() as whenDone, using function notation (function() {...}))
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
  
  waitForUserInput(); // wait for the player to select an option
  
  function waitForUserInput() {
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
      whenDone(); // run whatever's next
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

function StartUpMenu() {
  if (openingMenu === true) {
    loadMusic();
    switch (randomNumber(1, 10000)) {
      case 3141:
        writeText('WELCOME TO unnamedTextAdventure!');
        openingMenu = false;
        break;
      default:
        writeText('WELCOME TO KIXLEY!');
        openingMenu = false;
    }
  }
  playMusic("Menu");

  function detectIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');
    var edge = ua.indexOf('Edge/');
    if (msie > 0 || trident > 0 || edge > 0) {
      return true
    } else {
      return false
    }
  }

  if (detectIE() !== false) {
    writeText('We noticed that you are using Internet Explorer. Because of this, your Kixley experience will be unsatisfactory. This is because the boxes will change position.');
    writeText('Here are some suggestions for browsers:');
    var windowObjectReference;
    var strWindowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';

    function firefoxWindow() {
      windowObjectReference = window.open('https://www.mozilla.org/en-US/firefox/new/', 'Download_Firefox', strWindowFeatures);
    }

    function chromeWindow() {
      windowObjectReference = window.open('https://www.google.com/chrome/browser/desktop/', 'Download_Chrome', strWindowFeatures);
    }
    firefoxWindow()
    chromeWindow()
  }
  
  initializeUsers();
  writeText("Kixley Beta 1.1");
  requestInput(["Start", "Options", "Load", "Achievements", "Create New Account", "Log In", "Exit"], determineAnswer);
  //answer = prompt('Choose an option. (Version: Beta 1.1)', 'Start, Options, Load, Achievements, Create New Account, Log In, Exit').toUpperCase()
  function determineAnswer() {
    switch (answer) {
      case 'Start':
        writeText('Before you start, please set the difficulty. Easier difficulties have monsters with less health and attack. Harder difficulties have monsters with more health and attack.')
        openingMenu = 0
        Difficulty()
        break;
      case 'Options':
        Options()
        break;
      case 'Load':
        load()
        break;
      case 'Achievements':
        achievementMenu()
        break;
      case 'Exit':
        alert('Goodbye!')
        Credits(makeButton)
        function makeButton() {
          var temp2 = document.getElementByID("buttons");
          var temp = document.createElement("BUTTON");
          temp.innerHTML = "Run";
          temp.id = "runbutton";
          temp.onclick = Function("openingMenu = true; temp = document.getElementById('buttons'); while(temp.firstChild !== null) { temp.removeChild(temp.firstChild); }; StartUpMenu();");
          temp2.appendChild(temp);
          const err = new Error("Thanks for playing!");
          throw err;
        }
        break;
      case 'Create New Account':
        alert('WARNING: As of right now, accounts are not yet in working order. As such, use with caution.')
        MakeNewAccount()
        break;
      case 'Login':
        alert('WARNING: As of right now, accounts are not yet in working order. As such, use with caution.')
        login()
        break;
    }
  }
}

function Menu() {
  if(menuMusic.paused) {
    playMusic(menuMusic);
  }
  from = 'in-game'
  writeText("Kixley Beta 1.1");
  requestInput(["Options", "Exit", "Return", "Save", "Log In"], determineAnswer);
  // answer = prompt('Choose an option. (Version: Beta 1.1)', 'Options, Exit, Return, Save, Log In').toLowerCase()
  function determineAnswer() {
    switch (answer) {
      case 'Options':
        Options()
        break;
      case 'Exit':
        writeText("Bye!");
        Credits(makeButton)
        function makeButton() {
          var temp2 = document.getElementByID("buttons");
          var temp = document.createElement("BUTTON");
          temp.innerHTML = "Run";
          temp.id = "runbutton";
          temp.onclick = Function("openingMenu = true; temp = document.getElementById('buttons'); while(temp.firstChild !== null) { temp.removeChild(temp.firstChild); }; StartUpMenu();");
          temp2.appendChild(temp);
          const err = new Error("Thanks for playing!");
          throw err;
        }
        break;
      case 'Return':
        switch (loc) {
          case 1:
            Places()
            break;
          case 2:
            InTown()
            break;
        }
        break;
      case 'Save':
        saveMenu()
        break;
      case 'Log In':
        alert('WARNING: As of right now, accounts are not yet in working order. As such, use with caution.')
        login()
        break;
    }
  }
}

function runButton() {
  openingMenu = true; 
  var temp = document.getElementById('buttons'); 
  while(temp.firstChild !== null) { 
    temp.removeChild(temp.firstChild); 
  }; 
  StartUpMenu();
}
document.getElementById("runbutton").addEventListener("click", runButton);
