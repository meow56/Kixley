import { kixleyNCo, fightHandler } from './fight.js';

window.onerror = function(message, source, lineno, colno, error) {
  if(error.message === "Thanks for playing!") {
    writeText(error.message);
  } else if(error.message === "Cannot read property 'toUpperCase' of null" || error.message === "Cannot read property 'toLowerCase' of null"){
    alert("You just pressed the \"Cancel\" button. That causes the game to end.");
  } else {
    alert("Kixley has run into an unexpected error.");
    alert("To help in debugging, Kixley has this to say:");
    alert(message);
    alert("Error in " + source);
    alert("Error found on line " + lineno);
    alert("Error found on column " + colno);
  }
}

// monster variables
var aabeaDestroysTown = false;
var dwNamesB = false; // MARKED FOR DELETION
var dwNames = [
  'Hey wait a minute, that was a bug',
  'Dalek',
  'Cyberman',
  'Weeping Angel',
  'Zygon',
  'Silurian',
  'Silent',
  'Master',
  'Special Weapons Dalek'
]; // MARKED FOR DELETION
// achievements
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
// travel
var timeGTOne = 0; // whether you get 6 or 7 BoD when Mithrómen sells you BoD
// level
var temp;
var levelReq = 300; // exp required until level up
var levelUpHealth = 50;
var totalExtraHealth = 0;
var levelUpBlobsOfDoom = 50;
// cheats
var goldCheat = 0;
var expCheat = 0;
var attackCheat = 0;
var healthCheat = 0;
var blobOfDoomCheat = 0;
var accCheat = 0;
var actualAccuracy;
var youCheated = false; // have you cheated, ever?
// other
var x; // rng
var PassOrNot = '';
var theWholeShebang = [
  'Kixley Beta 1.1',
  'Programmers:',
  'Ethan Lai',
  'Colin Pulis',
  'Jacob Kuschel',
  'Cameron Jordan',
  'John Georgiades',
  'Composer:',
  'Colin Pulis',
  'Special thanks to:',
  'The Stack Overflow community, for helping with bugs,',
  'MDN and Codecademy, for helping us learn how to JavaScript,',
  'Atlassian, for making Bitbucket, which was used in the early days to create this.',
  'And Github, on which we are hosting the game itself.'
]; // Credits!
// menu
var volumeSettings = '10';
// items
// accounts
// questing
var questKillAmt = 0; // amount of monsters you've killed for the quest
var questKillReq; // amount of monsters to kill
var reqItem;
var questGoldReq; // amount of gold you need to give galkemen
var questExpAmt = 0; // amount of exp you've gotten for the quest
var questExpReq; // amount of exp you need to get
var onAQuest = 0; // are you on a quest?
var y; // what type of quest
var questType = [
  'kill',
  'gold',
  'EXP',
  'item'
];
var possibleItems = [
  'wooden sword',
  'pair of speed boots'
];
var reward; // how much gold/exp you get when you finish a quest
// music

/*******************\
|      UTILITY      |
\*******************/

function resetSpec() {
  spec = [];
}

function detectMobileDevice() {
  if (navigator.userAgent.match(/Android/i) === true || navigator.userAgent.match(/webOS/i) === true || navigator.userAgent.match(/iPhone/i) === true || navigator.userAgent.match(/iPad/i) === true || navigator.userAgent.match(/iPod/i) === true || navigator.userAgent.match(/BlackBerry/i) === true || navigator.userAgent.match(/Windows Phone/i) === true) {
    return true;
  } else {
    return false;
  }
}

function GameOver() {
  if(gameOverMusic.paused) {
    playMusic(gameOverMusic);
  }
  for(var i = 0; i < dead.length; i++) {
    if(dead[i].called === "You") {
      writeTextWait('You died with ' + totalGold + ' gold, were level ' + dead[i].lev + ', had ' + dead[i].attackPow + ' power, and had a total of ' + dead[i].totalHP + ' health.', Function("Credits(makeButton)"))
    }
  }
  
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
}

function NotAnOption() {
  alert('That wasn\'t one of the options. Please try again.')
}

function Credits(whenDone) {
  for (i = 0; i < theWholeShebang.length - 1; i++) {
    writeText(theWholeShebang[i])
  }
  
  writeTextWait(theWholeShebang[theWholeShebang.length - 1], whenDone);
}

