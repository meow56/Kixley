import { loadMusic, playMusic } from './music.js';
import { diffSetting, Difficulty } from './classes.js';
import { initializeUsers, MakeNewAccount, login } from './users.js';
import { randomNumber, writeText, requestInput } from './utility.js';
import { totalGold, loc } from './places.js';
import { kixleyNCo } from './fight.js';

export { addKillCount, addCumulativeGold, CheckIfGotAchieve, StartUpMenu, Menu };

function addKillCount(kill) {
  killCounter += kill;
}

function addCumulativeGold(gold) {
  cumulativeGold += gold;
}

var allAchievements = [
  'Kill 5 monsters',
  'Kill 10 monsters',
  'Kill 20 monsters',
  'Reach Level 5',
  'Reach Level 10',
  'Reach Level 20',
  'Get 1000 cumulative gold',
  'Get 2000 cumulative gold',
  'Get 5000 cumulative gold'
];
var compAchieve = []; // completed achievements
var killCounter = 0; // how many monsters killed
var cumulativeGold = 0; // total gold earned
var getGoldAchieve = 0;
var volumeSettings = '10';
var goldCheat = 0;
var expCheat = 0;
var attackCheat = 0;
var healthCheat = 0;
var blobOfDoomCheat = 0;
var accCheat = 0;
var actualAccuracy;
var youCheated = false; // have you cheated, ever?
var PassOrNot = '';
var openingMenu;
var from;
var answer;

function DevCheats() {
  requestInput(["Infinite Gold", "Infinite EXP", "Infinite Attack", "Infinite Health", "Infinite Blobs of Doom", "Infinite Accuracy", "Activate All", "Leave"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Infinite Gold':
        if (goldCheat === 0) {
          totalGold = -(Math.log(0))
          writeText('Cheat successfully activated!')
          goldCheat = 1
          youCheated = true
          DevCheats()
        } else {
          writeText('Deactivating cheat...')
          totalGold = 0
          goldCheat = 0
          writeText('You now have 0 gold.')
          DevCheats()
        }
        break;
      case 'Infinite EXP':
        if (expCheat === 0) {
          totalExp = -(Math.log(0))
          writeText('Cheat successfully activated!')
          expCheat = 1
          youCheated = true
          DevCheats()
        } else {
          writeText('Deactivating cheat...')
          totalExp = 0
          kixleyNCo[1].lev = 1
          writeText('You are now level 1 and have 0 exp.')
          DevCheats()
        }
        break;
      case 'Infinite Attack':
        if (attackCheat === 0) {
          baseAttackPower = kixleyNCo[1].attackPow
          kixleyNCo[1].attackPow = -(Math.log(0))
          writeText('Cheat successfully activated!')
          attackCheat = 1
          youCheated = true
          DevCheats()
        } else {
          writeText('Deactivating cheat...')
          kixleyNCo[1].attackPow = baseAttackPower
          writeText('You now have ' + kixleyNCo[1].attackPow + ' attack.')
          DevCheats()
        }
        break;
      case 'Infinite Health':
        if (healthCheat === 0) {
          kixleyNCo[1].hitPoints = -(Math.log(0))
          kixleyNCo[1].totalHP = kixleyNCo[1].hitPoints
          writeText('Cheat successfully activated!')
          healthCheat = 1
          youCheated = true
          DevCheats()
        } else {
          writeText('Deactivating cheat...')
          kixleyNCo[1].hitPoints = 100
          kixleyNCo[1].totalHP = kixleyNCo[1].hitPoints
          writeText('You now have 100 health.')
          DevCheats()
        }
        break;
      case 'Infinite Blobs of Doom':
        if (blobOfDoomCheat === 0) {
          kixleyNCo[1].blobs = -(Math.log(0))
          kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs
          writeText('Cheat successfully activated!')
          blobOfDoomCheat = 1
          youCheated = true
          DevCheats()
        } else {
          writeText('Deactivating cheat...')
          kixleyNCo[1].blobs = 0
          kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs
          writeText('You now have 0 blobs of doom.')
        }
        break;
      case 'Infinite Accuracy':
        if (accCheat === 0) {
          actualAccuracy = kixleyNCo[1].accuracy
          kixleyNCo[1].accuracy = -(Math.log(0));
          writeText('Cheat successfully activated!')
          accCheat = 1
          youCheated = true
          DevCheats()
        } else {
          writeText('Deactivating cheat...')
          accCheat = 0
          kixleyNCo[1].accuracy = actualAccuracy
          writeText('You now have normal accuracy.')
        }
        break;
      case 'Activate All':
        totalGold = -(Math.log(0))
        totalExp = -(Math.log(0))
        kixleyNCo[1].attackPow = -(Math.log(0))
        kixleyNCo[1].hitPoints = -(Math.log(0))
        kixleyNCo[1].totalHP = kixleyNCo[1].hitPoints
        kixleyNCo[1].blobs = -(Math.log(0))
        kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs
        goldCheat = 1
        expCheat = 1
        attackCheat = 1
        healthCheat = 1
        blobOfDoomCheat = 1
        youCheated = true
        writeText('All cheats activated!')
        DevCheats()
        break;
      case 'Leave':
        StartUpMenu()
        break;
      default:
        NotAnOption()
        DevCheats()
        break;
    }
  }
}


