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
function InventoryItem(name, effect, type, cost, description) {
  this.name = name; // string
  this.effect = effect; // function eg Function("this.finalDamage * 1.05")
  this.type = type; // string eg "weapon", "boots", "helmet", etc
  this.cost = cost;
  if(this.type !== "item") {
    this.equipped = new Fighter();
    this.equipped.called = "unequip";
  }
  this.buy;
  if(this.type !== "item") {
    this.buy = function() {
      if(totalGold >= this.cost) {
        writeText("Are you sure?");
        writeText("The " + this.name + " costs " + this.cost + " gold.");
        requestInput(["Yes", "No"], determineAnswer);
        var temp = this;
        function determineAnswer() {
          switch (answer) {
            case 'Yes':
              writeText(temp.name + ' bought!')
              inventory.push([temp, 1]);
              totalGold -= temp.cost;
              InShop();
              break;
            case 'No':
              InShop();
              break;
          }
        }
      } else {
        writeTextWait("You don't have enough gold.", InShop);
      }
    }
  } else {
    this.buy = function() {
      writeText("How many " + this.name.toLowerCase() + "s would you like to buy?");
      writeText("Each one costs " + this.cost + " gold.");
      writeText("Leave the field blank to leave.");
      var temp2 = this;
      requestNumber(determineAnswer, 0);
      function determineAnswer() {
        if(answer !== "") {
          answer = parseInt(answer, 10);
          var temp = answer;
          if(totalGold >= (temp * temp2.cost)) {
            writeText("Are you sure?");
            writeText("You're going to buy " + temp + " " + temp2.name.toLowerCase() + "s. This will cost " + (temp2.cost * temp) + " gold.");
            requestInput(["Yes", "No"], determineAnswer2);
            function determineAnswer2() {
              switch (answer) {
                case "Yes":
                  writeText(temp2.name + '(s) bought!')
                  if(findNameInventory(temp2.name) !== null) {
                    inventory[findNameInventory(temp2.name)][1] += temp;
                  } else {
                    inventory.push([temp2, temp]);
                  }
                  totalGold -= temp2.cost * temp;
                  InShop();
                  break;
                case "No":
                  InShop();
                  break;
              }
            }
          } else {
            writeText("You don't have enough gold. At most you could buy " + Math.floor(totalGold / temp2.cost) + " " + temp2.name.toLowerCase + "(s).");
            InShop();
          }
        } else {
          InShop();
        }
      }
    }
  }
  this.desc = description;
  this.sell;
  if(this.type !== "item") {
    this.sell = function() {
      var temp = this;
      writeText('A guy shows up and offers ' + .9 * temp.cost + ' gold for your ' + temp.name.toLowerCase() + '.')
      requestInput(["Yes", "No"], determineAnswer2);
      function determineAnswer2() {
        switch (answer) {
          case 'Yes':
            totalGold += .9 * temp.cost;
            inventory[findNameInventory(temp.name)][1] = 0;
            writeText(temp.name + ' sold!');
            displayInventory(false);
            InShop();
            break;
          case 'No':
            InShop();
            break;
        }
      }
    }
  }
} 

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
var levelReq = 100 + kixleyNCo[1].lev * 200; // exp required until level up
var levelUpHealth = 50;
var totalExtraHealth = levelUpHealth * (kixleyNCo[1].lev - 1);
var levelUpBlobsOfDoom = 50;
var classHealthChanges = [
  15, -15, -25,
  15,
  30, -30,
  0,
  0,
  7, -7, -75,
  -(Math.log(0))
];
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
var answer;
var diffSetting = 0; // difficulty: Easy = 0.5, Normal = 1.0, Hard = 1.5, Epic = 2.0, Legend = 2.5
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
var openingMenu;
var chosenClass;
var loc;
var volumeSettings = '10';
var from;
// items
var inventory = []; // 2D: [[InventoryItem, amount], [InventoryItem, amount]]
var pastInventory; // used for hud update
var catalog = [new InventoryItem("Health Potion", useHealthPotion, "item", 20, "Restores health."), 
               new InventoryItem("Wooden Sword", Function("this.equipped.finalDamage *= 1 + (0.05 * (3 - diffSetting))"), "weapon", 50, "Increases attack by a small amount."), 
               new InventoryItem("Simple Staff", Function("this.equipped.tempMagicSkillz *= 1 + (0.05 * (3 - diffSetting))"), "weapon", 50, "Increases magic by a small amount."), 
               new InventoryItem("Speed Boots", Function("this.equipped.accuracy += 5 * (3 - diffSetting)"), "boots", 100, "Increases accuracy."), 
               new InventoryItem("Arrows", Shoot, "item", 5, "Used with the Archer class.")];
