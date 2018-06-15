window.onerror = function(message, source, lineno, colno, error) {
  if(error.message === "Thanks for playing!") {
    alert(error.message);
    var temp2 = document.getElementByID("buttons");
    temp = document.createElement("BUTTON");
    temp.innerHTML = "Run";
    temp.onclick = Function("openingMenu = true; StartUpMenu();");
    temp2.appendChild(temp);
  } else if(error.message === "Cannot read property 'toUpperCase' of null" || error.message === "Cannot read property 'toLowerCase' of null"){
    alert("You just pressed the \"Cancel\" button. That causes the game to end.");
  } else if (error.message === "Cannot read property 'appendChild' of null"){
    alert("You baka! You forgot to add <div id=\"buttons\"></div>!");
  } else {
    alert("Kixley has run into an unexpected error.");
    alert("To help in debugging, Kixley has this to say:");
    alert(message);
    alert("Error found on line " + lineno);
    alert("Error found on column " + colno);
  }
}

// monster variables
function Fighter(health, attack, acc, name, level, type, BoD) {
  this.hitPoints = health;
  this.attackPow = attack;
  this.accuracy = acc;
  this.called = name;
  this.lev = level;
  this.element = type;
  this.blobs = BoD;
  this.streak = 0;
  this.finalDamage;
  this.chosenClass;
  this.critChance = 10;
  this.calledPlusThe = "The " + this.called;
  this.calledPlusthe = "the " + this.called;
  this.totalHP = this.hitPoints;
  this.totalBlobs = this.blobs;
  this.knownSpells = [];
  this.spellCosts = [];
  this.statusEffects = []; // 2D: [[effect, turns], [effect, turns]]
  this.magicSkillz = 1;
  this.rageEffect = 1;
  this.prevTotalHP;
  this.prevHP;
  this.prevTotalBlobs;
  this.prevBlobs;

  this.hitMiss = function(fighter) { // general fight command: accuracy check, damage calculation, effects
    if (!percentChance(this.accuracy) && this.streak <= 5) { // if you miss and you haven't missed 5 times in a row
      this.streak++ // num times missed in a row plus one
      writeText(this.calledPlusThe + " missed.");
    } else {
      this.streak = 0; // reset missed in a row
      this.cChance = percentChance(this.critChance); // do you crit?
      this.finalDamage = (this.attackPow * (1 + (0.05 * (3 - diffSetting) * woodenSword)) * this.rageEffect) + randomNumber(-2, 2); // final damage
      if (this.cChance) {
        if (this.chosenClass === 8) {
          this.finalDamage *= 2; // cavalry has double damage crit
        } else {
          this.finalDamage *= 1.5; // everyone else is 1.5x damage crit
        }
      }
      this.finalDamage = Math.round(10 * this.finalDamage) / 10; // round damage to tenth position
      if (this.cChance) {
        writeText(this.calledPlusThe + " did " + FightRound(this.finalDamage) + " CRITICAL damage.");
      } else {
        writeText(this.calledPlusThe + " did " + FightRound(this.finalDamage) + " damage.");
      }
      fighter.hitPoints -= this.finalDamage; // actual damage calculation
      if (this.called === "You" && this.totalBlobs > 0 && this.totalBlobs !== this.blobs) {
        x = randomNumber(1, 5)
        if(this.totalBlobs - this.blobs < x) {
          x = this.totalBlobs - this.blobs;
        }
        kixleyNCo[1].blobs += x
        writeText("You got " + x + " blobs of doom.")
      }
      if(this.element === "Poison") {
        if(randomNumber(1, 3) === 1) {
          fighter.statusEffects.push(["Poisoned", 10]);
          if(fighter.called === "You") {
            writeText("You've been poisoned!");
          } else {
            writeText(fighter.calledPlusThe + " has been poisoned!");
          }
        }
      }
      temp = false;
      for(var i = 0; i < fighter.statusEffects.length; i++) {
        if(fighter.statusEffects[i][0] === "Burned") {
          temp = true;
        }
      }
      if (flamingSword && percentChance(40) && !temp) {
        fighter.statusEffects.push(["Burned", 5]);
      }
    }
  }
  
  this.intializeMagic = function() {
    if(this.element === "Fighting") {
      this.knownSpells = ["Rage"];
      this.spellCosts = [40];
    } else {
      this.knownSpells = [];
      this.spellCosts = [];
    }
    if(this.called === "You") {
      this.knownSpells = ["Fire", "Rage"];
      this.spellCosts = [20, 40];
    }
  }
  
  this.magic = function(spell, fighter) {
    switch(spell) {
      case "Fire":
        writeText(this.calledPlusThe + " dealt " + 20 * this.magicSkillz + " damage.");
        fighter.hitPoints -= 20 * this.magicSkillz;
        this.blobs -= 20;
        if(percentChance(10)) {
          fighter.statusEffects.push(["Burned", 5]);
          writeText(fighter.calledPlusThe + " caught on fire!");
        }
        break;
      case "Rage":
        if(this.called === "You") {
          writeText("You raise your attack power by " + (1 + (0.2 * this.magicSkillz)) + ".");
        } else {
          writeText(this.calledPlusThe + " raises their attack power by " + (1 + (0.2 * this.magicSkillz)) + ".");
        }
        this.rageEffect = 1 + (0.2 * this.magicSkillz);
        this.blobs -= 40;
        break;
      case "Heal":
        writeText("You heal 60 hitpoints!");
        this.hitPoints += 60;
        if(this.hitPoints > this.totalHP) {
          this.hitPoints = this.totalHP;
        }
        this.blobs -= 30;
        break;
      default:
        const err = new Error("Spell \"" + spell + "\" is invalid.");
        throw err;
    }
  }
  
  this.effectsManager = function() {
    for(var i = 0; i < this.statusEffects.length; i++) {
      switch(this.statusEffects[i][0]) {
        case "Burned":
          this.hitPoints -= 5;
          break;
        case "Poisoned":
          this.hitPoints -= 1;
          break;
        default:
          const err = new Error("Effect \"" + this.statusEffects[i][0] + "\" is invalid.");
          throw err;
      }
      this.statusEffects[i][1]--;
      if(this.statusEffects[i][1] === 0) {
        if(this.called === "You") {
          writeText("You are no longer " + this.statusEffects[i][0]);
        } else {
          writeText(this.calledPlusThe + " is no longer " + this.statusEffects[i][0]);
        }
        this.statusEffects.splice(i, 1);
      }
    }
  }
  
  this.showHealth = function() {
    if(this.prevTotalHP !== this.totalHP || this.prevHP !== this.hitPoints) {
      this.deleteHealth();
      var temp2 = document.getElementById("stats");
      if(document.getElementById(this.called + "_stats") === null) {
        var temp9 = document.createElement("DIV");
        temp9.id = this.called + "_stats";
        temp2.append(temp9);
      } else {
        var temp9 = document.getElementById(this.called + "_stats");
      }
      var temp3 = document.createElement("DIV");
      var temp4 = document.createElement("DIV");
      var temp5 = document.createElement("DIV");
      var temp6 = document.createElement("DIV");
      var temp7 = document.createElement("BR");
      var temp8 = document.createElement("PARAGRAPH");
      temp3.id = this.called + "_hp";
      temp4.id = "hp_nums_" + this.called;
      temp5.id = "current_hp_" + this.called;
      temp6.id = "total_hp_" + this.called;
      temp7.id = "br_" + this.called;
      temp8.id = this.called + "_info";
      temp4.innerHTML = "HP: " + FightRound(this.hitPoints) + "/" + this.totalHP;
      temp8.innerHTML = this.called + " Level " + this.lev;
      temp9.appendChild(temp3);
      temp3.appendChild(temp8);
      temp3.appendChild(temp4);
      temp3.appendChild(temp5);
      temp3.appendChild(temp6);
      temp3.appendChild(temp7);
      temp2 = this.hitPoints / this.totalHP;
      temp2 *= 100;
      temp2 = Math.round(temp2);
      if(temp2 !== 0) {
        temp5.innerHTML = "|";
        temp5.style.background = "#0F0";
        temp5.style.color = "#0F0";
        temp5.style.width = temp2;
        temp5.style.float = "left";
      } else {
        temp5.innerHTML = "";
        temp5.style.width = 0;
      }
      if(temp2 !== 100) {
        temp6.innerHTML = "|";
        temp6.style.background = "#F00";
        temp6.style.color = "#F00";
        temp6.style.width = 100 - temp2;
        temp6.style.marginLeft = temp2;
      } else {
        temp6.innerHTML = "";
        temp6.style.width = 0;
      }
      this.prevTotalHP = this.totalHP;
      this.prevHP = this.hitPoints;
      this.showBlobs(true);
    }
  }
  
  this.deleteHealth = function() {
    if(document.getElementById(this.called + "_hp") !== null) {
      temp = document.getElementById(this.called + "_stats");
      temp.removeChild(document.getElementById(this.called + "_hp"));
    }
  }
  
  this.showBlobs = function(foo) {
    if((this.prevTotalBlobs !== this.totalBlobs || this.prevBlobs !== this.blobs || foo) && this.totalBlobs > 0) {
      this.deleteBlobs();
      var temp2 = document.getElementById("stats");
      if(document.getElementById(this.called + "_stats") === null) {
        var temp9 = document.createElement("DIV");
        temp9.id = this.called + "_stats";
        temp2.append(temp9);
      } else {
        var temp9 = document.getElementById(this.called + "_stats");
      }
      var temp3 = document.createElement("DIV");
      var temp4 = document.createElement("DIV");
      var temp5 = document.createElement("DIV");
      var temp6 = document.createElement("DIV");
      var temp7 = document.createElement("BR");
      temp3.id = this.called + "_blobs";
      temp4.id = "blobs_nums_" + this.called;
      temp5.id = "current_blobs_" + this.called;
      temp6.id = "total_blobs_" + this.called;
      temp7.id = "br_blobs_" + this.called;
      temp4.innerHTML = "Blobs of Doom: " + FightRound(this.blobs) + "/" + this.totalBlobs;
      temp9.appendChild(temp3);
      temp3.appendChild(temp4);
      temp3.appendChild(temp5);
      temp3.appendChild(temp6);
      temp3.appendChild(temp7);
      temp2 = this.blobs / this.totalBlobs;
      temp2 *= 100;
      temp2 = Math.round(temp2);
      if(temp2 !== 0) {
        temp5.innerHTML = "|";
        temp5.style.background = "#00F"; // oof
        temp5.style.color = "#00F";
        temp5.style.width = temp2;
        temp5.style.float = "left";
      } else {
        temp5.innerHTML = "";
        temp5.style.width = 0;
      }
      if(temp2 !== 100) {
        temp6.innerHTML = "|";
        temp6.style.background = "#F00";
        temp6.style.color = "#F00";
        temp6.style.width = 100 - temp2;
        temp6.style.marginLeft = temp2;
      } else {
        temp6.innerHTML = "";
        temp6.style.width = 0;
      }
      this.prevTotalBlobs = this.totalBlobs;
      this.prevBlobs = this.blobs;
    }
  }
  
  this.deleteBlobs = function() {
    if(document.getElementById(this.called + "_blobs") !== null) {
      temp = document.getElementById(this.called + "_stats");
      temp.removeChild(document.getElementById(this.called + "_blobs"));
    }
  }
}