function DevPassAttempt() {
  answer = prompt('What is the password?', 'Leave').toUpperCase()
  switch (answer) {
    case 'LEAVE':
      alert('Now leaving')
      return 42
      break;
    case '65810':
      return true
      break;
    default:
      return false
      break;
  }
}

function Options() {
  writeText('This is the options menu!');
  writeText("Volume: " + volumeSettings);
  requestInput(["Volume", "Quality", "Text Pace", "Leave"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Volume':
        volumeSettings = prompt('What do you want to set the volume to?', '0 to 10');
        switch (volumeSettings) {
          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
          case '10':
            writeText('Volume set!');
            volumeSettings = parseInt(volumeSettings, 10);
            volumeSettings /= 10;
            fightMusic.volume = volumeSettings;
            towerMusic.volume = volumeSettings;
            placesMusic.volume = volumeSettings;
            menuMusic.volume = volumeSettings;
            townMusic.volume = volumeSettings;
            innMusic.volume = volumeSettings;
            marketplaceMusic.volume = volumeSettings;
            gameOverMusic.volume = volumeSettings;
            endMusic.volume = volumeSettings;
            Options();
            break;
          case "Dev Cheats":
            volumeSettings = "0";
            alert('Welcome to the secret area, where you can enable developer cheats.');
            alert('Don\'t use these if you\'re not a dev.');
            var temp = DevPassAttempt();
            if(temp === 42) {
              Options();
            } else if(temp) {
              alert("gud");
              DevCheats();
            } else {
              alert('Bad boy. Go sit in an infinite loop.');
              while (true) {
                alert('-rAQZdew')
                alert('That message was brought to you by Murphy, one of the programmer\'s dog.')
              }
            }
            break;
          default:
            writeText('It can only be from 1 to 10.');
            Options();
        }
        break;
      case 'Quality':
        writeText('What are you talking about? We don\'t have any pictures.');
        Options();
        break;
      case 'Text Pace':
        writeText('Hahahahahahahaha. All the text is instant.');
        Options();
        break;
      case 'Leave':
        if (from === 'in-game') {
          Menu();
        } else {
          StartUpMenu();
        }
        break;
    }
  }
}

function CheckIfGotAchieve(whichOne) {
  switch (whichOne) {
    case 'Kill':
      if (killCounter === 5) {
        writeText('You got the Achievement: Kill 5 Monsters.');
        compAchieve.push('Kill 5 Monsters');
      } else if (killCounter === 10) {
        writeText('You got the Achievement: Kill 10 Monsters.');
        compAchieve.push('Kill 10 Monsters');
      } else if (killCounter === 20) {
        writeText('You got the Achievement: Kill 20 Monsters.');
        compAchieve.push('Kill 20 Monsters');
      }
      break;
    case 'Level':
      if (kixleyNCo[1].lev === 5) {
        writeText('You got the Achievement: Reach Level 5.');
        compAchieve.push('Reach Level 5');
      } else if (kixleyNCo[1].lev === 10) {
        writeText('You got the Achievement: Reach Level 10.');
        compAchieve.push('Reach Level 10');
      } else if (kixleyNCo[1].lev === 20) {
        writeText('You got the Achievement: Reach Level 20.');
        compAchieve.push('Reach Level 20');
      }
      break;
    case 'Gold':
      if (cumulativeGold >= 1000 && getGoldAchieve === 0) {
        writeText('You got the Achievement: Get 1000 cumulative gold.');
        compAchieve.push('Get 1000 cumulative gold');
        getGoldAchieve = 1;
      } else if (cumulativeGold >= 2000 && getGoldAchieve === 1) {
        writeText('You got the Achievement: Get 2000 cumulative gold.');
        compAchieve.push('Get 2000 cumulative gold');
        getGoldAchieve = 2;
        alert('You have ' + 9 - compAchieve.length + ' achievements left!');
      } else if (cumulativeGold >= 5000 && getGoldAchieve === 2) {
        writeText('You got the Achievement: Get 5000 cumulative gold.');
        compAchieve.push('Get 5000 cumulative gold');
        getGoldAchieve = -(Math.log(0));
      }
      break;
  }
}

function ListingAchievements() {
  writeText('All of the achievements:');
  for (e = 0; e < allAchievements.length; e += 1) {
    writeText(allAchievements[e]);
  }
  writeText('Completed Achievements:');
  if (compAchieve.length === 0) {
    writeText('Nothing. :(');
  } else {
    for (e = 0; e < compAchieve.length; e += 1) {
      writeText(compAchieve[e]);
    }
  }
  achievementMenu();
}

function achievementMenu() {
  var temp = (compAchieve.length / allAchievements.length) * 100;
  writeText('This is the achievement menu. Here you can find the list of achievements, both completed and unfinished.');
  writeText("Achievement Completion: " + temp + "%");
  requestInput(["List Achievements", "Leave"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'List Achievements':
        ListingAchievements();
        break;
      case 'Leave':
        if (from !== 'in-game') {
          StartUpMenu();
        } else {
          Menu()
        }
        break;
    }
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
    switch (window.answer) {
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
    switch (window.answer) {
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