var hpEff = 10 + (10 * (3 - diffSetting)); // how much HP health potions restore
// accounts
var userCheck;
var username;
var useDefaults = false; // whether to use both defaults
var signedIn;
var defaultDifficulty; // normal difficulty you set in your account
var defaultClass; // normal class you set in your account
var settingDefault = false;
var useDefaultClass = false; // whether to use your default class
var useDefaultDiff = false; // whether to use your default difficulty
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
var fightMusic;
var towerMusic;
var placesMusic;
var menuMusic;
var townMusic;
var innMusic;
var marketplaceMusic;
var gameOverMusic;
var endMusic;

/*******************\
|      UTILITY      |
\*******************/

function findNameInventory(name) {
  for(var i = 0; i < inventory.length; i++) {
    if(inventory[i][0].name === name) {
      return i;
    }
  }
  return null;
}

function displayInventory(foo) { // foo: boolean for update checker bypass
  for(var i = 0; i < inventory.length; i++) {
    for(var j = 1; j < kixleyNCo.length; j++) {
      if(inventory[i][0].equipped.called === kixleyNCo[j].called) {
        var temp2 = false;
        for(var k = 0; k < kixleyNCo[j].equipped.length; k++) {
          if(kixleyNCo[j].equipped[k].name === inventory[i][0].name) {
            temp2 = true;
          }
        }
        if(!temp2) {
          kixleyNCo[j].equipped.push(inventory[i][0]);
        }
      }
    }
  }
  for(var i = 0; i < inventory.length; i++) {
    if(inventory[i][1] === 0) {
      inventory.splice(i, 1);
    }
  }
  var temp = "";
  for(var i = 0; i < inventory.length; i++) {
    temp += inventory[i][0].name;
    temp += inventory[i][1];
    if(document.getElementById(inventory[i][0].name + "_equip_select") !== null) { // equipment equipping updates
      var temp2 = document.getElementById(inventory[i][0].name + "_equip_select").value;
      if(temp2 !== inventory[i][0].equipped.called) { // if the dropdown is different then the person equipped to
        for(var j = 0; j < inventory[i][0].equipped.equipped.length; j++) { // why did i name them both equipped D:
          if(inventory[i][0].equipped.equipped[j].name === inventory[i][0].name) {
            inventory[i][0].equipped.equipped.splice(j, 1); // unequip, player side
          }
        }
        if(temp2 === "unequip") { // if the player wants to unequip, unequip
          inventory[i][0].equipped = new Fighter();
          inventory[i][0].equipped.called = "unequip"; // unequip, item side
          inventory[i][0].equipped.equipped.push(inventory[i][0]);
        } else {
          for(var j = 1; j < kixleyNCo.length; j++) {
            if(temp2 === kixleyNCo[j].called) { // name match
              var temp3 = inventory[i][0].type; // type of inventory to equip
              function deleteTypeMatch(index) {
                if(kixleyNCo[j].equipped[index].type === temp3) { // if player has matching type equipped
                  var temp4 = document.getElementById(kixleyNCo[j].equipped[index].name + "_equip_select"); // dropdown
                  for(var k = 0; k < temp4.childNodes.length; k++) {
                    if(temp4.childNodes[k].value === "unequip") {
                      temp4.childNodes[k].selected = "true"; // unequip it
                    }
                  }
                  kixleyNCo[j].equipped[index].equipped = new Fighter();
                  kixleyNCo[j].equipped[index].equipped.called = "unequip"; // unequip, inventory side
                  kixleyNCo[j].equipped.splice(index, 1);
                } else {
                  index++;
                }
                if(index < kixleyNCo[j].equipped.length) {
                  deleteTypeMatch(index);
                }
              }
              if(kixleyNCo[j].equipped.length !== 0) {
                deleteTypeMatch(0);
              }
              inventory[i][0].equipped = kixleyNCo[j]; // equip, inventory side
              kixleyNCo[j].equipped.push(inventory[i][0]); // equip, player side
              foo = true; // hud update bypass
            }
          }
        }
      }
    }
  }
  
  if(pastInventory !== temp || foo) {
    deleteInventoryText(); // clear inventory screen
    
    function writeTextInfo(text) { // write text to info
      if(document.getElementById("You_stats") !== null) {
        var temp = document.getElementById("You_stats");
        if(document.getElementById("inventory") === null) {
          var temp3 = document.createElement("DIV");
          temp3.id = "inventory";
          var temp4 = document.getElementById("You_info");
          temp.insertBefore(temp3, temp4.nextSibling);
        } else {
          var temp3 = document.getElementById("inventory");
        }
        var temp2 = document.createElement("PARAGRAPH");
        temp2.innerHTML = text;
        temp2.id = text;
        temp3.appendChild(temp2);
        temp2 = document.createElement("BR");
        temp2.id = text + "_br";
        temp3.appendChild(temp2);
      }
    }
    
    writeTextInfo("Inventory:");
    if(inventory.length === 0) {
      writeTextInfo("Nothing.");
    } else {
      for(var i = 0; i < inventory.length; i++) {
        if(inventory[i][1] !== 1 && inventory[i][0].type === "item") {
          writeTextInfo("<strong>" + inventory[i][0].name + " (" + inventory[i][1] + ")</strong>");
          writeTextInfo(inventory[i][0].desc);
        } else if(inventory[i][0].type === "item") {
          writeTextInfo("<strong>" + inventory[i][0].name + "</strong>");
          writeTextInfo(inventory[i][0].desc);
        } else {
          writeTextInfo("<strong>" + inventory[i][0].name + "</strong>");
          var temp = document.getElementById("<strong>" + inventory[i][0].name + "</strong>");
          temp.style.float = "left";
          temp = document.createElement("SELECT"); // dropdown menu
          temp.id = inventory[i][0].name + "_equip_select";
          temp.style.float = "right";
          var temp2 = [];
          for(var k = 1; k < kixleyNCo.length; k++) {
            temp2.push(kixleyNCo[k].called); // list of names
          }
          var temp3 = document.createElement("OPTION");
          temp3.value = "unequip";
          if(inventory[i][0].equipped.called === "unequip") {
            temp3.selected = "true";
          }
          temp.appendChild(temp3);
          for(var j = 0; j < temp2.length; j++) {
            var temp3 = document.createElement("OPTION");
            temp3.innerHTML = temp2[j];
            if(inventory[i][0].equipped.called === temp2[j]) {
              temp3.selected = "true";
            }
            temp.appendChild(temp3);
          }
          document.getElementById("inventory").insertBefore(temp, document.getElementById("<strong>" + inventory[i][0].name + "</strong>_br"));
          writeTextInfo(inventory[i][0].desc);
        }
      }
    }
    pastInventory = ""; // update inventory check
    for(var i = 0; i < inventory.length; i++) {
      pastInventory += inventory[i][0].name;
      pastInventory += inventory[i][1];
    }
    kixleyNCo[1].showHealth(true); // health show bypass; need to update because otherwise the inventory appears below everything else
  }
}

