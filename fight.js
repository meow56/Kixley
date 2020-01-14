import { randomNumber, writeTextWait, writeText, requestInput, percentChance } from './utility.js';
import { displayInventory, changeCatalogPrice, changeHealthPotionEff } from './items.js';
import { diffSetting } from './classes.js';
import { playMusic } from './music.js';
import { WonTheFight, totalGold, toMountains, Places } from './places.js';

export { kixleyNCo, fightHandler, monsterGroup, dropMult, changeDropMult, story, numMons, monsInitialize };

function changeDropMult(value) {
  dropMult = value;
}

function Fighter(health, attack, acc, name, level, type, BoD, speed) {
  this.hitPoints = health;
  this.attackPow = attack;
  this.accuracy = acc;
  this.called = name;
  this.lev = level;
  this.element = type;
  this.blobs = BoD;
  this.speed = speed;
  this.spec;
  this.streak = 0;
  this.finalDamage;
  this.chosenClass;
  this.critChance = 10;
  this.critDamage = 1.5;
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
  this.prevGold;
  this.prevLev;
  
  this.equipped = []; // 1D array: [InventoryItem, InventoryItem]

  this.hitMiss = function(fighter) { // general fight command: accuracy check, damage calculation, effects
    this.tempAccuracy = this.accuracy;
    for(var i = 0; i < this.equipped.length; i++) {
      this.equipped[i].effect(); // apply any accuracy boosts
    }
    if (!percentChance(Math.min(this.tempAccuracy / fighter.speed * 100, 100)) && this.streak <= 5) { // if you miss and you haven't missed 5 times in a row
      this.streak++ // num times missed in a row plus one
      writeText(this.calledPlusThe + " missed.");
    } else {
      this.streak = 0; // reset missed in a row
      this.cChance = percentChance(this.critChance); // do you crit?
      this.finalDamage = (this.attackPow * this.rageEffect); // final damage
      for(var i = 0; i < this.equipped.length; i++) {
        this.equipped[i].effect(); // apply any attack boosts
      }
      this.finalDamage += randomNumber(-2, 2); // random variability
      if (this.cChance) {
        this.finalDamage *= this.critDamage;
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
    this.tempMagicSkillz = this.magicSkillz;
    for(var i = 0; i < this.equipped.length; i++) {
      this.equipped[i].effect(); // apply any magicSkillz boosts
    }
    switch(spell) {
      case "Fire":
        writeText(this.calledPlusThe + " dealt " + 20 * this.tempMagicSkillz + " damage.");
        fighter.hitPoints -= 20 * this.tempMagicSkillz;
        this.blobs -= 20;
        if(percentChance(10)) {
          fighter.statusEffects.push(["Burned", 5]);
          writeText(fighter.calledPlusThe + " caught on fire!");
        }
        break;
      case "Rage":
        if(this.called === "You") {
          writeText("You raise your attack power by " + (1 + (0.2 * this.tempMagicSkillz)) + ".");
        } else {
          writeText(this.calledPlusThe + " raises their attack power by " + (1 + (0.2 * this.tempMagicSkillz)) + ".");
        }
        this.rageEffect = 1 + (0.2 * this.tempMagicSkillz);
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
  
  this.showHealth = function(foo) {
    if(this.prevTotalHP !== this.totalHP || this.prevHP !== this.hitPoints || foo) {
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
      temp3.id = this.called + "_hp";
      temp4.id = "hp_nums_" + this.called;
      temp5.id = "current_hp_" + this.called;
      temp6.id = "total_hp_" + this.called;
      temp7.id = "br_" + this.called;
      temp4.innerHTML = "HP: " + FightRound(this.hitPoints) + "/" + this.totalHP;
      temp9.appendChild(temp3);
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
      var temp = document.getElementById(this.called + "_stats");
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
        temp5.style.background = "#0072FF";
        temp5.style.color = "#0072FF";
        temp5.style.width = temp2;
        temp5.style.float = "left";
      } else {
        temp5.innerHTML = "";
        temp5.style.width = 0;
      }
      if(temp2 !== 100) {
        temp6.innerHTML = "|";
        temp6.style.background = "#003A82";
        temp6.style.color = "#003A82";
        temp6.style.width = 100 - temp2;
        temp6.style.marginLeft = temp2;
      } else {
        temp6.innerHTML = "";
        temp6.style.width = 0;
      }
      this.prevTotalBlobs = this.totalBlobs;
      this.prevBlobs = this.blobs;
    } else if (this.totalBlobs <= 0) {
      this.deleteBlobs();
    }
  }
  
  this.deleteBlobs = function() {
    if(document.getElementById(this.called + "_blobs") !== null) {
      var temp = document.getElementById(this.called + "_stats");
      temp.removeChild(document.getElementById(this.called + "_blobs"));
    }
  }
  
  this.showInfo = function() {
    if(this.prevGold !== totalGold || this.prevLev !== this.lev) {
      this.deleteInfo();
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
      var temp7 = document.createElement("BR");
      temp3.id = this.called + "_info";
      temp4.id = "name_level_" + this.called;
      temp5.id = "gold_" + this.called;
      temp7.id = "br_info_" + this.called;
      temp4.innerHTML = this.called + " Level " + this.lev;
      temp9.appendChild(temp3);
      temp3.appendChild(temp4);
      if(this.called === "You") {
        temp5.innerHTML = "Gold: " + totalGold;
        temp3.appendChild(temp5);
      }
      temp3.appendChild(temp7);
      this.prevGold = totalGold;
      this.prevLev = this.lev;
      if(this.called === "You") {
        displayInventory(true);
      } else {
        this.showHealth(true);
      }
    }
  }
  
  this.deleteInfo = function() {
    if(document.getElementById(this.called + "_info") !== null) {
      var temp = document.getElementById(this.called + "_stats");
      temp.removeChild(document.getElementById(this.called + "_info"));
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
        ChooseTarget();
        if(this.target[i] === "Cancel") {
          this.target.splice(i, 1);
          this.actionChosen = false;
          this.fightLoop();
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
        case "Health Potion":
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
            if(this.notTurn.length > 2) {
              writeText("The soldiers got to you before you could get away.");
            } else {
              writeText(this.notTurn[1].calledPlusThe + " got to you before you could get away.");
            }
          } else {
            if(percentChance(90 - (10 * diffSetting))) {
              this.endFight = "run";
            } else {
              if(this.notTurn.length > 2) {
                writeText("The monsters got to you before you could get away.");
              } else {
                writeText(this.notTurn[1].calledPlusThe + " got to you before you could get away.");
              }
            }
          }
          break;
        case this.turn[i].spec.name:
          this.turn[i].spec.action(this.notTurn[this.target[i]]);
          break;
        case "Special Attack":
          writeText('This class doesn\'t have a special attack.')
          this.fightLoop()
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
    var temp = this.turn;
    this.turn = this.notTurn;
    this.notTurn = temp;
    this.action = [""];
    this.actionChosen = false;
    this.target = [""];
    this.targetChosen = false;
  }
  
  this.checkEnd = function() {
    for(var i = 1; i < this.notTurn.length; i++) {
      if(this.notTurn[i].hitPoints < 0) {
        dead.push(this.notTurn[i]);
        this.notTurn[i].deleteInfo();
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
    for(var i = 0; i < inventory.length; i++) {
      if(document.getElementById(inventory[i][0].name + "_equip_select") !== null) {
        document.getElementById(inventory[i][0].name + "_equip_select").disabled = false;
      }
    }
    if(kixleyNCo[1] !== undefined) {
      kixleyNCo[1].statusEffects.splice(0, kixleyNCo[1].statusEffects.length);
    }
    switch(this.endFight) {
      case "run":
        for(var i = 1; i < this.notTurn.length; i++) {
          faction2[i].deleteInfo();
          faction2[i].deleteHealth();
          faction2[i].deleteBlobs();
          faction2.splice(i, 1);
        }
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
  
  this.showHealth = function() { // Yes, it does start at 1. For all of them.
    for(var i = 1; i < faction1.length; i++) {
      faction1[i].showHealth(false);
    }
    for(var i = 1; i < faction2.length; i++) {
      faction2[i].showHealth(false);
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
  
  this.showInfo = function() {
    for(var i = 1; i < faction1.length; i++) {
      faction1[i].showInfo();
    }
    for(var i = 1; i < faction2.length; i++) {
      faction2[i].showInfo();
    }
  }
}

var kixleyNCo = ["Kixley & Co.", new Fighter(100, randomNumber(5, 9), 45, 'You', 1, "NaN", 50, 20)];
kixleyNCo[1].calledPlusThe = 'You';
kixleyNCo[1].calledPlusthe = 'you';
kixleyNCo[1].intializeMagic();
var dead = [];
var monsterGroup = ["Enemy"];
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

var numMons = monsterGroup.length - 1;
var spec = []; // special move
var actualSpec;
var usedSpec = false;
var baseAttackPower = kixleyNCo[1].attackPow;
var hasSpecial = false;
var dropMult = 1; // multiplier for how much gold the monster drops

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
            setTimeout(fightLoop3, 0);
          }
        }
      } else {
        setTimeout(fightLoop2, 0);
      }
    };
  } else {
    fightHandler.determineEnd();
  }
}

function monsInitialize(place) {
  var temp = "";
  if(place === "plains" || place === "swamp") {
    temp = monsName[randomNumber(1, monsName.length - 1)];
  } else if(place === "mountains") {
    temp = mountainNames[randomNumber(1, mountainNames.length - 1)];
  } else {
    const err = new Error("\"" + place + "\" is an invalid place.");
    throw err;
  }
  numMons = 1;
  monsterGroup[1] = new Fighter(100, 5, 90, temp, kixleyNCo[1].lev, "N/A", 50, 20);
  if(place === "plains") {
    monsterGroup[1].lev += randomNumber(0, 1);
    monsterGroup[1].hitPoints = (100 + (monsterGroup[1].lev * randomNumber(0, 3))) * diffSetting;
    monsterGroup[1].totalHP = monsterGroup[1].hitPoints;
    monsterGroup[1].attackPow = (monsterGroup[1].lev + randomNumber(4, 8)) * diffSetting;
    if(toMountains) {
      writeText('You head off towards the mountain, but get accosted by a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + ' in the plains.');
    } else {
      writeText('You head off into the plains, where you find a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + '!');
    }
  } else if(place === "swamp") {
    monsterGroup[1].lev *= randomNumber(1, 2);
    monsterGroup[1].hitPoints = (100 + randomNumber(-10, 10)) * diffSetting + Math.pow(monsterGroup[1].lev, 2);
    monsterGroup[1].totalHP = monsterGroup[1].hitPoints;
    monsterGroup[1].attackPow = (monsterGroup[1].lev + randomNumber(0, 5)) * diffSetting;
    writeText('You get lost in the swamp, where you find a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + '!');
  } else if (place === "mountains") {
    monsterGroup[1].lev *= randomNumber(1, 2);
    monsterGroup[1].lev += 5;
    monsterGroup[1].hitPoints = (100 + randomNumber(-5, 15)) * diffSetting + Math.pow(monsterGroup[1].lev, 2);
    monsterGroup[1].totalHP = monsterGroup[1].hitPoints;
    monsterGroup[1].attackPow = (monsterGroup[1].lev + randomNumber(1, 6)) * diffSetting;
    writeText('Once you get into the mountains, you find a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + '!')
  } else if (place === "start") {
    if(monsterGroup.length >= 2) {
      monsterGroup[1] = new Fighter(100, randomNumber(5, 9), 90, 'Goblin', 1, "Fighting", 50);
    } else {
      monsterGroup.push(new Fighter(100, randomNumber(5, 9), 90, 'Goblin', 1, "Fighting", 50));
    }
    monsterGroup[1].attackPow *= diffSetting;
    monsterGroup[1].lev = kixleyNCo[1].lev + randomNumber(0, 1);
    monsterGroup[1].hitPoints = 100 * diffSetting;
    monsterGroup[1].totalHP = 100 * diffSetting;
    /*for(var i = 0; i < catalog.length; i++) {
      catalog[i].cost *= diffSetting;
    }*/
    changeHealthPotionEff(10 * (3 - diffSetting));
    kixleyNCo[1].accuracy += 15 * (3 - diffSetting);
  }
  MonsTypeSwitch();
}

function MonsTypeSwitch() {
  playMusic("Fight");
  for(var i = 0; i < inventory.length; i++) {
    if(document.getElementById(inventory[i][0].name + "_equip_select") !== null) {
      document.getElementById(inventory[i][0].name + "_equip_select").disabled = true;
    }
  }
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
  var temp = false;
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
  if(fightHandler.turn[1].called === "You") {
    var temp2 = [];
    for(var i = 1; i < fightHandler.notTurn.length; i++) {
      temp2.push(fightHandler.notTurn[i].calledPlusThe);
    }
    temp2.push("Cancel");
    writeText("Please choose a target.");
    requestInput(temp2, determineAnswer);
    function determineAnswer() {
      for(var i = 1; i < fightHandler.notTurn.length; i++) {
        if(fightHandler.notTurn[i].calledPlusThe === answer) {
          fightHandler.target.push(i);
          fightHandler.targetChosen = true;
        }
      }
    }
  } else {
    temp2 = 0;
    var temp3;
    for(var i = 1; i < fightHandler.notTurn.length; i++) {
      if(fightHandler.notTurn[i].attackPow > temp2) {
        temp2 = fightHandler.notTurn[i].attackPow; // if the player is not attacking, choose the target with the greatest attack
        temp3 = i;
      }
    }
    fightHandler.target = temp3;
    fightHandler.targetChosen = true;
  }
}

function FightMenu() {
  writeText("");
  writeText("What do you want to do?");
  for(var i = 1; i < monsterGroup.length; i++) {
    writeText(monsterGroup[i].called + " type: " + monsterGroup[i].element);
  }
  var temp = ["Fight", "Health Potion", "Magic", "Special Attack", "Run"];
  if(kixleyNCo[1].spec === null || usedSpec) {
    temp.splice(temp.indexOf("Special Attack"), 1);
  }
  var temp2 = false;
  for(var i = 0; i < inventory.length; i++) {
    if(inventory[i][0].name === "Health Potion") {
      temp2 = true;
    }
  }
  if(!temp2) {
    temp.splice(temp.indexOf("Health Potion"), 1);
  }
  var temp2 = true;
  for(var i = 0; i < kixleyNCo[1].knownSpells.length; i++) {
    if(kixleyNCo[1].blobs >= kixleyNCo[1].spellCosts[i]) {
      temp2 = false;
    }
  }
  if(temp2) {
    temp.splice(temp.indexOf("Magic"), 1);
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

function ChooseSpell() {
  writeText("What spell?");
  writeText("You have " + kixleyNCo[1].blobs + " blobs of doom.");
  var temp = kixleyNCo[1].knownSpells.slice();
  for(var i = kixleyNCo[1].knownSpells.length - 1; i > -1; i--) {
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
        if(spec[0] === "Shoot" && findNameInventory("Arrow") === null) {
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

function FightRound(n) {
  if (n < 1) {
    return 1;
  } else {
    return Math.round(n);
  }
}

function story() {
  if(monsterGroup.length >= 2) {
    monsterGroup[1] = new Fighter(100, randomNumber(5, 9), 90, 'Goblin', 1, "Fighting", 50, 20);
  } else {
    monsterGroup.push(new Fighter(100, randomNumber(5, 9), 90, 'Goblin', 1, "Fighting", 50, 20));
  }
  numMons = 1;
  monsterGroup[1].attackPow *= diffSetting;
  monsterGroup[1].lev = kixleyNCo[1].lev + randomNumber(0, 1);
  monsterGroup[1].hitPoints = 100 * diffSetting
  monsterGroup[1].totalHP = 100 * diffSetting
  changeCatalogPrice(diffSetting);
  changeHealthPotionEff(10 * (3 - diffSetting));
  kixleyNCo[1].accuracy += 15 * (3 - diffSetting);
  writeText('You are a person named Kixley. You live in the land of Nulm. You are in the Vacant Plains, and you know the town called Smatino resides nearby. You know where it is, but there are monsters in the plains, and one has just spotted you.');
  writeTextWait('Your attack power is ' + kixleyNCo[1].attackPow + '.', MonsTypeSwitch);
}