function Fight(faction1, faction2) { // faction 1: [faction name, kixley, fighter2, etc.] faction 2: [faction name, mons1, mons2, etc.]
  this.turn = faction1;
  this.notTurn = faction2;
  this.action = [""];
  this.endFight = " ";
  this.target = [""];
  this.actionChosen = false;
  this.targetChosen = false;
  
  this.chooseAction = function() {
    for(var i = 1; i < this.turn.length; i++) {
      if(this.turn[i].called === "You") {
        FightMenu();
      } else {
        MonsterAI(this.turn[i]);
      }
    }
  }
  
  this.chooseTarget = function() {
    for(var i = 1; i < this.turn.length; i++) {
      if((this.action[i] === "Fight" || this.action[i] === "Fire (20 blobs)" || this.action[i] === "Fire" || this.action[i] === "Shoot" || this.action[i] === "Steal") && this.notTurn.length > 2) {
        var temp = ChooseTarget();
        if(this.target === "Cancel") {
          this.actionChosen = false;
          this.fightLoop();
        } else {
          this.target.push(temp);
          this.targetChosen = true;
        }
      } else if (this.action[i] === "Fight" || this.action[i] === "Fire (20 blobs)" || this.action[i] === "Fire" || this.action[i] === "Shoot" || this.action[i] === "Steal") {
        this.target.push(1);
        this.targetChosen = true;
      } else {
        this.targetChosen = true;
      }
    }
  }
  
  this.determineAction = function() {
    for(var i = 1; i < this.turn.length; i++) {
      switch(this.action[i]) {
        case "Fight":
          this.turn[i].hitMiss(this.notTurn[this.target[i]]);
          break;
        case "Health Potion (" + healthPotion + ")":
          useHealthPotion();
          break;
        case "Fire (20 blobs)":
        case "Fire":
          this.turn[i].magic("Fire", this.notTurn[this.target[i]]);
          break;
        case "Rage (40 blobs)":
        case "Rage":
          this.turn[i].magic("Rage");
          break;
        case "Heal (30 blobs)":
          this.turn[i].magic("Heal");
          break;
        case "Run":
          if(this.notTurn[0].called === "Group of Balbeag's Soldiers" || this.notTurn[0].called === "Tivél" || this.notTurn[0].called === "Balbeag") {
            writeText(this.notTurn.calledPlusThe + " got to you before you could get away.");
          } else {
            if(percentChance(90 - (10 * diffSetting))) {
              this.endFight = "run";
            } else {
              writeText(this.notTurn.calledPlusThe + " got to you before you could get away.");
            }
          }
          break;
        case spec[0]:
          actualSpec(this.notTurn[this.target[i]]);
          break;
        default:
          const err = new Error("\"" + this.action[i] + "\" is not a valid command.");
          throw err;
          break;
      }
    }
  }
  
  this.endTurn = function() {
    for(var i = 1; i < this.turn.length; i++) {
      this.turn[i].effectsManager();
    }
    temp = this.turn;
    this.turn = this.notTurn;
    this.notTurn = temp;
    this.action = [""];
    this.actionChosen = false;
    this.target = [""];
    this.targetChosen = false;
  }
  
  this.checkEnd = function() {
    for(var i = 0; i < this.notTurn.length; i++) {
      if(this.notTurn[i].hitPoints < 0) {
        dead.push(this.notTurn[i]);
        this.notTurn[i].deleteHealth();
        this.notTurn[i].deleteBlobs();
        this.notTurn.splice(i, 1);
      }
    }
    if(faction1.length === 1) {
      this.endFight = "game over";
    } if(faction2.length === 1) {
      this.endFight = "monster dead";
    }
  }
  
  this.determineEnd = function() {
    if(kixleyNCo[1] !== undefined) {
      kixleyNCo[1].statusEffects.splice(0, kixleyNCo[1].statusEffects.length);
    }
    switch(this.endFight) {
      case "run":
        writeTextWait("You got away safely.", Places);
        break;
      case "game over":
        writeTextWait("You died.", GameOver);
        break;
      case "monster dead":
        WonTheFight();
        break;
      default:
        const err = new Error("\"" + this.endFight + "\" is not a valid way to end the fight.");
        throw err;
    }
  }
  
  this.fightLoop = function() {
    fightLoop();
  }
  
  this.showHealth = function() {
    for(var i = 1; i < faction1.length; i++) {
      faction1[i].showHealth();
    }
    for(var i = 1; i < faction2.length; i++) {
      faction2[i].showHealth();
    }
  }
  
  this.showBlobs = function() {
    for(var i = 1; i < faction1.length; i++) {
      faction1[i].showBlobs(false);
    }
    for(var i = 1; i < faction2.length; i++) {
      faction2[i].showBlobs(false);
    }
  }
}

function fightLoop() {
  if(fightHandler.endFight === " ") {
    fightHandler.chooseAction();
    
    fightLoop2();
    
    function fightLoop2() {
      if(fightHandler.actionChosen) {
        fightHandler.chooseTarget();
        
        fightLoop3();
        
        function fightLoop3() {
          if(fightHandler.targetChosen) {
            fightHandler.determineAction();
            fightHandler.checkEnd();
            fightHandler.endTurn();
            setTimeout(fightLoop, 0);
          } else {
            fightLoop3Timeout = setTimeout(fightLoop3, 0);
          }
        }
      } else {
        fightLoop2Timeout = setTimeout(fightLoop2, 0);
      }
    };
  } else {
    fightHandler.determineEnd();
  }
}