function deleteInventoryText() {
  var temp = document.getElementById("inventory");
  if(temp !== null) {
    document.getElementById("You_stats").removeChild(temp);
  }
}

function playMusic(which) { // in the form of the variable ie fightMusic, placesMusic, etc.
  fightMusic.pause();
  fightMusic.currentTime = 0;
  towerMusic.pause();
  towerMusic.currentTime = 0;
  placesMusic.pause();
  placesMusic.currentTime = 0;
  menuMusic.pause();
  menuMusic.currentTime = 0;
  townMusic.pause();
  townMusic.currentTime = 0;
  innMusic.pause();
  innMusic.currentTime = 0;
  marketplaceMusic.pause();
  marketplaceMusic.currentTime = 0;
  gameOverMusic.pause();
  gameOverMusic.currentTime = 0;
  endMusic.pause();
  endMusic.currentTime = 0;
  which.play();
}

function loadMusic() {
  fightMusic = document.getElementById('FightMusic');
  towerMusic = document.getElementById('TowerMusic');
  placesMusic = document.getElementById('MarketplaceMusic');
  menuMusic = document.getElementById('MenuMusic');
  townMusic = document.getElementById('MarketplaceMusic');
  innMusic = document.getElementById('MarketplaceMusic');
  marketplaceMusic = document.getElementById('MarketplaceMusic');
  gameOverMusic = document.getElementById('GameOverMusic');
  endMusic = document.getElementById('EndMusic');
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
  answer = " ";
  var temp2 = document.getElementById("buttons"); // find the div for buttons
  for(var i = 0; i < options.length; i++) {
    var temp = document.createElement("BUTTON"); // create buttons
    temp.innerHTML = options[i]; // set button to have proper text
    temp.onclick = Function("answer = \"" + options[i] + "\""); // set onclick so the buttons do stuff
    temp2.appendChild(temp); // put the new button in the div
    var temp3 = document.createElement("BR");
    temp2.appendChild(temp3);
  }
  
  waitForUserInput(); // wait for the player to select an option
  
  function waitForUserInput() {
    if(answer === " ") {
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
  temp2.onclick = Function("answer = 'Next';");
  temp.appendChild(temp2);
  answer = " ";
  
  waitForUserInput(); // wait for the player to select next
  
  function waitForUserInput() {
    if(answer === " ") {
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

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseBool(stringBool) {
  if (stringBool === 'true') {
    return true
  } else if (stringBool === 'false') {
    return false
  } else {
    return stringBool
  }
}

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

function percentChance(percent) {
  return (1 + (Math.random() * 99)) <= percent
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
  if(menuMusic.paused) {
    playMusic(menuMusic);
  }

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
  
  username = localStorage.getItem('staySignedInAs')
  if (username !== null) {
    useDefaults = localStorage.getItem('Defaults Used?' + username + 'Kixley@65810')
    useDefaults = parseBool(useDefaults)
    if (useDefaults === false) {
      useDefaultDiff = localStorage.getItem('Default Diff Used?' + username + 'Kixley@65810')
      useDefaultDiff = parseBool(useDefaultDiff)
      useDefaultClass = localStorage.getItem('Default Class Used?' + username + 'Kixley@65810')
      useDefaultClass = parseBool(useDefaultClass)
    }
  }
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

function Difficulty() {
  if (useDefaults === false || useDefaultDiff === false) {
    writeText("What difficulty?");
    requestInput(["Easy", "Normal", "Hard", "Epic", "Legend"], determineAnswer);
    function determineAnswer() {
      switch (answer) {
        case 'Easy':
          diffSetting = 0.5
          break;
        case 'Normal':
          diffSetting = 1
          break;
        case 'Hard':
          diffSetting = 1.5
          break;
        case 'Epic':
          diffSetting = 2
          break;
        case 'Legend':
          diffSetting = 2.5
          break;
      }
      if(settingDefault) {
        settingDefault = false
        localStorage.setItem(username + 'Difficulty@Kixley@65810', diffSetting)
        inAccount() 
      } else {
        ChooseClass()
      }
    }
  } else {
    diffSetting = localStorage.getItem(username + 'Difficulty@Kixley@65810')
    diffSetting = parseInt(diffSetting, 10)
    if(monsterGroup.length >= 2) {
      monsterGroup[1] = new Fighter(100, randomNumber(5, 9), 90, 'Goblin', 1, "Fighting", 50);
    } else {
      monsterGroup.push(new Fighter(100, randomNumber(5, 9), 90, 'Goblin', 1, "Fighting", 50));
    }
    monsterGroup[1].attackPow *= diffSetting;
    monsterGroup[1].lev = kixleyNCo[1].lev + randomNumber(0, 1);
    monsterGroup[1].hitPoints = 100 * diffSetting
    monsterGroup[1].totalHP = 100 * diffSetting
    for(var i = 0; i < catalog.length; i++) {
      catalog[i].cost *= diffSetting;
    }
    hpEff = 10 + (10 * (3 - diffSetting))
    kixleyNCo[1].accuracy += 15 * (3 - diffSetting)
  }
}

function KnightClass() {
  resetSpec()
  writeText("The Knight is a fierce warrior. He/She knows when to fight and when to block, and trains him/herself ceaselessly.");
  writeText("Attack + 2");
  writeText("Health + 15");
  writeText("Blobs of Doom (mana) - 100");
  writeText("Spells 50% effective");
  requestInput(["Choose", "Exit"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Choose':
        ChoosingAClass(chosenClass)
        break;
      case 'Exit':
        ChooseClass()
        break;
    }
  }
}

function MageClass() {
  resetSpec()
  writeText("The Mage does not overuse the fight option. Rather, he/she uses magical attacks that damage the enemy.");
  writeText("Attack - 2");
  writeText("Blobs of Doom (mana) + 100");
  writeText("Health - 15");
  writeText("Spells 150% effective");
  requestInput(["Choose", "Exit"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Choose':
        ChoosingAClass(chosenClass)
        break;
      case 'Exit':
        ChooseClass()
        break;
    }
  }
}

function BarbarianClass() {
  resetSpec()
  writeText("The Barbarian hits hard, but at the cost of health. With the Rage spell, he/she can knock out enemies with a single hit.");
  writeText("Attack + 4");
  writeText("Health - 25");
  requestInput(["Choose", "Exit"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Choose':
        ChoosingAClass(chosenClass)
        break;
      case 'Exit':
        ChooseClass()
        break;
    }
  }
}

function ClericClass() {
  resetSpec()
  writeText("The Cleric would prefer to heal friends than attack foes, but he/she will have to fight now. With the new Heal spell, they can restore some of their health.");
  writeText("Attack - 3");
  writeText("Health + 10");
  writeText("Blobs of Doom (mana) + 50");
  writeText("Spells 125% effective");
  writeText("Heal Spell");
  requestInput(["Choose", "Exit"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Choose':
        ChoosingAClass(chosenClass)
        break;
      case 'Exit':
        ChooseClass()
        break;
    }
  }
}

function PrinceClass() {
  resetSpec()
  writeText("The Prince is like a Knight on steroids. The fight option is definitely the choice for this class.");
  writeText("Attack + 4");
  writeText("Health + 30");
  writeText("Blobs of Doom (mana) - 200");
  writeText("Spells 25% effective");
  requestInput(["Choose", "Exit"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Choose':
        ChoosingAClass(chosenClass)
        break;
      case 'Exit':
        ChooseClass()
        break;
    }
  }
}

function ArchmageClass() {
  resetSpec()
  writeText("The Arch-Mage is like a Mage on steroids. You should definitely use some magic as this class.");
  writeText("Attack - 4");
  writeText("Health - 30");
  writeText("Blobs of Doom (mana) + 200");
  writeText("Spells 175% effective");
  requestInput(["Choose", "Exit"], determineAnswer);
  //answer = prompt('Arch-Mage', 'Inspect, Choose, Exit').toUpperCase()
  function determineAnswer() {
    switch (answer) {
      case 'Choose':
        ChoosingAClass(chosenClass)
        break;
      case 'Exit':
        ChooseClass()
        break;
    }
  }
}

function ThiefClass() {
  spec = ['Steal', 'A 43% chance to steal something from a monster, increasing your attack (for that battle) and decreasing theirs!']
  actualSpec = Steal;
  writeText("The Thief class has put his/her stealing ability to good use. Now, he/she steals from monsters!");
  writeText("Attack - 1");
  writeText("Blobs of Doom (mana) - 50");
  writeText("Accuracy + 20%");
  writeText("50% more drops");
  writeText("Special Attack: Steal");
  writeText("    A 43% chance to steal something from a monster, increasing your attack (for that battle) and decreasing theirs!");
  requestInput(["Choose", "Exit"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Choose':
        ChoosingAClass(chosenClass)
        break;
      case 'Exit':
        ChooseClass()
        break;
    }
  }
}

function NinjaClass() {
  resetSpec()
  writeText("The Ninja class is oriented towards hitting more and getting hit less. With higher accuracy, this master of hiding also decreases his/her opponent\'s accuracy.");
  writeText("Attack - 2");
  writeText("Blobs of Doom (mana) - 50");
  writeText("Accuracy + 25%");
  writeText("Monster Accuracy - 35%");
  requestInput(["Choose", "Exit"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Choose':
        ChoosingAClass(chosenClass)
        break;
      case 'Exit':
        ChooseClass()
        break;
    }
  }
}

function CavalryClass() {
  resetSpec()
  writeText("The Cavalry class is like the Knight, but has a higher crit chance. However, the other advantages are less.");
  writeText("Attack + 1");
  writeText("Health + 7"); // stop it no
  writeText("Crit Chance + 10%");
  writeText("Crit Multiplier + 0.5");
  writeText("Blobs of Doom (mana) - 150");
  writeText("Spells 40% effective");
  requestInput(["Choose", "Exit"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Choose':
        ChoosingAClass(chosenClass)
        break;
      case 'Exit':
        ChooseClass()
        break;
    }
  }
}

function ArcherClass() {
  spec = ['Shoot', 'You drop back and shoot an arrow at the monster, decreasing your enemy\'s accuracy. However, this attack costs arrows.']
  actualSpec = Shoot;
  writeText("The Archer class isn't the strongest, but they still can fight well. With the Shoot attack, they can inflict damage while making the monster less accurate.");
  writeText("Attack - 2");
  writeText("Health - 7"); // ah god why
  writeText("Blobs of Doom (mana) - 15");
  writeText("Spells 110% effective");
  writeText("Accuracy + 30%");
  writeText("Special Attack: Shoot");
  writeText("    You drop back and shoot an arrow at the monster, decreasing your enemy\'s accuracy. However, this attack costs arrows.");
  requestInput(["Choose", "Exit"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Choose':
        ChoosingAClass(chosenClass)
        break;
      case 'Exit':
        ChooseClass()
        break;
    }
  }
}

function ChoosingAClass(chosenClass) {
  if (useDefaults === true) {
    answer = "Yes"
    chosenClass = localStorage.getItem(username + 'Class@Kixley@65810')
    determineAnswer();
  } else {
    writeText("Are you sure?");
    requestInput(["Yes", "No"], determineAnswer);
  }
  function determineAnswer() {
    switch (answer) {
      case "Yes":
        switch (chosenClass) {
          case 'Knight':
            kixleyNCo[1].attackPow += 2
            kixleyNCo[1].hitPoints += 15
            kixleyNCo[1].totalHP += 15
            kixleyNCo[1].blobs -= 100
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].magicSkillz -= 0.5
            kixleyNCo[1].chosenClass = 0
            break;
          case 'Mage':
            kixleyNCo[1].attackPow -= 2
            kixleyNCo[1].hitPoints -= 15
            kixleyNCo[1].totalHP -= 15
            kixleyNCo[1].blobs += 100
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].magicSkillz += 0.5
            kixleyNCo[1].chosenClass = 1
            break;
          case 'Barbarian':
            kixleyNCo[1].attackPow += 4
            kixleyNCo[1].hitPoints -= 25
            kixleyNCo[1].totalHP -= 25
            kixleyNCo[1].chosenClass = 2
            break;
          case 'Cleric':
            kixleyNCo[1].attackPow -= 3
            kixleyNCo[1].knownSpells.push("Heal");
            kixleyNCo[1].spellCosts.push(30);
            kixleyNCo[1].blobs += 50
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].magicSkillz += 0.25
            kixleyNCo[1].hitPoints += 15
            kixleyNCo[1].totalHP += 15
            kixleyNCo[1].chosenClass = 3
            break;
          case 'Prince':
            kixleyNCo[1].attackPow += 4
            kixleyNCo[1].hitPoints += 30
            kixleyNCo[1].totalHP += 30
            kixleyNCo[1].blobs -= 200
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].magicSkillz -= 0.75
            kixleyNCo[1].chosenClass = 4
            break;
          case 'Arch-Mage':
            kixleyNCo[1].attackPow -= 4
            kixleyNCo[1].hitPoints -= 30
            kixleyNCo[1].totalHP -= 30
            kixleyNCo[1].blobs += 200
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].magicSkillz += 0.75
            kixleyNCo[1].chosenClass = 5
            break;
          case 'Thief':
            kixleyNCo[1].attackPow -= 1
            kixleyNCo[1].blobs -= 50
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].accuracy += 15
            dropMult += 0.5
            kixleyNCo[1].chosenClass = 6
            break;
          case 'Ninja':
            kixleyNCo[1].attackPow -= 2
            kixleyNCo[1].blobs -= 50
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].accuracy += 20
            monsterGroup[1].accuracy -= 10
            kixleyNCo[1].chosenClass = 7
            break;
          case 'Cavalry':
            kixleyNCo[1].attackPow += 1
            kixleyNCo[1].hitPoints += 7
            kixleyNCo[1].totalHP += 7
            kixleyNCo[1].critChance += 10
            kixleyNCo[1].blobs -= 150
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].magicSkillz -= 0.6
            kixleyNCo[1].chosenClass = 8
            break;
          case 'Archer':
            kixleyNCo[1].attackPow -= 2
            kixleyNCo[1].hitPoints -= 7
            kixleyNCo[1].totalHP -= 7
            kixleyNCo[1].blobs -= 15
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].magicSkillz += 10
            kixleyNCo[1].accuracy += 30
            kixleyNCo[1].chosenClass = 9
            break;
            /*
          case 'Super Hardcore':
            kixleyNCo[1].magicSkillz = (1 / temp)
            kixleyNCo[1].attackPow -= 5
            kixleyNCo[1].totalHP -= 75
            kixleyNCo[1].hitPoints -= 75
            kixleyNCo[1].blobs -= 300
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].chosenClass = 10
            break;
          case 'Vala':
            kixleyNCo[1].magicSkillz /= 0
            kixleyNCo[1].attackPow /= 0
            kixleyNCo[1].totalHP /= 0
            kixleyNCo[1].hitPoints /= 0
            kixleyNCo[1].blobs /= 0
            kixleyNCo[1].totalBlobs /= 0
            kixleyNCo[1].critChance /= 0
            kixleyNCo[1].accuracy /= 0
            kixleyNCo[1].chosenClass = 11
            break;
            */
        }
        if (settingDefault === false) {
          kixleyNCo[1].magicSkillz *= (3 - diffSetting)
          if (useDefaults === false) {
            writeTextWait('You are now a ' + chosenClass + '!', Story)
          }
        } else {
          settingDefault = false
          localStorage.setItem(username + 'Class@Kixley@65810', chosenClass)
          inAccount()
        }
        break;
      case "No":
        ChooseClass()
        break;
    }
  }
}