function DevCheats() {
  requestInput(["Infinite Gold", "Infinite EXP", "Infinite Attack", "Infinite Health", "Infinite Blobs of Doom", "Infinite Accuracy", "Activate All", "Command Line", "Leave"], determineAnswer);
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
      case "Command Line":
        answer = prompt("The command line. Type in functions to run.");
        youCheated = true;
        var temp2 = Function(answer);
        temp2();
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

function inTower() {
  if(towerMusic.paused) {
    playMusic(towerMusic);
  }
  writeText('With the gate shut behind you, you start following Tivél.');
  writeText("Suddenly, you hear footsteps from behind you!");
  writeText("You quickly duck into a nearby room as the group of people passes by.");
  writeText('You can hear someone say, "Ah, Tivél, back from your expedition?"');
  writeText('Tivél says, "Yes, Smatino has been destroyed."');
  writeText('The person says, "Good. Balbeag will be very happy, I\'m sure."');
  writeText('Tivél says, "Yes, yes. I should go though, I need to give him my report."');
  writeText('The person says, "Of course. Good day."');
  writeTextWait('You hear footsteps walking off.', hideOrFight);
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

function NIY() {
  alert('Sorry. That feauture hasn\'t been implemented yet.')
}

/**********************\
|       FIGHTING       |
\**********************/

function hideOrFight() {
  for(var i = 1; i < 4; i++) {
    monsterGroup[i] = new Fighter(100, 100, 90, 'Balbeag\'s Soldier ' + i, 10, 'Balbeag Worker', 100);
    monsterGroup[i].calledPlusThe = 'Balbeag\'s Soldier ' + i;
    monsterGroup[i].calledPlusthe = 'Balbeag\'s Soldier ' + i;
    monsterGroup[i].hitPoints = (100 + randomNumber(-10, 10)) * diffSetting + Math.pow(kixleyNCo[1].lev, 2) + monsterGroup[i].lev
    monsterGroup[i].totalHP = monsterGroup[i].hitPoints;
    monsterGroup[i].attackPow = (monsterGroup[i].lev + randomNumber(1, 6)) * diffSetting;
  }
  loc = 3
  numMons = 3;
  fightingGroup = true
  writeText("With the footsteps gone, you exit your hiding spot and start to follow Tivél. Before you can, you hear a shout from behind! Turning, you see the group of soldiers rushing at you!");
  for(var i = 0; i < inventory.length; i++) {
    if(document.getElementById(inventory[i][0].name + "_equip_select") !== null) {
      document.getElementById(inventory[i][0].name + "_equip_select").disabled = true;
    }
  }
  fightHandler = new Fight(kixleyNCo, monsterGroup);
  fightHandler.fightLoop();
}

function inTowerPostDoomedGroup() {
  loc = 4
  numMons = 1;
  writeText('With the soldiers dispatched, you hurry up the stairs to the top of the tower. As you approach the top, you can see Tivél leave a door. He sees you, a crazy look in his eyes, and shouts "DIE, SCUM!"')
  monsterGroup[1] = new Fighter(100, 100, 90, "Tivél", 25, "Balbeag Assistant", 100);
  monsterGroup[1].calledPlusThe = monsterGroup[1].called
  monsterGroup[1].calledPlusthe = monsterGroup[1].called
  fightingAAbea = true
  monsterGroup[1].hitPoints = (100 + randomNumber(-10, 10)) * diffSetting + monsterGroup[1].lev + Math.pow(kixleyNCo[1].lev, 2)
  monsterGroup[1].totalHP = monsterGroup[1].hitPoints;
  monsterGroup[1].attackPow = (monsterGroup[1].lev + randomNumber(2, 8)) * diffSetting;
  for(var i = 0; i < inventory.length; i++) {
    if(document.getElementById(inventory[i][0].name + "_equip_select") !== null) {
      document.getElementById(inventory[i][0].name + "_equip_select").disabled = true;
    }
  }
  fightHandler = new Fight(kixleyNCo, monsterGroup);
  fightHandler.fightLoop();
}

function finalBossFight() {
  loc = 5
  numMons = 1;
  if (kixleyNCo[1].chosenClass !== 12) {
    writeText('You use some blobs of doom that you find in Tivél\'s bag to blast down the door.')
    writeText("You are in a large throne room, and at the end of it is a throne. A person is sitting upon it.")
    writeText("The person stands.");
    writeText('"Ah, hello. Kixley, was it?"');
    writeText('You growl, "And I assume you\'re the Balbeag I\'ve heard so much about?"');
    writeText('Balbeag nods.');
    writeText('You say, "Why did you send Tivél to destroy Smatino?"');
    writeText('Balbeag chuckles. "It was you, my boy."');
    writeText('"Don\'t call me that. And what do you mean?"');
    writeText('"You\'ve been destroying all of my minions, of course. I had to stop you."');
    writeText('"...By destroying Smatino."');
    writeText('Balbeag hesitates. "Well, I... didn\'t think Tivél was strong enough to kill you. But uh, that doesn\'t matter! What matters is that you\'re in my throne room, which is unacceptable."');
    writeText('Balbeag smirks. "Are you ready to die?"');
    writeText('You adopt a fighting stance.');
    writeTextWait('"You should be asking yourself that." (Writer\'s Note: Sorry about the terrible line but I couldn\'t think of anything better o3o)', startFight);
  }
  function startFight() {
    monsterGroup[1] = new Fighter(100, 100, 90, "Balbeag", 50, "Boss", 100);
    monsterGroup[1].calledPlusThe = monsterGroup[1].called
    monsterGroup[1].calledPlusthe = monsterGroup[1].called
    fightingBalbeag = true
    monsterGroup[1].hitPoints = (100 + randomNumber(-10, 10)) * diffSetting + monsterGroup[1].lev + Math.pow(kixleyNCo[1].lev, 2);
    monsterGroup[1].attackPow = (monsterGroup[1].lev + randomNumber(5, 10)) * diffSetting;
    for(var i = 0; i < inventory.length; i++) {
      if(document.getElementById(inventory[i][0].name + "_equip_select") !== null) {
        document.getElementById(inventory[i][0].name + "_equip_select").disabled = true;
      }
    }
    fightHandler = new Fight(kixleyNCo, monsterGroup);
    fightHandler.fightLoop();
  }
}

/**********************\
| All that other stuff |
\**********************/

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

/* Congratulations! You found an easter egg.
          .-"-.
        .'     '.
       /=========\
      :           ;
      |===========|
      :           :
       \=========/
        `.     .'
          `~~~`
          
          ... This easter egg looks kinda flat. Almost like a football. >.>
 */


function beatTheGame() {
  if(endMusic.paused) {
    playMusic(endMusic);
  }
  writeText("You beat the game! Would you like to continue?");
  requestInput(["Yes", "No"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Yes':
        writeText('You return and help rebuild Smatino, ready to fight Balbeag\'s remaining monsters who still are evil, though their master is dead');
        writeText('Mountain Pass discovered!')
        mountainPass = true
        aabeaDestroysTown = false
        InTown()
        break;
      case 'No':
        var temp2 = document.getElementByID("buttons");
        var temp = document.createElement("BUTTON");
        temp.innerHTML = "Run";
        temp.id = "runbutton";
        temp.onclick = Function("openingMenu = true; temp = document.getElementById('buttons'); while(temp.firstChild !== null) { temp.removeChild(temp.firstChild); }; StartUpMenu();");
        temp2.appendChild(temp);
        const err = new Error("Thanks for playing!");
        throw err;
        break;
    }
  }
}

function StatToLevelUp() {
  writeText("Please choose a stat to level up.");
  requestInput(["Base Attack + " + temp, "Health + " + levelUpHealth, "Blobs of Doom + " + levelUpBlobsOfDoom], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Base Attack + ' + temp:
        writeText('You got ' + temp + ' base attack!')
        kixleyNCo[1].attackPow += temp
        baseAttackPower += temp
        break;
      case 'Health + ' + levelUpHealth:
        writeText('You got ' + levelUpHealth + ' health!')
        kixleyNCo[1].hitPoints += levelUpHealth
        kixleyNCo[1].totalHP += levelUpHealth
        break;
      case 'Blobs of Doom + ' + levelUpBlobsOfDoom:
        writeText('You got ' + levelUpBlobsOfDoom + ' blobs of doom!')
        kixleyNCo[1].blobs += levelUpBlobsOfDoom
        kixleyNCo[1].totalBlobs += levelUpBlobsOfDoom
        break;
    }
    Places();
  }
}

function checkForLevelUp() {
  if (totalExp >= levelReq) {
    kixleyNCo[1].lev += 1
    temp = Math.floor(1.2 * kixleyNCo[1].lev) - 1
    levelUpHealth = 50
    levelUpHealth += classHealthChanges[kixleyNCo[1].chosenClass]
    levelUpHealth *= kixleyNCo[1].lev - 1
    levelUpBlobsOfDoom = 50
    levelUpBlobsOfDoom *= kixleyNCo[1].lev - 1
    writeText('You leveled up!')
    levelReq += levelReq
    CheckIfGotAchieve('Level')
    StatToLevelUp()
  }
}

function towerSaveMenu() {
  writeText("Do you want to save?");
  requestInput(["Yes", "No"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Yes':
        save()
        break;
      case 'No':
        break;
    }
  }
}