var kixleyNCo = ["Kixley & Co.", new Fighter(100, randomNumber(5, 9), 45, 'You', 1, "NaN", 50)];
kixleyNCo[1].calledPlusThe = 'You';
kixleyNCo[1].calledPlusthe = 'you';
kixleyNCo[1].intializeMagic();
var dead = [];
var monsterGroup = ["Enemy", new Fighter(100, randomNumber(5, 9), 90, 'Goblin', 1, "Fighting", 50)];
var fightHandler = new Fight(kixleyNCo, monsterGroup);
var monsName = [
  'You Will Never Get This Monster',
  'Goblin',
  'Rabbit',
  'Spearman',
  'Lizard',
  'Death Snake',
  'Rabid Pineapple',
  'Ferocious Lion',
  'Velociraptor'
];
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
var mountainNames = [
  'Lolnope',
  'Rock Giant',
  'Giant Rock',
  'Big Spearman',
  'Mountain Lion',
  'Killer Goat',
  'Wind Demon',
  'Dragon',
  'Traveller',
];
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
// in the fight
var numMons = monsterGroup.length - 1;
var fightingGroup = false;
var fightingAAbea = false;
var fightingBalbeag = false;
var arrows = 0;
var spec = []; // special move
var actualSpec;
var usedShot = false;
var usedSteal = false;
var flamingSword = false; // MARKED FOR DELETION
var baseAttackPower = kixleyNCo[1].attackPow;
var hasSpecial = false;
var specOrNo = '';
var fightLoop2Timeout;
var fightLoop3Timeout;
// monster drops
var goldDrops; // gold dropped by monster
var dropMult = 1; // multiplier for how much gold the monster drops
var expPoints; // exp dropped by monster
var totalGold = 0; // gold you have
var totalExp = 0; // exp you have
var expLeft; // exp until level up
// travel
var inSwamp;
var toMountains;
var min;
var plainsCounter = 0;
var swampDiscovery = false;
var yesNo = 'Yes, No';
var timeGTOne = 0; // whether you get 6 or 7 BoD when Mithrómen sells you BoD
var swampCounter = 0;
// level
var temp;
var swordAdjustTempMinusOne;
var levelReq = 100 + kixleyNCo[1].lev * 200; // exp required until level up
var levelUpHealth = 50;
var totalExtraHealth = levelUpHealth * (kixleyNCo[1].lev - 1);
var levelUpBlobsOfDoom = 50;
var infinity = 1 / 0;
var classHealthChanges = [
  15, -15, -25,
  15,
  30, -30,
  0,
  0,
  7, -7, -75,
  infinity
];
var attLevelUp;
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
var innFloorNumber;
var x; // rng
var firstChar;
var PassOrNot = '';
var answer;
var howMany = 0;
var diffSetting = 0; // difficulty: Easy = 0.5, Normal = 1.0, Hard = 1.5, Epic = 2.0, Legend = 2.5
var theWholeShebang = [
  'Kixley Beta 1.1',
  'Programmers:',
  'Ethan Lai',
  'Colin Pulis',
  'Jacob Kuschel',
  'Cameron Jordan',
  'John Georgiades',
  'Special thanks to:',
  'The Stack Overflow community, for helping with bugs,',
  'MDN and Codecademy, for helping us learn how to JavaScript,',
  'And Atlassian, for making Bitbucket, which was used to create this.'
]; // Credits!
// menu
var openingMenu;
var chosenClass;
var loc;
var volumeSettings = '';
var from;
var mountainPass = false;
// items
var healthPotion = 0;
var woodenSword = 0;
var speedBoots = 0;
var hpCost = 20;
var wsCost = 50;
var sbCost = 100;
var aCost = 5;
var hpEff = 10 + (10 * (3 - diffSetting)); // how much HP health potions restore
var itemSell; // what you can sell
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
var useTheForceCount = 0; // how many times you've used the force
// questing
var questKillAmt = 0; // amount of monsters you've killed for the quest
var questKillReq; // amount of monsters to kill
var reqItem;
var questGoldReq; // amount of gold you need to give galkemen
var questExpAmt = 0; // amount of exp you've gotten for the quest
var questExpReq; // amount of exp you need to get
var onAQuest = 0; // are you on a quest?
var y; // what type of quest
var z;
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