function ChooseClass() {
  if (useDefaultClass === true || useDefaults === true) {
    ChoosingAClass(chosenClass)
  } else {
    writeText('Along with difficulty, we need you to choose your class. Please select one now.')
    requestInput(["Knight", "Mage", "Barbarian", "Cleric", "Prince", "Arch-Mage", "Thief", "Ninja", "Cavalry", "Archer"], determineAnswer);
    function determineAnswer() {
      chosenClass = answer;
      switch (answer) {
        case 'Knight':
          KnightClass()
          break;
        case 'Mage':
          MageClass()
          break;
        case 'Barbarian':
          BarbarianClass()
          break;
        case 'Cleric':
          ClericClass()
          break;
        case 'Prince':
          PrinceClass()
          break;
        case 'Arch-Mage':
          ArchmageClass()
          break;
        case 'Thief':
          ThiefClass()
          break;
        case 'Ninja':
          NinjaClass()
          break;
        case 'Cavalry':
          CavalryClass()
          break;
        case 'Archer':
          ArcherClass()
          break;
        /*case 'super hardcore':
          SuperHardcoreClass()
          break;
        case 'vala':
          ValaClass()
          break;*/
      }
    }
  }
}

function SuperHardcoreClass() {
  temp = randomNumber(80, 100)
  requestInput(["Inspect", "Choose", "Exit"], determineAnswer);
  //answer = prompt('Super Hardcore', 'Inspect, Choose, Exit').toLowerCase()
  alert("Congratulations on getting here.");
  function determineAnswer() {
    switch (answer) {
      case 'Inspect':
        alert('The Super Hardcore is for the hardcore fans, the ones who think that the Legend difficulty is too easy. Attack - 5, BoD - 300, Health - 75, Spells effects / ' + temp + '.')
        SuperHardcoreClass()
        break;
      case 'Choose':
        ChoosingAClass(chosenClass)
        break;
      case 'Exit':
        ChooseClass()
        break;
    }
  }
}

