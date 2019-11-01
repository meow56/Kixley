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
var inSwamp;
var toMountains;
var plainsCounter = 0;
var swampDiscovery = false;
var mountainPass = false;
var timeGTOne = 0; // whether you get 6 or 7 BoD when Mithrómen sells you BoD
var swampCounter = 0;
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
  'And Atlassian, for making Bitbucket, which was used to create this.'
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

function Story() {
  if(monsterGroup.length >= 2) {
    monsterGroup[1] = new Fighter(100, randomNumber(5, 9), 90, 'Goblin', 1, "Fighting", 50);
  } else {
    monsterGroup.push(new Fighter(100, randomNumber(5, 9), 90, 'Goblin', 1, "Fighting", 50));
  }
  numMons = 1;
  monsterGroup[1].attackPow *= diffSetting;
  monsterGroup[1].lev = kixleyNCo[1].lev + randomNumber(0, 1);
  monsterGroup[1].hitPoints = 100 * diffSetting
  monsterGroup[1].totalHP = 100 * diffSetting
  for(var i = 0; i < catalog.length; i++) {
    catalog[i].cost *= diffSetting;
  }
  hpEff = 10 + (10 * (3 - diffSetting))
  kixleyNCo[1].accuracy += 15 * (3 - diffSetting)
  writeTextWait('You are a person named Kixley. You live in the land of Nulm. You are in the Vacant Plains, and you know the town called Smatino resides nearby. You know where it is, but there are monsters in the plains, and one has just spotted you.', Function("writeTextWait('Your attack power is ' + kixleyNCo[1].attackPow + '.', MonsTypeSwitch)"))
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

function FightRound(n) {
  if (n < 1) {
    return 1;
  } else {
    return Math.round(n);
  }
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

function Places() {
  if(marketplaceMusic.paused) {
    playMusic(marketplaceMusic);
  }
  writeText("Where do you go now?");
  loc = 1
  var temp = ["Town", "Plains", "Swamp", "Mountains", "Menu"];
  if(!swampDiscovery) {
    temp.splice(temp.indexOf("Swamp"), 1);
  }
  if(!mountainPass) {
    temp.splice(temp.indexOf("Mountains"), 1);
  }
  requestInput(temp, determineAnswer); 
  function determineAnswer() {
    switch (answer) {
      case 'Town':
        if (aabeaDestroysTown === false) {
          writeText('You walk into town, where there is a marketplace and an inn.')
          InTown()
        } else {
          writeText('As you near the outskirts of town, you notice the stream of people leaving town. Then you notice that the entire place is now just a gigantic blast crater. Somebody blew it up!!! You decide to investigate, and walk over to the stream of people.')
          writeText('When you reach the people, they all say this person named Tivél had just come to town and started fires all over, and then used some weird, magical powers to blow up Smatino.')
          writeText('You are sure this Tivél is the same as the one who you met in the swamp, and wish you had used some \'weird, magical powers\' to blow him up.')
          writeTextWait('You race back to the swamp, and see him from a distance. You can\'t, however, blow him up. There are too many vines in the way. So, you follow him. You see a large tower in the distance, and finally, after a few hours, reach it at night. You see Tivél enter, and then, as the gate is clanging down above him, you slide under it and manage to get in.', inTower)
        }
        break;
      case 'Plains':
        if (plainsCounter === 7) {
          writeText('As you are walking through the plains you see a map lying on the ground. It shows a path leading to a nearby swamp.')
          swampDiscovery = true
        }
        monsInitialize("plains");
        break;
      case 'Swamp':
        if (swampCounter === 7 && killCounter >= 14) {
          writeText('As you are walking through the swamp, you meet someone. He says his name is Tivél, and he is heading towards Smatino, but doesn\'t tell why.')
          aabeaDestroysTown = true
        }
        inSwamp = 1;
        monsInitialize("swamp");
        break;
      case 'Mountains':
        toMountains = true
        if(percentChance(50)) {
          monsInitialize("plains");
        } else {
          Mountains()
        }
        break;
      case 'Menu':
        Menu()
        break;
    }
  }
}

function Mountains() {
  writeText('You make it through the plains and head off into the mountains.')
  loc = 3;
  monsInitialize("mountains");
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

function InTown() {
  loc = 2
  writeText("Where to?");
  requestInput(["Market", "Inn", "Leave", "Menu"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Market':
        InShop()
        break;
      case 'Inn':
        InInn()
        break;
      case 'Leave':
        writeText('You leave town.')
        Places()
        break;
      case 'Menu':
        Menu()
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

function InShop() {
  writeText('The marketplace master greets you.')
  var temp2 = ["Buy", "Sell", "Leave"];
  var temp3 = true;
  for(var i = 0; i < inventory.length; i++) {
    if(inventory[i].type !== "item") {
      temp3 = false;
    }
  }
  if(temp3) {
    temp2.splice(temp2.indexOf("Sell"), 1);
    writeText("The marketplace master asks if you would like to buy anything.");
  } else {
    writeText("The marketplace master asks if you would like to buy or sell something.");
  }
  requestInput(temp2, determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Buy':
        Buy()
        break;
      case 'Sell':
        Sell()
        break;
      case 'Leave':
        InTown()
        break;
    }
  }
}


function Sell() {
  var temp = inventory.slice();
  function sellOptions(index) {
    if(temp[index].type === "item") {
      temp.splice(index, 1);
    } else {
      index++;
    }
    if(index < temp.length) {
      sellOptions(index);
    }
  }
  sellOptions(0);
  var temp2 = [];
  for(var i = 0; i < temp.length; i++) {
    temp2.push(temp[i][0].name);
  }
  temp2.push("Leave");
  writeText("What would you like to sell?");
  requestInput(temp2, determineAnswer);
  function determineAnswer() {
    if(answer === "Leave") {
      InShop();
    } else {
      for(var i = 0; i < temp2.length; i++) {
        if(answer === temp2[i]) {
          temp[i][0].sell();
        }
      }
    }
  }
}

function Buy() {
  var temp = [];
  for(var i = 0; i < catalog.length; i++) {
    if(findNameInventory(catalog[i].name) === null || catalog[i].type === "item") {
      temp.push(catalog[i].name + " (" + catalog[i].cost + " gold)");
    }
  }
  temp.push("Leave");
  writeText("What would you like to buy?");
  requestInput(temp, determineAnswer);
  function determineAnswer() {
    if(answer === "Leave") {
      InShop();
    } else {
      for(var i = 0; i < catalog.length; i++) {
        if(answer === catalog[i].name + " (" + catalog[i].cost + " gold)") {
          catalog[i].buy();
        }
      }
    }
  }
}


function InInn() {
  writeText('A musty scent fills your nose as you walk into the inn. The dim lights are a stark difference from the outside, and it takes a moment for your eyes to adjust. When they do, they show you a man grinning at you. "Welcom\' to the Rowdy Barstead. You ca\' spend the night here if you like. Only 50 gold. You can also go to the common room. Do jobs fer money. Buy stuff real cheap.')
  writeText("So whadda ya say?");
  requestInput(["Yes", "Common Room", "Casino", "Leave"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Yes':
        if (totalGold >= 50) {
          totalGold -= 50;
          var temp = randomNumber(1, 23);
          var temp2 = randomNumber(1, 2);
          if (temp2 < 10) {
            temp2.toString(10);
            temp2 = '0' + temp2;
          }
          writeText('The man gestures towards a room door. \'There\'s your room, room ' + temp.toString(10) + temp2 + '. Have a good night\'s rest.\'');
          writeText('You wake up fully refreshed, and new vigor fills your heart.');
          writeText('Hit points fully restored!');
          kixleyNCo[1].hitPoints = kixleyNCo[1].totalHP;
          writeText('You walk out of the room.');
          InInn();
        } else if (totalGold <= 50) {
          writeText('The Inn keeper sighs and says \'You don\'t have enough gold. Sorry, pardner!\'');
          writeText('You go back into town.');
          InTown()
        }
        break;
      case 'Leave':
        writeText('The man sighs as you leave the inn.')
        InTown()
        break;
      case 'Common Room':
        inCommonRoom()
        break;
      case "Casino":
        Casino();
        break;
    }
  }
}

function quest() {
  if (onAQuest === 0) {
    y = randomNumber(0, 3)
    writeText('You got a ' + questType[y] + ' quest!')
    switch (y) {
      case 0:
        questKillReq = randomNumber(7, 13)
        questKillAmt = 0;
        killQuestChoice()
        break;
      case 1:
        questGoldReq = Math.floor(randomNumber((50 * diffSetting), (62.5 * diffSetting)) + 1);
        questGoldAmt = 0;
        questGoldChoice()
        break;
      case 2:
        questExpReq = randomNumber((200 * diffSetting), 220 * diffSetting);
        questExpAmt = 0;
        questExpChoice()
        break;
      case 3:
        reqItem = possibleItems[randomNumber(0, 1)]
        questItemChoice()
        break;
      default:
        const err = new Error("Invalid quest type: Quest number " + y + " is not within an acceptable range.");
        throw err;
    }
  } else {
    switch (y) {
      case 0:
        killQuestEvaluate()
        break;
      case 1:
        goldQuestEvaluate()
        break;
      case 2:
        expQuestEvaluate()
        break;
      case 3:
        itemQuestEvaluate()
        break;
    }
  }
}

function GettingBlobsOfDoom() {
  if (totalGold >= 10) {
    totalGold -= 10
    kixleyNCo[1].blobs += 6
    if (timeGTOne === 1) {
      kixleyNCo[1].blobs++
      timeGTOne = 0
    }
    writeText('Ther\' ya go, pardner. Nice doin\' business with ya.')
  } else {
    writeText('I\'m not gonna give ya the blobs of doom if ya don\'t give me the monay. Sorry, pardner.')
  }
  if (kixleyNCo[1].blobs > kixleyNCo[1].totalBlobs) {
    kixleyNCo[1].blobs = kixleyNCo[1].totalBlobs
  }
  wantingMoreBlobs()
}

function wantingMoreBlobs() {
  writeText("Hey, kid! Ya want some more blobs o' doom? Yu'll get 7 this time, still fer 10 gold!");
  requestInput(["Yes", "No"], determineAnswer);
  //answer = prompt('Hey! Ya want some more blobs? Yu\'ll get 7 this time, still fer 10 gold!', 'Yes, No').toUpperCase()
  function determineAnswer() {
    switch (answer) {
      case 'Yes':
        timeGTOne = 1
        GettingBlobsOfDoom()
        break;
      case 'No':
        writeText('All righty then. See ya later!')
        InInn()
        break;
    }
  }
}

function blobsOfDoomShop() {
  writeText("You walk up to Mithrómen.");
  writeText("He looks at you and says, \"Hey kid. I'm runnin' low on money, so I'm sellin' my blobs o' doom. So far there's been no buyers. You up for it? Only 10 gold for 6 blobs o' doom.\"");
  requestInput(["Yes", "No"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Yes':
        writeText("Mithrómen's face lights up.");
        GettingBlobsOfDoom()
        break;
      case 'No':
        writeText('Mithrómen sighs as you leave.')
        InInn()
        break;
    }
  }
}

function questChoiceSwitch() {
  switch (answer) {
    case 'No':
      writeText('Galkemen looks like he wants to kill you, so you get away from him and leave the inn, but then decide to go back in and just avoid Galkemen.')
      InInn()
      break;
    case 'Yes':
      onAQuest = 1
      writeText('Galkemen hands you a piece of paper and has you sign it.')
      switch (y) {
        case 0:
        case 2:
          reward = randomNumber(15, 40) + 5 * (3 - diffSetting)
          break;
        case 1:
        case 3:
          reward = randomNumber(40, 90) + 5 * (3 - diffSetting)
          break;
      }
      InInn();
      break;
  }
}

function killQuestChoice() {
  writeText("Galkemen says \"Go kill " + questKillReq + " monsters.\"");
  requestInput(["Yes", "No"], questChoiceSwitch);
}

function questGoldChoice() {
  writeText("Galkemen says \"Gimme " + questgoldReq + " gold fer some exp.\"");
  requestInput(["Yes", "No"], questChoiceSwitch);
}

function questItemChoice() {
  writeText("Galkemen says \"Go gimme a " + reqItem + " fer some exp.\"");
  requestInput(["Yes", "No"], questChoiceSwitch);
}

function questExpChoice() {
  writeText("Galkemen says \"Go get " + questExpReq + " exp, so you can gi' my quests done faster.\"");
  requestInput(["Yes", "No"], questChoiceSwitch);
}

function buySpeedBootsCheaply() {
  writeText("You walk up to Gurthmereth.");
  writeText("Gurthmereth says, \"Low on money. Got speed boots. Will sell cheap. Only 70 gold.\"");
  requestInput(["Yes", "No"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Yes':
        if (totalGold >= 70) {
          writeText('Gurthmereth hands you the boots as you hand him the money.')
          totalGold -= 70
          inventory.push([new InventoryItem("Speed Boots", Function("this.accuracy + (5 * (3 - diffSetting))"), "boots"), 1]);
        } else {
          writeText('Gurthmereth sighs and says \'You don\'t have enough money. I want the money.\' Then you leave the common room.')
          InInn()
        }
        break;
      case 'No':
        writeText('Gurthmereth looks at your receding back as you leave the common room.')
        InInn()
        break;
    }
  }
}

function buyWoodenSwordsCheap() {
  writeText("You walk up to Maegfin.");
  writeText("Maegfin says \"Low on money. Got wooden swords. Will sell cheap. Only 35 gold.\"");
  requestInput(["Yes", "No"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Yes':
        if (totalGold >= 35) {
          writeText('Maegfin hands you the sword, along with a sheath, as you hand him the money.')
          totalGold -= 35
          inventory.push([new InventoryItem("Wooden Sword", Function("this.finalDamage *= 1 + (0.05 * (3 - diffSetting))"), "weapon"), 1]);
          inCommonRoom()
        } else {
          writeText('Maegfin sighs and says \'You don\'t have enough money. I want the money.\' Then you leave the common room.')
          InInn()
        }
        break;
      case 'No':
        writeText('Maegfin looks at your receding back as you leave the common room.')
        InInn()
        break;
    }
  }
}
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

function inCommonRoom() {
  writeText("The Innkeeper gestures towards a loud, brightly lit room filled with people.");
  writeText("4 people stand out. They introduce themselves as Mithrómen, Galkemen, Maegfin, and Gurthmereth respectively.");
  writeText("Who would you like to talk to?");
  requestInput(["Talk to Mithrómen", "Talk to Galkemen", "Talk to Maegfin", "Talk to Gurthmereth", "Leave"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Talk to Mithrómen':
        blobsOfDoomShop()
        break;
      case 'Talk to Galkemen':
        quest()
        break;
      case 'Talk to Maegfin':
        buyWoodenSwordsCheap()
        break;
      case 'Talk to Gurthmereth':
        buySpeedBootsCheaply()
        break;
      case 'Leave':
        writeText('You leave.')
        InInn()
        break;
    }
  }
}

function killQuestEvaluate() {
  if (questKillAmt >= questKillReq) {
    writeText('Galkemen says \'Thanks fer killin\' those monsters. Here\'s ' + reward + ' gold.\'')
    totalGold += reward
    onAQuest = 0;
    inCommonRoom()
  } else {
    writeText('Galkemen says \'GO KILL ' + (questKillReq - questKillAmt) + 'MORE MONSTERS!!!\' He then proceeds to throw you out the (thankfully open) window.');
    InTown()
  }
}

function goldQuestEvaluate() {
  if (totalGold >= questGoldReq) {
    writeText('Galkemen says \'Thanks fer givin\' me this gold. Here\'s ' + reward + ' exp.\'')
    totalGold -= questGoldReq
    totalExp += reward
    onAQuest = 0;
    inCommonRoom()
  } else {
    writeText('Galkemen says \'GO GET ' + (questGoldReq - totalGold) + ' MORE GOLD!!!\' He then proceeds to throw you out the (thankfully open) window.');
    InTown()
  }
}

function expQuestEvaluate() {
  if (questExpAmt >= questExpReq) {
    writeText('Galkemen says \'Thanks fer gettin\' that exp. Here\'s ' + reward + ' gold.\'')
    totalGold += reward
    onAQuest = 0;
    inCommonRoom();
  } else {
    writeText('Galkemen says \'GO GET ' + (questExpReq - questExpAmt) + ' MORE EXP!!!\' He then proceeds to throw you out the (thankfully open) window.');
    InTown()
  }
}

function itemQuestEvaluate() {
  if ((reqItem === "wooden sword" && findNameInventory("Wooden Sword") !== null) || (reqItem === "pair of speed boots" && findNameInventory("Speed Boots") !== null)) {
    writeText('Galkemen says \'Thanks fer gettin\' that ' + reqItem + '. Here\'s ' + reward + ' exp.\'')
    totalExp += reward
    onAQuest = 0;
    inCommonRoom()
  } else {
    writeText('Galkemen says \'GO GET A ' + (reqItem.toUpperCase()) + '!!!\' He then proceeds to throw you out the (thankfully open) window.')
    InTown()
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








//export randomNumber;