/*******************\
|      UTILITY      |
\*******************/

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
      fightHandler.showHealth();
      fightHandler.showBlobs(false);
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
  temp = document.getElementById("text");
  var temp2 = document.createElement("PARAGRAPH");
  temp2.innerHTML = text;
  temp.appendChild(temp2);
  temp2 = document.createElement("BR");
  temp.appendChild(temp2);
  temp = document.getElementById("buttons");
  temp2 = document.createElement("BUTTON");
  temp2.innerHTML = "Next";
  temp2.onclick = Function("temp = true;");
  temp.appendChild(temp2);
  temp = false;
  
  waitForUserInput(); // wait for the player to select next
  
  function waitForUserInput() {
    if(!temp) {
      fightHandler.showHealth();
      fightHandler.showBlobs(false);
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
  temp = document.getElementById("text");
  var temp2 = document.createElement("PARAGRAPH");
  temp2.innerHTML = text;
  temp.appendChild(temp2);
  temp2 = document.createElement("BR");
  temp.appendChild(temp2);
}

function clearText() {
  temp = document.getElementById("text");
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
  for(var i = 0; i < dead.length; i++) {
    if(dead[i].called === "You") {
      writeTextWait('You died with ' + totalGold + ' gold, were level ' + dead[i].lev + ', had ' + dead[i].attackPow + ' power, and had a total of ' + dead[i].totalHP + ' health.', Credits)
    }
  }
  const err = new Error("Thanks for playing!");
  throw err;
}

function NotAnOption() {
  alert('That wasn\'t one of the options. Please try again.')
}

function Credits() {
  writeTextWait(theWholeShebang[0], Function("2 === 2"));
  for (i = 1; i < theWholeShebang.length; i += 1) {
    writeText(theWholeShebang[i])
  }
}

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
          kixleyNCo[1].accuracy = infinity
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

function inTower() {
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
|       Fighting       |
\**********************/

function monsInitialize(place) {
  temp = "";
  if(dwNamesB) {
    temp = dwNames[randomNumber(1, dwNames.length - 1)];
  } else if(place === "plains" || place === "swamp") {
    temp = monsName[randomNumber(1, monsName.length - 1)];
  } else if(place === "mountains") {
    temp = mountainNames[randomNumber(1, mountainNames.length - 1)];
  } else {
    const err = new Error("\"" + place + "\" is an invalid place.");
    throw err;
  }
  numMons = 1;
  monsterGroup[1] = new Fighter(100, 5, 90, temp, kixleyNCo[1].lev, "N/A", 50);
  if(kixleyNCo[1].chosenClass === 7) {
    monsterGroup[1].accuracy -= 10
  }
  if(place === "plains") {
    monsterGroup[1].lev += randomNumber(0, 1);
    monsterGroup[1].hitPoints = (100 + (monsterGroup[1].lev * randomNumber(0, 3))) * diffSetting;
    monsterGroup[1].totalHP = monsterGroup[1].hitPoints;
    monsterGroup[1].attackPow = (monsterGroup[1].lev + randomNumber(4, 8)) * diffSetting;
    if(toMountains) {
      if (monsterGroup[1].called !== 'Master') {
        writeText('You head off towards the mountain, but get accosted by a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + ' in the plains.')
      } else if (foughtMaster === 0 && monsterGroup[1].called === "Master") {
        writeText('You head off towards the mountain, but get accosted by the Master, who is level ' + monsterGroup[1].lev + '.')
        foughtMaster = 1
      } else if (foughtMaster === 1 && monsterGroup[1].called === "Master") {
        writeText('You head off towards the mountain, but get accosted by a newly regenerated Master, who is level ' + monsterGroup[1].lev + '.')
      } else {
        writeText('You head off towards the mountain, but get accosted by a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + ' in the plains.')
      }
    } else {
      if(dwNamesB) {
        if (monsterGroup[1].called !== 'Master') {
          writeText('You head off into the plains, where you find a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + '!')
        } else if (foughtMaster === 0) {
          writeText('You head off into the plains, where you find the Master, who is level ' + monsterGroup[1].lev + '.')
          foughtMaster = 1
        } else if (foughtMaster === 1) {
          writeText('You head off into the plains, where you find a newly regenerated Master, who is level ' + monsterGroup[1].lev + '.')
        }
      } else {
        writeText('You head off into the plains, where you find a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + '!')
      }
    }
  } else if(place === "swamp") {
    monsterGroup[1].lev *= randomNumber(1, 2);
    monsterGroup[1].hitPoints = (100 + randomNumber(-10, 10)) * diffSetting + Math.pow(monsterGroup[1].lev, 2);
    monsterGroup[1].totalHP = monsterGroup[1].hitPoints;
    monsterGroup[1].attackPow = (monsterGroup[1].lev + randomNumber(0, 5)) * diffSetting;
    if(dwNamesB) {
      if (monsterGroup[1].called !== 'Master') {
        writeText('You get lost in the swamp, where you find a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + '!')
      } else if (foughtMaster === 0) {
        writeText('You get lost in the swamp, where you find the Master, who is level ' + monsterGroup[1].lev + '.')
        foughtMaster = 1
      } else if (foughtMaster === 1) {
        writeText('You get lost in the swamp, where you find a newly regenerated Master, who is level ' + monsterGroup[1].lev + '.')
      }
    } else {
      writeText('You get lost in the swamp, where you find a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + '!')
    }
  } else if (place === "mountains") {
    monsterGroup[1].lev *= randomNumber(1, 2);
    monsterGroup[1].lev += 5;
    monsterGroup[1].hitPoints = (100 + randomNumber(-5, 15)) * diffSetting + Math.pow(monsterGroup[1].lev, 2);
    monsterGroup[1].totalHP = monsterGroup[1].hitPoints;
    monsterGroup[1].attackPow = (monsterGroup[1].lev + randomNumber(1, 6)) * diffSetting;
    if(dwNamesB) {
      if (monsterGroup[1].called !== 'Master') {
        writeText('Once you get into the mountains, you find a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + '!')
      } else if (foughtMaster === 0) {
        writeText('Once you get into the mountains, you find the Master, who is level ' + monsterGroup[1].lev + '.')
        foughtMaster = 1
      } else if (foughtMaster === 1) {
        writeText('Once you get into the mountains, you find a newly regenerated Master, who is level ' + monsterGroup[1].lev + '.')
      }
    } else {
      writeText('Once you get into the mountains, you find a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + '!')
    }
  }
  MonsTypeSwitch();
}

function MonsTypeSwitch() {
  for(var i = 1; i < monsterGroup.length; i++) {
    switch (monsterGroup[i].called) {
      case 'Goblin':
        monsterGroup[i].element = 'Fighting'
        break;
      case 'Rabbit':
        monsterGroup[i].element = 'Normal'
        break;
      case 'Spearman':
        monsterGroup[i].element = 'Fighting'
        break;
      case 'Lizard':
        monsterGroup[i].element = 'Poison'
        break;
      case 'Death Snake':
        monsterGroup[i].element = 'Poison'
        break;
      case 'Rabid Pineapple':
        monsterGroup[i].element = 'Normal'
        break;
      case 'Ferocious Lion':
        monsterGroup[i].element = 'Fighting'
        break;
      case 'Velociraptor':
        monsterGroup[i].element = 'Fighting'
        break;
      case 'Dalek':
        monsterGroup[i].element = 'Fighting'
        break;
      case 'Cyberman':
        monsterGroup[i].element = 'Fighting'
        break;
      case 'Weeping Angel':
        monsterGroup[i].element = 'Normal'
        break;
      case 'Zygon':
        monsterGroup[i].element = 'Fighting'
        break;
      case 'Silurian':
        monsterGroup[i].element = 'Poison'
        break;
      case 'Silent':
        monsterGroup[i].element = 'Fighting'
        break;
      case 'Master':
        monsterGroup[i].element = 'Normal'
        break;
      case 'Special Weapons Dalek':
        monsterGroup[i].element = 'Fighting'
        break;
      default:
        const err = new Error("\"" + monsterGroup[i].called + "\" is not in the monster type index.");
        throw err;
        break;
    }
    monsterGroup[i].intializeMagic();
  }
  fightHandler = new Fight(kixleyNCo, monsterGroup);
  fightHandler.fightLoop();
}

function MonsterAI(monster) {
  temp = false;
  for(var i = 0; i < monster.knownSpells.length; i++) {
    if(monster.knownSpells[i] === "Rage" && monster.rageEffect === 1) {
      temp = true;
    }
  }
  if(temp) {
    fightHandler.action.push("Rage");
  } else {
    fightHandler.action.push("Fight");
  }
  fightHandler.actionChosen = true;
}

function ChooseTarget() {
  if(fighthandler.turn[1].called === "You") {
    temp = [];
    for(var i = 1; i < fightHandler.notTurn.length; i++) {
      temp.push(fightHandler.notTurn[i].calledPlusThe);
    }
    temp.push("Cancel");
    requestInput(temp, determineAnswer);
    writeText("Please choose a target.");
    function determineAnswer() {
      fightHandler.target = answer;
    }
  } else {
    temp = 0;
    var temp2;
    for(var i = 1; i < fightHandler.notTurn.length; i++) {
      if(fightHandler.notTurn[i].attackPow > temp) {
        temp = fightHandler.notTurn[i].attackPow; // if the player is not attacking, choose the target with the greatest attack
        temp2 = i;
      }
    }
    fightHandler.target = temp2;
  }
}

function FightMenu() {
  writeText("");
  writeText("What do you want to do?");
  writeText("Health: " + kixleyNCo[1].hitPoints + "/" + kixleyNCo[1].totalHP);
  for(var i = 1; i < monsterGroup.length; i++) {
    writeText(monsterGroup[i].called + " health: " + monsterGroup[i].hitPoints + "/" + monsterGroup[i].totalHP);
    writeText(monsterGroup[i].called + " type: " + monsterGroup[i].element);
  }
  temp = ["Fight", "Health Potion (" + healthPotion + ")", "Magic", "Special Attack", "Run"];
  if(!hasSpecial || usedShot || usedSteal) {
    temp.splice(temp.indexOf("Special Attack"), 1);
  }
  if(healthPotion === 0) {
    temp.splice(temp.indexOf("Health Potion (" + healthPotion + ")"), 1);
  }
  requestInput(temp, determineAnswer);
  function determineAnswer() {
    if(answer === "Magic") {
      ChooseSpell();
    } else {
      fightHandler.action.push(answer);
      fightHandler.actionChosen = true;
    }
    // Running From Failure is too great a speech to just delete.
    /*
        case 'RUNNING FROM FAILURE':
          alert('"Running from failure"')
          alert('There\'s nothing quite like a high school cross country race. To run five kilometers as fast as possible is to suffer for five thousand meters, every step of the way. Every meet my team would run was different, each new course adding a new flavor of agony. However, there was a particular meet that became infamous. Whenever its name was mentioned, the team would shudder. There was a palpable sense of dread on the bus ride there. It was feared. It was here. It was Stockton.')
          alert('Stockton is a small town with big hills. The three miles of the course stretched out before us like an endless abyss. My coach stopped to survey the situation (hands on hips, looks up.) "Yep, this is going to be a good race."')
          alert('When the gun went off I was thrown into a chaotic mix of pumping arms, shoving, and body heat. The world became a blur as the runners jockeyed for position. I felt my chest tighten as more and more people passed me. I could hear my coach yelling, "Move up! There\'s always a race." I eyed a runner a dozen meters ahead of me, and surged. Once I passed him, I set another target. The heat was starting to get to me. As the race progressed, I could feel my heart pounding out of my chest. My lungs were burning, but I struggled past the others. After an eternity I saw a bright white line in the grass. I kicked. Victory was assured. Then I read what was written above the line. MILE ONE.')
          alert('I don\'t remember how I finished the race, but after it was over I felt a certain sense of success for having survived. This race made me consider what success was. It\'s clearly a good thing, something that everyone wants. Yet today many face obstacles to success. The two most critical obstacles have the potential to damage young people and prevent them from realizing their goals. These two problems are the fear of failure and lack of perseverance. The ways to fix these challenges are to take more risks, develop a sense of control in one\'s life, and make perseverance a lifelong habit. To understand what it takes to find success in life, we must first examine the root of the problem: its causes, and the effect it has on our future. Then, we need to dig deeper to examine the solutions to the problem. Finally, we will tie it all together.')
          alert('But first, what causes this fear of failure? It could be that our society is not encouraging us to take enough risks. An example of this risk aversion can be found on the public playground. A study conducted by researchers at Queen Maud University in Norway found that children who encounter dangerous situations during play gradually become used to the concept of risk. Playgrounds with high jungle gyms teach children how to conquer their fear of heights. The researchers go on to say this is a crucial psychological development. However, in recent years, the fear of lawsuits has caused tall slides and balancing bars to be replaced with smaller equipment. Rubber mats have replaced concrete floors. The playground has become safer, but at what cost? The development of the mind of children has been stunted because of concerns about safety. This discourages risk-taking and puts the brakes on personal growth. We as a society are responsible for this change. We are also in danger of eroding one of the most important human qualities: perseverance.')
          alert('But what is perseverance? As Newt Gingrich put it, "Perseverance is the hard work you do after you get tired of doing the hard work you already did." It is a crucial factor in the success of the individual. My cross country coach demonstrated what this meant. The practice after the bloodbath that was Stockton, he gathered the team in a classroom to watch the film McFarland, U.S.A. It was meant to be an inspirational pat on the back to keep us going. The plot of the film is about a Mexican-American cross country team winning against all odds in a poverty stricken town in California. There\'s a powerful moment in the film where the slowest runner, named Danny Diaz, is on the verge of collapse. However, he digs in and runs through the pain. At the climax of the film, the coach anxiously watches the final hill before the finish line. He glances at his watch, and says that hope for the team is lost. Then he pauses as he sees someone come over the hill. He yelled, "That\'s not Danny Diaz!"')
          alert('Indeed it was Danny Diaz, sprinting past the competition and saving the day. For weeks after watching McFarland, my teammates would shout "That\'s not Danny Diaz" back and forth to each other as encouragement to keep on running. This was my coach\'s lesson to us about perseverance.')
          alert('However, the quality of perseverance has taken a hit in recent years in young people, and it is owed to a lack of focus. A study from San Diego State University showed that young people today have less of a sense of control over their lives than previous generations. Participants were placed in two categories: those who had felt that they had control of their circumstances, or the Internal control group, and those who believed that their destiny was outside of their decisions, or the External control group. The researchers found that the number of young people in the External group increased by 80% between 1960 and 2002. Is it any wonder that depression and anxiety rates have increased among teens in the last two decades? How can one feel satisfied when they don\'t feel as though they can change their destiny?')
          alert('Another problem spawned by this lack of focus is the erosion of self control. A University of Calgary study found that procrastination is extremely high among college students, with 90 to 95% of them putting off studying coursework. Self-doubt is the leading cause of this delay. The results are disheartening: those who procrastinate report higher levels of stress and illness as the year progresses. In other words, the fear of not living up to a standard is keeping these students from success. So what can we do to get us back on track?')
          alert('The first thing we must do is accept that failure is okay. It is inevitable. However, what is not inevitable is what we make of it. We must make failure a part of the learning process. My personal experience with failure involves another story about running, but this time I was running for political office. My school was holding its annual class elections. Having no experience with fundraising or giving speeches, I announced my candidacy for student body president. What followed was a flurry of handshaking, practicing rhetoric, and hanging up posters. "CONAWAY FOR PRESIDENT: JOIN THE REVOLUTION". (I had a melodramatic flair). Anyway, it was finally the day of the election, Valentine\'s Day 2017 (pause). What a perfect day for a heartbreak. To use technical terms, I was buried by my opponent. The loss was devastating to my confidence, and I considered retreating back into my shell and never take a risk again. However, when all hope seemed lost, I remembered the wise words of the philosopher Chumbawamba: "I get knocked down, but I get up again. You\'re never gonna keep me down." This is inspired me to try once more. With renewed confidence, I ran for senior class president a month later. I, also lost that race, but that\'s not the point. If I hadn\'t taken that risk, or persevered through to the end, I would never have learned from it. That experience benefited me, teaching me how to network and giving me the confidence to join speech and debate. I am a better person because I took a risk. Many people are being robbed of this experience, and we must work to regain it.')
          alert('The next thing we must do is regain our sense of self control. To feel like one is not in control is self defeating. We must shift the determiner of our fate inward. This will increase determination and positivity and make it easier to deal with setbacks.')
          alert('Finally, perseverance must become a lifelong habit. We must learn to appreciate difficult tasks. We must become comfortable and with challenging ourselves, and it will become a part of our life. To constantly challenge oneself is to move forward in life. It helps achieve goals, both in the short term and the long term. To persevere through opposition and hardship is to grow stronger, to push harder, to run faster. It is the key to success.')
          alert('To conclude, we need to change our mindset in order to cross the finish line. To begin, we have to lose our fear of failure and go all in. Next, we must remind ourselves that we are in control. It is within our ability to change our chances of success. Finally, we must be prepared to put in blood, sweat, and tears for a long period of time, to challenge ourselves to be the best we can possibly be. If we do this, at the end of the race, with the finish in sight, we will surge, and leave people saying, "That\'s not Danny Diaz."')
    */
  }
}

function useHealthPotion() {
  if (healthPotion <= 0) {
    writeText('You search your backpack, but you don\'t have a health potion!')
    window.clearTimeout(fightLoop2Timeout);
    window.clearTimeout(fightLoop3Timeout);
    fightHandler.actionChosen = false;
    fightHandler.action = [""];
    fightHandler.targetChosen = false;
    fightHandler.target = [""];
    fightHandler.fightLoop();
  } else {
    writeText('You pull a health potion out of your bag and drink it! Yum! It tastes like snickerdoodle cookies!')
    writeText(hpEff + ' hit points restored!')
    kixleyNCo[1].hitPoints += hpEff
    healthPotion--
    if (kixleyNCo[1].hitPoints > kixleyNCo[1].totalHP) {
      kixleyNCo[1].hitPoints = kixleyNCo[1].totalHP
    }
  }
}

function ChooseSpell() {
  writeText("What spell?");
  writeText("You have " + kixleyNCo[1].blobs + " blobs of doom.");
  temp = kixleyNCo[1].knownSpells.slice();
  for(var i = 0; i < kixleyNCo[1].knownSpells.length; i++) {
    if(kixleyNCo[1].spellCosts[i] > kixleyNCo[1].blobs) {
      temp.splice(i, 1);
    } else {
      temp[i] += " (" + kixleyNCo[1].spellCosts[i] + " blobs)"
    }
  }
  temp.push("Cancel");
  requestInput(temp, determineAnswer);
  function determineAnswer() {
    if(answer === "Cancel") {
      FightMenu();
    } else {
      fightHandler.action.push(answer);
      fightHandler.actionChosen = true;
    }
  }
}

function ChooseSpec() {
  writeText("Would you like to use your special attack?");
  writeText(spec[0] + ":");
  writeText(spec[1]);
  requestInput(["Yes", "No"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case "Yes":
        if(spec[0] === "Shoot" && arrows === 0) {
          writeText("You're out of arrows to shoot!");
          ChooseSpec();
        } else {
          fightHandler.action.push(spec[0].toLowerCase());
        }
        break;
      case "No":
        FightMenu()
        break;
    }
  }
}

function Shoot(target) {
  usedShot = true
  target.accuracy -= 30
  arrows -= 1
  writeText('You did ' + randomNumber(kixleyNCo[1].attackPow - 3, kixleyNCo[1].attackPow + 3) + ' damage by shooting the monster!')
  writeText('You have ' + arrows + ' arrows!')
  target.hitPoints -= randomNumber(kixleyNCo[1].attackPow - 3, kixleyNCo[1].attackPow + 3)
}

function Steal(target) {
  if (percentChance(43)) {
    writeText('You steal ' + target.calledPlusthe + '\'s weapon!')
    kixleyNCo[1].attackPow += 2
    target.attackPow -= 2;
    usedSteal = true;
  } else {
    writeText('You fail to steal ' + target.calledPlusthe + '\'s weapon.')
  }
}

function WonTheFight() {
  if (inSwamp === 1) {
    inSwamp = 0
    swampCounter++
    writeTextWait('As the monster dies, you get teleported out of the swamp.', goldAndEXP)
  } else if (fightingGroup) {
    fightingGroup = false
    writeTextWait('Balbeag\'s soldiers are defeated!', inTowerPostDoomedGroup)
  } else if (fightingAAbea) {
    fightingAAbea = false
    writeText('Tivél is defeated!', finalBossFight)
  } else if (fightingBalbeag) {
    fightingBalbeag = false
    Credits()
    beatTheGame()
  } else if (toMountains) {
    toMountains = false
    writeTextWait("With the monster defeated, you hike back down the mountain.", goldAndEXP);
  } else {
    plainsCounter++
    if(numMons === 1) {
      writeTextWait('The monster is defeated!', goldAndEXP);
    } else {
      writeTextWait("The monsters are defeated!", goldAndEXP);
    }
  }
  function goldAndEXP() {
    goldDrops = randomNumber(25 * numMons, 75 * numMons) * dropMult;
    expPoints = randomNumber(50 * numMons, 150 * numMons);
    killCounter += numMons;
    if (kixleyNCo[1].rageEffect !== 1) {
      writeText('You calm down.')
      kixleyNCo[1].rageEffect = 1;
    }
    writeText('You got ' + goldDrops + ' gold and ' + expPoints + ' experience!')
    totalGold += goldDrops
    cumulativeGold += goldDrops
    totalExp += expPoints
    questExpAmt += expPoints
    CheckIfGotAchieve('Gold')
    if (onAQuest === 1 && y === 1) {
      questKillAmt += numMons
    }
    if (totalExp >= levelReq) {
      CheckIfGotAchieve('Kill')
      checkForLevelUp()
    } else {
      expLeft = levelReq - totalExp
      writeText('You have ' + expLeft + ' experience before you level up!')
      CheckIfGotAchieve('Kill')
      Places();
    }
  }
}

function hideOrFight() {
  for(var i = 1; i < 4; i++) {
    monsterGroup[i] = new Fighter(100, 100, 90, 'Balbeag\'s Soldier ' + i, 10, 'Balbeag Worker', 100);
    monsterGroup[i].calledPlusThe = 'Balbeag\'s Soldier ' + i;
    monsterGroup[i].calledPlusthe = 'Balbeag\'s Soldier ' + i;
    monsterGroup[i].hitPoints = (100 + randomNumber(-10, 10)) * diffSetting + Math.pow(kixleyNCo[1].lev, 2) + monsterGroup[i].lev
    monsterGroup[i].attackPow = (monsterGroup[i].lev + randomNumber(1, 6)) * diffSetting;
  }
  loc = 3
  numMons = 3;
  fightingGroup = true
  writeText("With the footsteps gone, you exit your hiding spot and start to follow Tivél. Before you can, you hear a shout from behind! Turning, you see the group of soldiers rushing at you!");
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
  monsterGroup[1].attackPow = (monsterGroup[1].lev + randomNumber(2, 8)) * diffSetting;
  fightHandler = new Fight(kixleyNCo, monsterGroup);
  fightHandler.fightLoop();
}

function finalBossFight() {
  loc = 5
  numMons = 1;
  towerSaveMenu()
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
            writeText('Volume set! Now just imagine the noises at the appropriate volume.');
            Options();
            break;
          case '0':
            writeText("Volume set! Now just play the game normally!");
            Options();
            break;
          case "Dev Cheats":
            volumeSettings = "0";
            alert('Welcome to the secret area, where you can enable developer cheats.');
            alert('Don\'t use these if you\'re not a dev.');
            temp = DevPassAttempt();
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
            volumeSettings = "0";
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
  writeText("Where do you go now?");
  writeText("Gold: " + totalGold);
  writeText("HP: " + kixleyNCo[1].hitPoints + "/" + kixleyNCo[1].totalHP);
  if(kixleyNCo[1].totalBlobs > 0) {
    writeText("Blobs: " + kixleyNCo[1].blobs + "/" + kixleyNCo[1].totalBlobs);
  } else {
    writeText("Blobs: 0/0");
  }
  loc = 1
  temp = ["Town", "Plains", "Swamp", "Mountains", "Menu"];
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
      case 'MENU':
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
  temp = (compAchieve.length / allAchievements.length) * 100;
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
        Credits()
        const err = new Error("Thanks for playing!");
        throw err;
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
        Credits()
        const e = new Error("Thanks for playing!");
        throw e;
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
      monsterGroup[1].attackPow *= diffSetting;
      monsterGroup[1].lev = kixleyNCo[1].lev + randomNumber(0, 1);
      monsterGroup[1].hitPoints = 100 * diffSetting
      monsterGroup[1].totalHP = 100 * diffSetting
      hpCost *= diffSetting
      wsCost *= diffSetting
      sbCost *= diffSetting
      aCost *= diffSetting
      hpEff = 10 + (10 * (3 - diffSetting))
      kixleyNCo[1].accuracy += 15 * (3 - diffSetting)
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
    monsterGroup[1].attackPow *= diffSetting;
    monsterGroup[1].lev = kixleyNCo[1].lev + randomNumber(0, 1);
    monsterGroup[1].hitPoints = 100 * diffSetting
    monsterGroup[1].totalHP = 100 * diffSetting
    hpCost *= diffSetting
    wsCost *= diffSetting
    sbCost *= diffSetting
    aCost *= diffSetting
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
  spec = ['Shoot', 'You drop back and shoot an arrow at the monster, decreasing your enemy\'s accuracy. However, this attack costs arrows']
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
            specOrNo = 'Special Attack, '
            break;
          case 'Ninja':
            kixleyNCo[1].attackPow -= 2
            kixleyNCo[1].blobs -= 50
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].accuracy += 20
            monsterGroup[1].accuracy -= 10
            kixleyNCo[1].chosenClass = 7
            hasSpecial = true
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
            hasSpecial = true
            specOrNo = 'Special Attack, '
            break;
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
  writeText("Gold: " + totalGold);
  writeText("Health: " + kixleyNCo[1].hitPoints + "/" + kixleyNCo[1].totalHP);
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

function BuyHealthPotion() {
  answer = prompt('How many health potions do you want?', '1')
  if (answer === '') {
    NotAnOption()
    BuyHealthPotion()
  }
  firstChar = answer.charAt(0)
  if (firstChar === '0' || firstChar === '1' || firstChar === '2' || firstChar === '3' || firstChar === '4' || firstChar === '5' || firstChar === '6' || firstChar === '7' || firstChar === '8' || firstChar === '9') {
    answer = parseInt(answer, 10)
    howMany = answer
    if (totalGold < (hpCost * howMany)) {
      writeText('You don\'t have enough gold to buy that many health potions. At max you could buy ' + Math.floor(totalGold / hpCost) + ' health potion(s).')
      InShop()
    } else {
      writeText("Are you sure?");
      writeText("You're going to buy " + answer + " health potions.");
      writeText("Gold: " + totalGold);
      requestInput(["Yes", "No"], determineAnswer);
      function determineAnswer() {
        switch (answer) {
          case "Yes":
            writeText('Health potion(s) bought!')
            healthPotion += howMany
            answer = 0
            totalGold -= (hpCost * howMany)
            InShop()
            break;
          case "No":
            InShop()
            break;
        }
      }
    }
  } else {
    writeText('That wasn\'t a number! You can\'t buy ' + answer + ' health potions!')
    BuyHealthPotion()
  }
}

function BuyWoodenSword() {
  if (woodenSword === 0) {
    if (totalGold >= wsCost) {
      writeText("Are you sure?");
      requestInput(["Yes", "No"], determineAnswer);
      function determineAnswer() {
        switch (answer) {
          case 'Yes':
            writeText('Wooden sword bought!')
            woodenSword++;
            //kixleyNCo[1].attackPow *= (1 + (0.05 * (3 - diffSetting)))
            totalGold -= wsCost
            InShop()
            break;
          case 'No':
            InShop()
            break;
        }
      }
    } else {
      writeText('You don\'t have enough money.')
      InShop()
    }
  } else {
    writeText('SOLD OUT.')
    InShop()
  }
}

function BuySpeedBoots() {
  if (speedBoots === 0) {
    if (totalGold >= sbCost) {
      writeText("Are you sure?");
      requestInput(["Yes", "No"], determineAnswer);
      // answer = prompt('Are you sure?', 'Yes, No').toUpperCase()
      function determineAnswer() {
        switch (answer) {
          case 'Yes':
            writeText('Speed boots bought!')
            speedBoots++
            totalGold -= sbCost
            kixleyNCo[1].accuracy += 5 * (3 - diffSetting)
            InShop();
            break;
          case 'No':
            InShop()
            break;
        }
      }
    } else {
      writeText('You don\'t have enough money.')
      InShop()
    }
  } else {
    writeText('SOLD OUT.')
    InShop()
  }
}

function BuyArrows() {
  answer = prompt('How many arrows do you want?', '1')
  if (answer === '') {
    NotAnOption()
    BuyArrows()
  } else {
    firstChar = answer.charAt(0)
    if (firstChar === '0' || firstChar === '1' || firstChar === '2' || firstChar === '3' || firstChar === '4' || firstChar === '5' || firstChar === '6' || firstChar === '7' || firstChar === '8' || firstChar === '9') {
      howMany = parseInt(answer, 10)
      if (totalGold < (aCost * howMany)) {
        writeText('You don\'t have enough gold to buy that many arrows. At max you could buy ' + Math.floor(totalGold / aCost) + ' arrows(s).')
        InShop()
      }
      writeText();
      requestInput(["Yes", "No"], determineAnswer);
      //answer = confirm('Are you sure? You\'re going to buy ' + answer + ' arrows, and you have ' + totalGold + ' gold. This will cost you ' + (aCost * howMany) + ' gold.', 'Yes, No')
      function determineAnswer() {
        switch (answer) {
          case "Yes":
            alert('Arrow(s) bought!')
            arrows += howMany
            answer = 0
            totalGold -= (aCost * howMany)
            InShop()
            break;
          case "No":
            InShop()
            break;
        }
      }
    } else {
      alert('That wasn\'t a number! You can\'t buy ' + answer + ' arrows!')
      BuyArrows()
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
  alert('The marketplace master greets you.')
  temp = ["Buy", "Sell", "Leave"];
  if(woodenSword === 0 && speedBoots === 0) {
    temp.splice(temp.indexOf("Sell"), 1);
  }
  requestInput(temp, determineAnswer);
  //answer = prompt('The marketplace master asks you if you would like to buy, or sell.', 'Buy, Sell, Leave').toUpperCase()
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
  temp = ["Wooden Sword", "Speed Boots", "Leave"];
  if(woodenSword === 0) {
    temp.splice(temp.indexOf("Wooden Sword"), 1);
  }
  if(speedBoots === 0) {
    temp.splice(temp.indexOf("Speed Boots"), 1);
  }
  requestInput(temp, determineAnswer);
  //answer = prompt('What would you like to sell?', itemSell).toUpperCase()
  function determineAnswer() {
    switch (answer) {
      case 'Wooden Sword':
        alert('A guy shows up and offers ' + .9 * wsCost + ' gold for your wooden sword.')
        requestInput(["Yes", "No"], determineAnswer2);
        //answer = prompt('Are you sure you want to sell your wooden sword?', 'Yes, No').toUpperCase()
        function determineAnswer2() {
          switch (answer) {
            case 'Yes':
              totalGold += .9 * wsCost
              woodenSword = 0
              alert('Wooden sword sold!')
              InShop()
              break;
            case 'No':
              Sell()
              break;
          }
        }
        break;
      case 'Speed Boots':
        if (speedBoots === 1) {
          alert('A guy shows up and offers ' + .9 * sbCost + ' gold for your speed boots.')
          requestInput(["Yes", "No"], determineAnswer2);
          //answer = prompt('Are you sure you want to sell your speed boots?', 'Yes, No').toUpperCase()
          function determineAnswer2() {
            switch (answer) {
              case 'Yes':
                totalGold += .9 * sbCost
                speedBoots = 0
                kixleyNCo[1].accuracy -= 5 * (3 - diffSetting)
                alert('Speed boots sold!')
                InShop()
                break;
              case 'No':
                Sell()
                break;
            }
          }
        } else {
          alert('You don\'t have one to sell.')
        }
        break;
      case 'Leave':
        InShop()
        break;
    }
  }
}

function Buy() {
  //answer = prompt('One person in the marketplace says, \'What do you want? I have health potions for ' + hpCost + ' gold, a wooden sword for ' + wsCost + ' gold, some speed boots for ' + sbCost + ' gold, and arrows for ' + aCost + ' gold.\' You have ' + totalGold + ' gold.', 'Health Potion, Wooden Sword, Speed Boots, Arrows, Cancel').toUpperCase()
  temp = ["Health Potions", "Wooden Sword", "Speed Boots", "Arrows", "Leave"];
  if(woodenSword === 1) {
    temp.splice(temp.indexOf("Wooden Sword"), 1);
  }
  if(speedBoots === 1) {
    temp.splice(temp.indexOf("Speed Boots"), 1);
  }
  requestInput(temp, determineAnswer)
  function determineAnswer() {
    switch (answer) {
      case 'Health Potions':
        BuyHealthPotion()
        break;
      case 'Wooden Sword':
        BuyWoodenSword()
        break;
      case 'Speed Boots':
        BuySpeedBoots()
        break;
      case 'Arrows':
        BuyArrows()
        break;
      case 'Leave':
        InShop()
        break;
    }
  }
}


function InInn() {
  alert('A musty scent fills your nose as you walk into the inn. The dim lights are a stark difference from the outside, and it takes a moment for your eyes to adjust. When they do, they show you a man grinning at you. "Welcom\' to the Rowdy Barstead. You ca\' spend the night here if you like. Only 50 gold. You can also go to the common room. Do jobs fer money. Buy stuff real cheap.')
  requestInput(["Yes", "Common Room", "Leave"], determineAnswer);
  //answer = prompt('So whadda you say?', 'Yes, No, Common Room').toUpperCase()
  function determineAnswer() {
    switch (answer) {
      case 'Yes':
        if (totalGold >= 50) {
          totalGold -= 50;
          innFloorNumber = randomNumber(1, 2);
          temp = randomNumber(1, 23);
          if (temp < 10) {
            temp.toString(10)
            temp = '0' + temp
          }
          alert('The man gestures towards a room door. \'There\'s your room, room ' + innFloorNumber.toString(10) + temp + '. Have a good night\'s rest.\'')
          alert('You wake up fully refreshed, and new vigor fills your heart.')
          alert('Hit points fully restored!')
          kixleyNCo[1].hitPoints = kixleyNCo[1].totalHP
          alert('You walk out of the room.')
          InInn()
        } else if (totalGold <= 50) {
          alert('The Inn keeper sighs and says \'You don\'t have enough gold. Sorry, pardner!\'');
          alert('You go back into town');
          InTown()
        }
        break;
      case 'No':
        alert('The man sighs as you leave the inn.')
        InTown()
        break;
      case 'Common Room':
        inCommonRoom()
        break;
    }
  }
}

function quest() {
  if (onAQuest === 0) {
    y = randomNumber(0, 3)
    alert('You got a ' + questType[y] + ' quest!')
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
        const e = new Error("Invalid quest type: Quest number " + y + " is not within an acceptable range.");
        throw e;
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
  localStorage.setItem('Health', kixleyNCo[1].hitPoints)
  localStorage.setItem('Attack Power', kixleyNCo[1].attackPow)
  localStorage.setItem('Class', kixleyNCo[1].chosenClass)
  localStorage.setItem('Level', kixleyNCo[1].lev)
  localStorage.setItem('Total Health', kixleyNCo[1].totalHP)
  localStorage.setItem('Blobs of Doom', kixleyNCo[1].blobs)
  localStorage.setItem('Health Potions', healthPotion)
  localStorage.setItem('Wooden Sword', woodenSword)
  localStorage.setItem('Swamp Discovery', swampDiscovery)
  localStorage.setItem('Difficulty', diffSetting)
  localStorage.setItem('Gold', totalGold)
  localStorage.setItem('Speed Boots', speedBoots)
  localStorage.setItem('Plains Counter', plainsCounter)
  localStorage.setItem('Level Requirement', levelReq)
  localStorage.setItem('Experience', totalExp)
  localStorage.setItem('Location', loc)
}

function saveMenu() {
  answer = confirm('Are you sure you want to save? Please make sure to use the same computer when loading. This will overwrite any previous saves on this computer.')
  switch (answer) {
    case true:
      alert('Saving...')
      save()
      alert('Done!')
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
    alert('You aren\'t signed in yet! Sign in before you load.')
    if (from !== 'in-game') {
      StartUpMenu()
    } else {
      Menu()
    }
  } else {
    alert('Loading...')
    kixleyNCo[1].hitPoints = parseInt(localStorage.getItem('Health'), 10)
    kixleyNCo[1].attackPow = parseInt(localStorage.getItem('Attack Power'), 10)
    kixleyNCo[1].chosenClass = parseInt(localStorage.getItem('Class'), 10)
    kixleyNCo[1].lev = parseInt(localStorage.getItem('Level'), 10)
    kixleyNCo[1].totalHP = parseInt(localStorage.getItem('Total Health'), 10)
    kixleyNCo[1].blobs = parseInt(localStorage.getItem('Blobs of Doom'), 10)
    healthPotion = parseInt(localStorage.getItem('Health Potions'), 10)
    woodenSword = parseInt(localStorage.getItem('Wooden Sword'), 10)
    swampDiscovery = parseInt(localStorage.getItem('Swamp Discovery'), 10)
    diffSetting = parseInt(localStorage.getItem('Difficulty'), 10)
    totalGold = parseInt(localStorage.getItem('Gold'), 10)
    speedBoots = parseInt(localStorage.getItem('Speed Boots'), 10)
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
    alert('Ther\' ya go, pardner. Nice doin\' business with ya.')
  } else {
    alert('I\'m not gonna give ya the blobs of doom if ya don\'t give me the monay. Sorry, pardner.')
  }
  if (kixleyNCo[1].blobs > kixleyNCo[1].totalBlobs) {
    kixleyNCo[1].blobs = kixleyNCo[1].totalBlobs
  }
  alert('You now have ' + kixleyNCo[1].blobs + ' blobs of doom.')
  wantingMoreBlobs()
}

function wantingMoreBlobs() {
  requestInput(["Yes", "No"], determineAnswer);
  //answer = prompt('Hey! Ya want some more blobs? Yu\'ll get 7 this time, still fer 10 gold!', 'Yes, No').toUpperCase()
  function determineAnswer() {
    switch (answer) {
      case 'Yes':
        timeGTOne = 1
        GettingBlobsOfDoom()
        break;
      case 'No':
        alert('All righty then. See ya later!')
        InInn()
        break;
    }
  }
}

function blobsOfDoomShop() {
  requestInput(["Yes", "No"], determineAnswer);
  //answer = prompt('You walk up to Mithrómen. He says, \'Hey kid. I\'m runnin\' low on money, so I\'m selling my blobs o\' doom. So far there\'s been no buyers. You up for it? Only 10 gold for 6 blobs o\' doom.\'', 'Yes, No').toUpperCase()
  function determineAnswer() {
    switch (answer) {
      case 'Yes':
        GettingBlobsOfDoom()
        break;
      case 'No':
        alert('Mithrómen sighs as you leave.')
        InInn()
        break;
    }
  }
}

function questChoiceSwitch() {
  switch (answer) {
    case 'No':
      alert('Galkemen looks like he wants to kill you, so you get away from him and leave the inn, but then decide to go back in and just avoid Galkemen.')
      InInn()
      break;
    case 'Yes':
      onAQuest = 1
      alert('Galkemen hands you a piece of paper and has you sign it.')
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
  requestInput(["Yes", "No"], questChoiceSwitch);
  //answer = (prompt('Galkemen says \'Go kill ' + questKillReq + ' monsters.\'', 'Yes, No').toLowerCase())
}

function questGoldChoice() {
  requestInput(["Yes", "No"], questChoiceSwitch);
  //answer = (prompt('Galkemen says \'Gimme ' + questGoldReq + ' gold. I\'ll give ya exp fer this one, instead o\' gold.\'', 'Yes, No').toLowerCase())
}

function questItemChoice() {
  requestInput(["Yes", "No"], questChoiceSwitch);
  //answer = prompt('Galkemen says \'Go gimme a ' + reqItem + ' fer some exp.\'', 'Yes, No').toLowerCase()
}

function questExpChoice() {
  requestInput(["Yes", "No"], questChoiceSwitch);
  //answer = prompt('Galkemen says \'Go get ' + questExpReq + ' exp, so you can gi\' my quests done faster.', 'Yes, No').toLowerCase()
}

function buySpeedBootsCheaply() {
  requestInput(["Yes", "No"], determineAnswer);
  //answer = (prompt('Gurthmereth says \'Low on money. Got speed boots. Will sell them real cheap. Only 70 gold.', yesNo).toLowerCase())
  function determineAnswer() {
    switch (answer) {
      case 'Yes':
        if (totalGold >= 70) {
          alert('Gurthmereth hands you the boots as you hand him the money')
          totalGold -= 70
          kixleyNCo[1].accuracy += 5 * (3 - diffSetting)
          speedBoots = 1
        } else {
          alert('Gurthmereth sighs and says \'You don\'t have enough money. I want the money.\' Then you leave the common room.')
          InInn()
        }
        break;
      case 'No':
        alert('Gurthmereth looks at your receding back as you leave the common room.')
        InInn()
        break;
    }
  }
}

function buyWoodenSwordsCheap() {
  requestInput(["Yes", "No"], determineAnswer);
  //answer = (prompt('Maegfin says \'Low on money. Got wooden swords. Will sell them real cheap. Only 35 gold.', yesNo).toLowerCase())
  function determineAnswer() {
    switch (answer) {
      case 'Yes':
        if (totalGold >= 35) {
          alert('Maegfin hands you the sword, along with a sheath, as you hand him the money')
          totalGold -= 35
          woodenSword = 1;
          inCommonRoom()
        } else {
          alert('Maegfin sighs and says \'You don\'t have enough money. I want the money.\' Then you leave the common room.')
          InInn()
        }
        break;
      case 'No':
        alert('Maegfin looks at your receding back as you leave the common room.')
        InInn()
        break;
    }
  }
}
function beatTheGame() {
  requestInput(["Yes", "No"], determineAnswer);
  //answer = (prompt('You beat the game! Would you like to continue?', yesNo).toLowerCase())
  function determineAnswer() {
    switch (answer) {
      case 'Yes':
        alert('You return and help rebuild Smatino, ready to fight Balbeag\'s remaining monsters who still are evil, though their master is dead');
        alert('Mountain Pass discovered!')
        mountainPass = true
        aabeaDestroysTown = false
        InTown()
        break;
      case 'No':
        const err = new Error("Thanks for playing!");
        throw err;
        break;
    }
  }
}

function StatToLevelUp() {
  requestInput(["Base Attack + " + temp, "Health + " + levelUpHealth, "Blobs of Doom + " + levelUpBlobsOfDoom], determineAnswer);
  //answer = prompt('Please choose a stat to level up: Attack + ' + swordAdjustedTempMinusOne + ', Health + ' + levelUpHealth + ', Blobs of Doom + ' + levelUpBlobsOfDoom + '.', 'Attack, Health, Blobs of Doom').toUpperCase()
  function determineAnswer() {
    switch (answer) {
      case 'Base Attack + ' + temp:
        alert('You got ' + temp + ' base attack!')
        kixleyNCo[1].attackPow += temp
        baseAttackPower += temp
        attLevelUp++
        break;
      case 'Health + ' + levelUpHealth:
        alert('You got ' + levelUpHealth + ' health!')
        kixleyNCo[1].hitPoints += levelUpHealth
        kixleyNCo[1].totalHP += levelUpHealth
        break;
      case 'Blobs of Doom + ' + levelUpBlobsOfDoom:
        alert('You got ' + levelUpBlobsOfDoom + ' blobs of doom!')
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
    alert('You leveled up!')
    levelReq += levelReq
    StatToLevelUp()
    CheckIfGotAchieve('Level')
  }
}

function inCommonRoom() {
  requestInput(["Talk to Mithrómen", "Talk to Galkemen", "Talk to Maegfin", "Talk to Gurthmereth", "Leave"], determineAnswer);
  //answer = prompt('The Innkeeper gestures towards a loud, brightly lit room. It is filled with people. You walk over to a corner of the room, where there are four guys. One is named Mithrómen, another is named Galkemen, another is named Maegfin, and the fourth is named Gurthmereth. All four say \'Hi!\'. Do you run away from them in fear, or talk to one of them? If you talk who do you talk to?', 'Run away in fear, Talk to Mithrómen, talk to Galkemen, talk to Maegfin, talk to Gurthmereth').toLowerCase()
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
        alert('You leave.')
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
      alert('That username is already taken. Please try a new username.')
      MakeNewAccount()
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
    alert('Account created!')
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
      alert('That account doesn\'t exist.')
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
      alert('You messed up your password!')
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
    requestInput(["Yes", "No"], determineAnswer);
    function determineAnswer() {
      //confirm('We\'ve detected that you do not have a default difficulty. Would you like to set one now?') === true
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
    requestInput(["Yes", "No"], determineAnswer2);
    //confirm('We\'ve detected that you do not have a default class. Would you like to set one now?') === true
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
  requestInput(["Set Default Difficulty", "Set Default Class", "Stay Signed In", "Back to Menu"], determineAnswer3);
  //answer = prompt('What would you like to do?', 'Set default difficulty, Set default class, Back to menu, Stay Signed In').toLowerCase()
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
    alert('Galkemen says \'Thanks fer killin\' those monsters. Have ' + reward + ' gold.\'')
    totalGold += reward
    onAQuest = 0;
    inCommonRoom()
  } else {
    alert('Galkemen says \'GO KILL ' + (questKillReq - questKillAmt) + 'MORE MONSTERS!!!\' He then proceeds to throw you out the (thankfully open) window.');
    InTown()
  }
}

function goldQuestEvaluate() {
  if (totalGold >= questGoldReq) {
    alert('Galkemen says \'Thanks fer givin\' me this gold. Have ' + reward + ' exp.\'')
    totalGold -= questGoldReq
    totalExp += reward
    onAQuest = 0;
    inCommonRoom()
  } else {
    alert('Galkemen says \'GO GET ' + (questGoldReq - totalGold) + ' MORE GOLD!!!\' He then proceeds to throw you out the (thankfully open) window.');
    InTown()
  }
}

function expQuestEvaluate() {
  if (questExpAmt >= questExpReq) {
    alert('Galkemen says \'Thanks fer gettin\' that exp. Have ' + reward + ' gold.\'')
    totalGold += reward
    onAQuest = 0;
    inCommonRoom();
  } else {
    alert('Galkemen says \'GO GET ' + (questExpReq - questExpAmt) + ' MORE EXP!!!\' He then proceeds to throw you out the (thankfully open) window.');
    InTown()
  }
}

function itemQuestEvaluate() {
  if ((reqItem === "wooden sword" && woodenSword >= 1) || (reqItem === "pair of speed boots" && speedBoots >= 1)) {
    alert('Galkemen says \'Thanks fer gettin\' that ' + reqItem + '. Have ' + reward + ' exp.\'')
    totalExp += reward
    onAQuest = 0;
    inCommonRoom()
  } else {
    alert('Galkemen says \'GO GET A ' + (reqItem.toUpperCase()) + '!!!\' He then proceeds to throw you out the (thankfully open) window.')
    InTown()
  }
}

function towerSaveMenu() {
  requestInput(["Yes", "No"], determineAnswer);
  //answer = (prompt('Wanna save?', yesNo).toLowerCase())
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