function ValaClass() {
  if (PassOrNot === true) {
    requestInput(["Inspect", "Choose", "Exit"], determineAnswer);
    //answer = prompt('Vala', 'Inspect, Choose, Exit').toUpperCase()
    function determineAnswer() {
      switch (answer) {
        case 'Inspect':
          alert('The Vala class is super cheaty. Everything * INFINITY')
          SuperHardcoreClass()
          break;
        case 'Choose':
          ChoosingAClass(chosenClass)
          break;
        case 'Exit':
          ChooseClass()
          break;
      }
    }
  } else if (PassOrNot === 42) {
    ChooseClass()
  } else if (PassOrNot === '') {
    PassOrNot = DevPassAttempt()
    ValaClass()
  } else {
    alert('Bad boy. Go sit in an infinite loop.')
    while (true) {
      alert('-rAQZdew')
      alert('That message was brought to you by Murphy, one of the programmer\'s dog.')
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

function save() {
  localStorage.setItem('KixleyNCo', kixleyNCo);
  localStorage.setItem('Inventory', inventory);
  localStorage.setItem('Swamp Discovery', swampDiscovery);
  localStorage.setItem('Difficulty', diffSetting);
  localStorage.setItem('Gold', totalGold);
  localStorage.setItem('Plains Counter', plainsCounter);
  localStorage.setItem('Level Requirement', levelReq);
  localStorage.setItem('Experience', totalExp);
  localStorage.setItem('Location', loc);
}

function saveMenu() {
  answer = confirm('Are you sure you want to save? Please make sure to use the same computer when loading. This will overwrite any previous saves on this computer.')
  switch (answer) {
    case true:
      alert('Saving...');
      save()
      alert('Done!');
      Places()
      break;
    case false:
      Places()
      break;
    default:
      NotAnOption()
      saveMenu()
      break;
  }
}

function load() {
  if (signedIn === false) {
    alert('You aren\'t signed in yet! Sign in before you load.');
    if (from !== 'in-game') {
      StartUpMenu()
    } else {
      Menu()
    }
  } else {
    alert('Loading...')
    var temp2 = Function("kixleyNCo = " + localStorage.getItem('KixleyNCo'));
    temp2();
    temp2 = Function("inventory = " + localStorage.getItem('Inventory'));
    temp2();
    swampDiscovery = parseInt(localStorage.getItem('Swamp Discovery'), 10)
    diffSetting = parseInt(localStorage.getItem('Difficulty'), 10)
    totalGold = parseInt(localStorage.getItem('Gold'), 10)
    plainsCounter = parseInt(localStorage.getItem('Plains Counter'), 10)
    levelReq = parseInt(localStorage.getItem('Level Requirement'), 10)
    totalExp = parseInt(localStorage.getItem('Experience'), 10)
    loc = parseInt(localStorage.getItem('Location'), 10)
    alert('Done!')
    switch (loc) {
      case 1:
        Places()
        break;
      case 2:
        InTown()
        break;
      default:
        NotAnOption()
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

function MakeNewAccount() {
  answer = prompt('What do you want your username to be? Your username will be case-sensitive, so choose an appropriate one. It can also include anything, like spaces. If you\'d like to exit, type "Exit".')
  if (answer === 'Exit' || answer === 'exit' || answer === 'eXit' || answer === 'exIt' || answer === 'exiT' || answer === 'EXit' || answer === 'ExIt' || answer === 'ExiT' || answer === 'eXIt' || answer === 'eXiT' || answer === 'exIT' || answer === 'EXIt' || answer === 'EXiT' || answer === 'ExIT' || answer === 'eXIT' || answer === 'EXIT') {
    StartUpMenu()
  } else {
    userCheck = localStorage.getItem(answer + 'Kixley@65810')
    if (userCheck === null) {
      username = answer
      MakePassword()
    } else {
      writeTextWait('That username is already taken. Please try a new username.', MakeNewAccount)
    }
  }
}

function MakePassword() {
  answer = prompt('What do you want your password to be? This is also case-sensitive. If you\'d like to exit, type "Exit".')
  if (answer === 'Exit' || answer === 'exit' || answer === 'eXit' || answer === 'exIt' || answer === 'exiT' || answer === 'EXit' || answer === 'ExIt' || answer === 'ExiT' || answer === 'eXIt' || answer === 'eXiT' || answer === 'exIT' || answer === 'EXIt' || answer === 'EXiT' || answer === 'ExIT' || answer === 'eXIT' || answer === 'EXIT') {
    username = ''
    StartUpMenu()
  } else {
    localStorage.setItem(username + 'Password@Kixley@65810', answer)
    writeText('Account created!')
    StartUpMenu()
  }
}

function login() {
  answer = prompt('What is your username? Remember, it is case-sensitive. Type "Exit" to exit.')
  if (answer === 'Exit' || answer === 'exit' || answer === 'eXit' || answer === 'exIt' || answer === 'exiT' || answer === 'EXit' || answer === 'ExIt' || answer === 'ExiT' || answer === 'eXIt' || answer === 'eXiT' || answer === 'exIT' || answer === 'EXIt' || answer === 'EXiT' || answer === 'ExIT' || answer === 'eXIT' || answer === 'EXIT') {
    StartUpMenu()
  } else {
    if (answer === null) {
      answer = answer.toUpperCase();
    }
    username = answer
    userCheck = localStorage.getItem(username + 'Kixley@65810')
    if (userCheck === null) {
      writeText('That account doesn\'t exist.')
      login()
    } else {
      passTry()
    }
  }
}

function passTry() {
  answer = prompt('What is your password? Remember, it is case-sensitive. Type "Exit" to exit.')
  if (answer === 'Exit' || answer === 'exit' || answer === 'eXit' || answer === 'exIt' || answer === 'exiT' || answer === 'EXit' || answer === 'ExIt' || answer === 'ExiT' || answer === 'eXIt' || answer === 'eXiT' || answer === 'exIT' || answer === 'EXIt' || answer === 'EXiT' || answer === 'ExIT' || answer === 'eXIT' || answer === 'EXIT') {
    userCheck = ''
    StartUpMenu()
  } else {
    if (userCheck !== answer) {
      writeText('You messed up your password!')
      passTry()
    } else {
      inAccount()
    }
  }
}

function inAccount() {
  signedIn = true
  defaultDifficulty = localStorage.getItem(username + 'Difficulty@Kixley@65810')
  if (defaultDifficulty !== null) {
    useDefaultDiff = true
    diffSetting = defaultDifficulty
    diffSetting = parseInt(diffSetting, 10)
  } else {
    writeText("We've detected that you do not have a default difficulty. Would you like to set one now?");
    requestInput(["Yes", "No"], determineAnswer);
    function determineAnswer() {
      if (answer === "Yes") {
        settingDefault = true
        Difficulty()
        useDefaultDiff = true
      }
    }
  }
  defaultClass = localStorage.getItem(username + 'Class@Kixley@65810')
  if (defaultClass !== null) {
    useDefaultClass = true
    chosenClass = defaultClass
  } else {
    writeText("We've detected that you do not have a default class. Would you like to set one now?");
    requestInput(["Yes", "No"], determineAnswer2);
    function determineAnswer2() {
      if (answer === "Yes") {
        settingDefault = true
        ChooseClass()
        useDefaultClass = true
      }
    }
  }
  if (useDefaultDiff === true && useDefaultClass === true) {
    useDefaults = true
  }
  writeText("What would you like to do?");
  requestInput(["Set Default Difficulty", "Set Default Class", "Stay Signed In", "Back to Menu"], determineAnswer3);
  function determineAnswer3() {
    switch (answer) {
      case 'Set Default Difficulty':
        settingDefault = true
        Difficulty()
        break;
      case 'Set Default Class':
        settingDefault = true
        ChooseClass()
        break;
      case 'Stay Signed In':
        localStorage.setItem('staySignedInAs', username)
        break;
      case 'Back to Menu':
        if (from === 'in-game') {
          Menu()
        } else {
          StartUpMenu()
        }
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
