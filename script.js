window.onerror = function(message, source, lineno, colno, error) {
  if(error.message === "Thanks for playing!") {
    alert(error.message);
  } else if(error.message === "Cannot read property 'toUpperCase' of null" || error.message === "Cannot read property 'toLowerCase' of null"){
    alert("You just pressed the \"Cancel\" button. Don't do that.");
  } else {
    alert("Kixley has run into an unexpected error.");
    alert("To help in debugging, Kixley has this to say:");
    alert(message);
    alert("Error found on line " + lineno);
    alert("Error found on column " + colno);
  }
}

function Kixley() {
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

    this.hitMiss = function(fighter) { // general fight command: accuracy check, damage calculation, effects
      if (!percentChance(this.accuracy) && this.streak <= 5) { // if you miss and you haven't missed 5 times in a row
        this.streak++ // num times missed in a row plus one
        alert(this.calledPlusThe + " missed.");
      } else {
        this.streak = 0; // reset missed in a row
        this.cChance = percentChance(this.critChance); // do you crit?
        this.finalDamage = (this.attackPow * this.rageEffect) + randomNumber(-2, 2); // final damage
        if (this.cChance) {
          if (this.chosenClass === 8) {
            this.finalDamage *= 2; // cavalry has double damage crit
          } else {
            this.finalDamage *= 1.5; // everyone else is 1.5x damage crit
          }
        }
        this.finalDamage = Math.round(10 * this.finalDamage) / 10; // round damage to tenth position
        if (this.cChance) {
          alert(this.calledPlusThe + " did " + FightRound(this.finalDamage) + " CRITICAL damage.");
        } else {
          alert(this.calledPlusThe + " did " + FightRound(this.finalDamage) + " damage.");
        }
        fighter.hitPoints -= this.finalDamage; // actual damage calculation
        if(this.element === "Poison") {
          if(randomNumber(1, 3) === 1) {
            fighter.statusEffects.push(["Poisoned", 10])
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
          alert(fighter.calledPlusThe + " took " + 20 * this.magicSkillz + " damage.");
          fighter.hitPoints -= 20 * this.magicSkillz;
          this.blobs -= 20;
          if(percentChance(10)) {
            fighter.statusEffects.push(["Burned", 5]);
            alert(fighter.calledPlusThe + " caught on fire!");
          }
          break;
        case "Rage":
          if(this.called === "You") {
            alert("You raise your attack power by " + (1 + (0.2 * this.magicSkillz)) + ".");
          } else {
            alert(this.calledPlusThe + " raises their attack power by " + (1 + (0.2 * this.magicSkillz)) + ".");
          }
          this.rageEffect = 1 + (0.2 * this.magicSkillz);
          this.blobs -= 40;
          break;
        case "Heal":
          alert("You heal 60 hitpoints!");
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
            alert("You are no longer " + this.statusEffects[i][0]);
          } else {
            alert(this.calledPlusThe + " is no longer " + this.statusEffects[i][0]);
          }
          this.statusEffects.splice(i, 1);
        }
      }
    }
  }
  
  function Fight(faction1, faction2) { // faction 1: [faction name, kixley, fighter2, etc.] faction 2: [faction name, fighter3, fighter4, etc.]
    this.turn = faction1;
    this.notTurn = faction2;
    this.action;
    this.endFight = " ";
    this.target;
    
    this.Turn = function() {
      for(var i = 1; i < this.turn.length; i++) {
        if(this.turn[i].called === "You") {
          this.action = FightMenu();
        } else {
          this.action = MonsterAI(this.turn[i]);
        }
        if((this.action === "fight" || this.action === "fire" || this.action === "shoot" || this.action === "steal") && this.notTurn.length > 2) {
          this.target = ChooseTarget();
          if(this.target === "not targeting") {
            this.Turn();
          }
        } else if (this.action === "fight" || this.action === "fire" || this.action === "shoot" || this.action === "steal") {
          this.target = 1;
        }
        switch(this.action) {
          case "fight":
            this.turn[i].hitMiss(this.notTurn[this.target]);
            break;
          case "health potion":
            useHealthPotion();
            break;
          case "fire":
            this.turn[i].magic("Fire", this.notTurn[this.target]);
            break;
          case "rage":
            this.turn[i].magic("Rage");
            break;
          case "heal":
            this.turn[i].magic("Heal");
            break;
          case "run":
            if(this.notTurn[0].called === "Group of Balbeag's Soldiers" || this.notTurn[0].called === "Tivél" || this.notTurn[0].called === "Balbeag") {
              alert(this.notTurn.calledPlusThe + " got to you before you could get away.");
            } else {
              if(percentChance(90 - (10 * diffSetting))) {
                this.endFight = "run";
              } else {
                alert(this.notTurn.calledPlusThe + " got to you before you could get away.");
              }
            }
            break;
          case spec[0].toLowerCase():
            for(var i = 0; i < spec
            break;
          default:
            const err = new Error("\"" + this.action + "\" is not a valid command.");
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
    }
    
    this.checkEnd = function() {
      for(var i = 0; i < this.notTurn.length; i++) {
        if(this.notTurn[i].hitPoints < 0) {
          dead.push(this.notTurn[i]);
          this.notTurn.splice(i, 1);
        }
      }
      if(faction1.length === 1) {
        this.endFight = "game over";
      } if(faction2.length === 1) {
        this.endFight = "monster dead";
      }
    }
    
    this.fightLoop = function() {
      while(this.endFight === " ") {
        this.Turn();
        this.checkEnd();
        this.endTurn();
      }
      switch(this.endFight) {
        case "run":
          alert("You got away safely.");
          Places();
          break;
        case "game over":
          alert("You died.");
          GameOver();
          break;
        case "monster dead":
          WonTheFight();
          break;
        default:
          const err = new Error("\"" + this.endFight + "\" is not a valid way to end the fight.");
          throw err;
      }
    }
  }
  
  function Spec(name, desc, func) {
    this.name = name;
    this.desc = desc;
    this.func = func;
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
  var dwNamesB = false; // using Doctor Who names?
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
  var achieveCompletion; // percentage of achievements completed
  var killCounter = 0; // how many monsters killed
  var cumulativeGold = 0; // total gold earned
  var getGoldAchieve = 0;
  var getLevelAchieve = 0;
  // in the fight
  var numMons = monsterGroup.length - 1;
  var fightingGroup = false;
  var fightingAAbea = false;
  var fightingBalbeag = false;
  var arrows = 0;
  var possibleSpec = [
    new Spec("Steal", "A 43% chance to steal something from a monster, increasing your attack (for that battle) and decreasing theirs!", Function("target", "if (percentChance(43) && !usedSteal) { alert('You steal ' + fightHandler.notTurn[target].calledPlusthe + '\'s weapon!'); kixleyNCo[1].attackPow += 2; fightHandler.notTurn[target].attackPow -= 2; usedSteal = true; } else if(usedSteal) { alert('You\'ve already stolen ' + fightHandler.notTurn[target].calledPlusthe + '\'s weapon!'); } else { alert('You fail to steal ' + fightHandler.notTurn[target].calledPlusthe + '\'s weapon.'); }"),
    new Spec("Shoot", "You drop back and shoot an arrow at the monster, decreasing your enemy's accuracy. However, this attack costs arrows.", Function("target", "usedShot = true; fightHandler.notTurn[target].accuracy -= 30; arrows -= 1; alert('You did ' + randomNumber(kixleyNCo[1].attackPow - 3, kixleyNCo[1].attackPow + 3) + ' damage by shooting the monster!'); alert('You have ' + arrows + ' arrows!'); fightHandler.notTurn[target].hitPoints -= randomNumber(kixleyNCo[1].attackPow - 3, kixleyNCo[1].attackPow + 3);"0
  ];
  var spec = []; // special move
  var usedShot = false;
  var usedSteal = false;
  var flamingSword = false;
  var baseAttackPower = kixleyNCo[1].attackPow;
  var hasSpecial = false;
  var specOrNo = '';
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

  openingMenu = true;
  StartUpMenu()

  /*******************\
  |      UTILITY      |
  \*******************/

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
    alert('You are a person named Kixley. You live in the land of Nulm. You are in the Vacant Plains, and you know the town called Smatino resides nearby. You know where it is, but there are monsters in the plains, and one has just spotted you.')
    alert('Your attack power is ' + kixleyNCo[1].attackPow + '.')
    MonsTypeSwitch()
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
      alert('You died with ' + totalGold + ' gold, were level ' + dead[i].lev + ', had ' + dead[i].attackPow + ' power, and had a total of ' + dead[i].totalHP + ' health.')
      }
    }
    Credits()
    const err = new Error("Thanks for playing!");
    throw err;
  }

  function NotAnOption() {
    alert('That wasn\'t one of the options. Please try again.')
  }

  function Credits() {
    for (i = 0; i < theWholeShebang.length; i += 1) {
      alert(theWholeShebang[i])
    }
    window.close()
  }

  function DevCheats() {
    answer = prompt('What cheat do you want to activate?', 'Infinite gold, Infinite Exp, Infinite Attack, Infinite Health, Infinite Blobs of Doom, Infinite Accuracy, Activate All, Leave').toLowerCase()
    switch (answer) {
      case 'infinite gold':
      case 'infinite munnies':
        if (goldCheat === 0) {
          totalGold = -(Math.log(0))
          alert('Cheat successfully activated!')
          goldCheat = 1
          youCheated = true
          DevCheats()
        } else {
          alert('Deactivating cheat...')
          totalGold = 0
          goldCheat = 0
          alert('You now have 0 gold.')
          DevCheats()
        }
        break;
      case 'infinite exp':
      case 'infininite xp':
      case 'infinite experience':
        if (expCheat === 0) {
          totalExp = -(Math.log(0))
          alert('Cheat successfully activated!')
          expCheat = 1
          youCheated = true
          DevCheats()
        } else {
          alert('Deactivating cheat...')
          totalExp = 0
          kixleyNCo[1].lev = 1
          alert('You are now level 1 and have 0 exp.')
          DevCheats()
        }
        break;
      case 'infinite attack':
        if (attackCheat === 0) {
          baseAttackPower = kixleyNCo[1].attackPow
          kixleyNCo[1].attackPow = -(Math.log(0))
          alert('Cheat successfully activated!')
          attackCheat = 1
          youCheated = true
          DevCheats()
        } else {
          alert('Deactivating cheat...')
          kixleyNCo[1].attackPow = baseAttackPower
          alert('You now have ' + kixleyNCo[1].attackPow + ' attack.')
          DevCheats()
        }
        break;
      case 'infinite health':
        if (healthCheat === 0) {
          kixleyNCo[1].hitPoints = -(Math.log(0))
          kixleyNCo[1].totalHP = kixleyNCo[1].hitPoints
          alert('Cheat successfully activated!')
          healthCheat = 1
          youCheated = true
          DevCheats()
        } else {
          alert('Deactivating cheat...')
          kixleyNCo[1].hitPoints = 100
          kixleyNCo[1].totalHP = kixleyNCo[1].hitPoints
          alert('You now have 100 health.')
          DevCheats()
        }
        break;
      case 'infinite blobs of doom':
      case 'infinite blobs':
        if (blobOfDoomCheat === 0) {
          kixleyNCo[1].blobs = -(Math.log(0))
          kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs
          alert('Cheat successfully activated!')
          blobOfDoomCheat = 1
          youCheated = true
          DevCheats()
        } else {
          alert('Deactivating cheat...')
          kixleyNCo[1].blobs = 0
          kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs
          alert('You now have 0 blobs of doom.')
        }
        break;
      case 'infinite accuracy':
        if (accCheat === 0) {
          actualAccuracy = kixleyNCo[1].accuracy
          kixleyNCo[1].accuracy = infinity
          alert('Cheat successfully activated!')
          accCheat = 1
          youCheated = true
          DevCheats()
        } else {
          alert('Deactivating cheat...')
          accCheat = 0
          kixleyNCo[1].accuracy = actualAccuracy
          alert('You now have normal accuracy.')
        }
        break;
      case 'activate all':
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
        alert('All cheats activated!')
        DevCheats()
        break;
      case 'leave':
        StartUpMenu()
        break;
      default:
        NotAnOption()
        DevCheats()
        break;
    }
  }

  function inTower() {
    alert('You see this group of prisoners in a dungeon talking about this guy named Balbeag who sent Tivél to destroy Smatino, because this person named Kixley had defeated a lot of his henchmen, the monsters of the Vacant Plains. They say that they hope Tivél tripped over a root in the swamp and drowned in the water.')
    hideOrFight()
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
      monsterGroup[1].lev += randomNumber(0, 1)
      monsterGroup[1].hitPoints = (100 + (monsterGroup[1].lev * randomNumber(0, 3))) * diffSetting
      monsterGroup[1].attackPow = (monsterGroup[1].lev + randomNumber(4, 8)) * diffSetting;
      if(toMountains) {
        if(dwNamesB) {
          if (monsterGroup[1].called !== 'Master') {
            alert('You head off towards the mountain, but get accosted by a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + ' in the plains.')
          } else if (foughtMaster === 0) {
            alert('You head off towards the mountain, but get accosted by the Master, who is level ' + monsterGroup[1].lev + '.')
            foughtMaster = 1
          } else if (foughtMaster === 1) {
            alert('You head off towards the mountain, but get accosted by a newly regenerated Master, who is level ' + monsterGroup[1].lev + '.')
          }
        } else {
          alert('You head off towards the mountain, but get accosted by a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + ' in the plains.')
        }
      } else {
        if(dwNamesB) {
          if (monsterGroup[1].called !== 'Master') {
            alert('You head off into the plains, where you find a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + '!')
          } else if (foughtMaster === 0) {
            alert('You head off into the plains, where you find the Master, who is level ' + monsterGroup[1].lev + '.')
            foughtMaster = 1
          } else if (foughtMaster === 1) {
            alert('You head off into the plains, where you find a newly regenerated Master, who is level ' + monsterGroup[1].lev + '.')
          }
        } else {
          alert('You head off into the plains, where you find a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + '!')
        }
      }
    } else if(place === "swamp") {
      monsterGroup[1].lev *= randomNumber(1, 2);
      monsterGroup[1].hitPoints = (100 + randomNumber(-10, 10)) * diffSetting + Math.pow(monsterGroup[1].lev, 2);
      monsterGroup[1].attackPow = (monsterGroup[1].lev + randomNumber(0, 5)) * diffSetting;
      if(dwNamesB) {
        if (monsterGroup[1].called !== 'Master') {
          alert('You get lost in the swamp, where you find a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + '!')
        } else if (foughtMaster === 0) {
          alert('You get lost in the swamp, where you find the Master, who is level ' + monsterGroup[1].lev + '.')
          foughtMaster = 1
        } else if (foughtMaster === 1) {
          alert('You get lost in the swamp, where you find a newly regenerated Master, who is level ' + monsterGroup[1].lev + '.')
        }
      } else {
        alert('You get lost in the swamp, where you find a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + '!')
      }
    } else if (place === "mountains") {
      monsterGroup[1].lev *= randomNumber(1, 2);
      monsterGroup[1].lev += 5;
      monsterGroup[1].hitPoints = (100 + randomNumber(-5, 15)) * diffSetting + Math.pow(monsterGroup[1].lev, 2);
      monsterGroup[1].attackPow = (monsterGroup[1].lev + randomNumber(1, 6)) * diffSetting;
      if(dwNamesB) {
        if (monsterGroup[1].called !== 'Master') {
          alert('Once you get into the mountains, you find a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + '!')
        } else if (foughtMaster === 0) {
          alert('Once you get into the mountains, you find the Master, who is level ' + monsterGroup[1].lev + '.')
          foughtMaster = 1
        } else if (foughtMaster === 1) {
          alert('Once you get into the mountains, you find a newly regenerated Master, who is level ' + monsterGroup[1].lev + '.')
        }
      } else {
        alert('Once you get into the mountains, you find a level ' + monsterGroup[1].lev + ' ' + monsterGroup[1].called + '!')
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
      return "rage";
    } else {
      return "fight";
    }
  }
  
  function ChooseTarget() {
    if(fightHandler.turn[0].called === "You") {
      temp = "";
      for(var i = 0; i < fightHandler.notTurn.length; i++) {
        temp += fightHandler.notTurn[i];
        temp += ", ";
      }
      answer = prompt("Who do you want to target?", temp + "Cancel").toLowerCase();
      if(answer === "cancel") {
        return "not targeting";
      }
      for(var i = 0; i < fightHandler.notTurn.length; i++) {
        if(answer === fightHandler.notTurn[i].toLowerCase()) {
          return i;
        }
      }
      alert("That's not a valid target. Please try again.");
      return ChooseTarget();
    } else {
      temp = 0;
      var temp2;
      for(var i = 0; i < fightHandler.notTurn.length; i++) {
        if(fightHandler.notTurn[i].attackPow > temp) {
          temp = fightHandler.notTurn[i].attackPow; // if monster attacking, choose the target with the greatest attack
          temp2 = i;
        }
      }
      return temp2;
    }
  }
  
  function FightMenu() {
    answer = prompt('What do you do? Health: ' + kixleyNCo[1].hitPoints + '/' + kixleyNCo[1].totalHP + '. ' + monsterGroup[1].called + ' health: ' + FightRound(monsterGroup[1].hitPoints) + '/' + monsterGroup[1].totalHP + '. ' + monsterGroup[1].called + ' type: ' + monsterGroup[1].element + '.', 'Fight, Health Potion, Magic, ' + specOrNo + 'Run').toUpperCase()
    switch (answer) {
      case 'FIGHT':
        return "fight";
        break;
      case 'USE THE FORCE':
      case 'USE THE FORCE, LUKE':
        if (useTheForceCount <= 0.8) {
          alert('As you use the Force, a lightsaber comes flying and hits ' + monsterGroup[1].calledPlusthe + '. Sadly, it flies right past you, but ' + monsterGroup[1].calledPlusthe + ' doesn\'t attack.')
          monsterGroup[1].hitPoints -= 10
          useTheForceCount += 0.1
        } else if (loc !== 3) {
          alert('Exhausted you are. Use the Force as well as you thought, you can\'t. Yoda, you seek Yoda.')
        } else {
          alert('Yoda runs out with a lightsaber and KILLS YOU!!!!!!!!')
          GameOver()
          pineapples = bananas
        }
        return FightMenu()
        break;
      case 'POKEMON':
        alert('No. This is not a Pokemon game. What are you talking about?')
        return FightMenu()
        break;
      case 'HEALTH POTION':
        return "health potion";
        break;
      case 'MAGIC':
      case 'GANDALF':
        return ChooseSpell()
        break;
      case 'SPECIAL':
      case 'SPECIAL ATTACK':
      case 'SPECIAL ATTACKS':
      case 'SPEC':
        return ChooseSpec()
        break;
      case 'RUN':
        return "run";
        break;
      case 'GIVE A SPEECH':
        answer = prompt('What speech?', 'The Gettysburg Address, Running From Failure by Joshua Conaway').toUpperCase()
          switch(answer) {
            case 'GETTYSBURG ADDRESS':
            case 'THE GETTYSBURG ADDRESS':
              alert('Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.')
              alert('Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this.')
              alert('But, in a larger sense, we can not dedicate—we can not consecrate—we can not hallow—this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us—that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion—that we here highly resolve that these dead shall not have died in vain—that this nation, under God, shall have a new birth of freedom—and that government of the people, by the people, for the people, shall not perish from the earth.')
              break;
            case 'RUNNING FROM FAILURE BY JOSHUA CONAWAY':
            case 'RUNNING FROM FAILURE':
            case 'RUNNING FROM FAILURRE BY JOSH CONAWAY':
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
         }
          return FightMenu()
          break;
      default:
        NotAnOption()
        return FightMenu()
        break;
    }
  }

  function useHealthPotion() {
    if (healthPotion <= 0) {
      alert('You search your backpack, but you don\'t have a health potion!')
    } else {
      alert('You pull a health potion out of your bag and drink it! Yum! It tastes like snickerdoodle cookies!')
      alert(hpEff + ' hit points restored!')
      kixleyNCo[1].hitPoints += hpEff
      healthPotion -= 1
      if (kixleyNCo[1].hitPoints > kixleyNCo[1].totalHP) {
        kixleyNCo[1].hitPoints = kixleyNCo[1].totalHP
      }
      alert('You now have ' + kixleyNCo[1].hitPoints + ' health!')
    }
  }
  
  function ChooseSpell() {
    temp = "";
    for(var i = 0; i < kixleyNCo[1].knownSpells.length; i++) {
      temp += kixleyNCo[1].knownSpells[i] + ", "
    }
    answer = prompt('What spell? You have ' + kixleyNCo[1].blobs + ' blobs of doom.', temp + 'Cancel').toUpperCase()
    for(var i = 0; i < kixleyNCo[1].knownSpells.length; i++) {
      if(kixleyNCo[1].knownSpells[i].toUpperCase() === answer) {
        if(kixleyNCo[1].blobs < kixleyNCo[1].spellCosts[i]) {
          alert("You don\'t have enough blobs of doom! You need " + kixleyNCo[1].spellCosts[i] + " blobs of doom.");
          return ChooseSpell();
        } else {
          return answer.toLowerCase();
        }
      }
    }
    if(answer === "CANCEL") {
      return FightMenu();
    } else {
      NotAnOption();
      return ChooseSpell();
    }
  }

  function ChooseSpec() {
    if (specOrNo !== '') {
      answer = confirm('Would you like to use your special attack? It is ' + spec[0] + '. It\'s decription is \'' + spec[1] + '\'.', 'Yes, No')
      switch (answer) {
        case true:
          if(spec[0] === "Shoot" && arrows === 0) {
            alert("You're out of arrows to shoot!");
            return ChooseSpec();
          }
          return spec[0].toLowerCase();
          break;
        case false:
          return FightMenu()
          break;
        default:
          NotAnOption()
          return ChooseSpec()
          break;
      }
    } else {
      alert('This class doesn\'t have a special attack!')
      return FightMenu()
    }
  }
  
  function Shoot(target) {
    usedShot = true
    target.accuracy -= 30
    arrows -= 1
    alert('You did ' + randomNumber(kixleyNCo[1].attackPow - 3, kixleyNCo[1].attackPow + 3) + ' damage by shooting the monster!')
    alert('You have ' + arrows + ' arrows!')
    target.hitPoints -= randomNumber(kixleyNCo[1].attackPow - 3, kixleyNCo[1].attackPow + 3)
  }

  function Steal(target) {
    if (percentChance(43) && !usedSteal) {
      alert('You steal ' + target.calledPlusthe + '\'s weapon!')
      kixleyNCo[1].attackPow += 2
      target.attackPow -= 2;
      usedSteal = true;
    } else if(usedSteal) {
      alert('You\'ve already stolen ' + target.calledPlusthe + '\'s weapon!');
    } else {
      alert('You fail to steal ' + target.calledPlusthe + '\'s weapon.')
    }
  }
  
  function WonTheFight() {
    if (inSwamp === 1) {
      alert('As the monster dies, you get teleported out of the swamp.')
      inSwamp = 0
      swampCounter++
    } else if (fightingGroup) {
      alert('Balbeag\'s soldiers are defeated!')
      fightingGroup = false
      inTowerPostDoomedGroup()
    } else if (fightingAAbea) {
      alert('Tivél is defeated!')
      fightingAAbea = false
      finalBossFight()
    } else if (fightingBalbeag) {
      fightingBalbeag = false
      Credits()
      beatTheGame()
    } else {
      if(numMons === 1) {
        alert('The monster is defeated!')
      } else {
        alert("The monsters are defeated!");
      }
      plainsCounter++
    }
    if (toMountains) {
      alert("With the monster defeated, you hike back down the mountain.");
      toMountains = false
      Places();
    }
    goldDrops = randomNumber(25 * numMons, 75 * numMons) * dropMult;
    expPoints = randomNumber(50 * numMons, 150 * numMons);
    killCounter += numMons;
    if (kixleyNCo[1].rageEffect !== 1) {
      alert('You calm down.')
      kixleyNCo[1].rageEffect = 1;
    }
    alert('You got ' + goldDrops + ' gold and ' + expPoints + ' experience!')
    totalGold += goldDrops
    questGoldAmt += goldDrops
    cumulativeGold += goldDrops
    totalExp += expPoints
    questExpAmt += expPoints
    CheckIfGotAchieve('Gold')
    alert('You now have ' + totalGold + ' gold and ' + totalExp + ' experience points.')
    if (onAQuest === 1 && y === 1) {
      questKillAmt += numMons
    }
    if (totalExp >= levelReq) {
      checkForLevelUp()
    } else {
      expLeft = levelReq - totalExp
      alert('You have ' + expLeft + ' experience to go!')
    }
    CheckIfGotAchieve('Kill')
  }

  function hideOrFight() {
    answer = prompt('Suddenly, you see soldiers talking about how great their master Balbeag is. Do you take them down, or hide from them?', 'Take Them Down, Hide').toLowerCase();
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
    switch (answer) {
      case 'hide':
      case 'hide from them':
        alert('As they pass your hiding place, they see you and say \'Hey, look at that little rat hiding in a garbage can!\'')
        fightHandler = new Fight(kixleyNCo, monsterGroup);
        fightHandler.fightLoop();
        break;
      case 'take them down':
      case 'take':
      case 'fight':
      case 'take down':
        alert('You jump out in front of them and they draw their swords.')
        fightHandler = new Fight(kixleyNCo, monsterGroup);
        fightHandler.fightLoop();
        break;
      case 'yell ur mom gay':
      case 'yell "ur mom gay"':
      case 'yell your mom gay':
      case 'yell "your mom gay"':
        alert('The soldiers notice you and they draw their swords.')
        fightHandler = new Fight(kixleyNCo, monsterGroup);
        fightHandler.fightLoop();
        break;
      case 'commit suicide':
        alert('You grab a sword from a soldier and lop off your head.')
        Credits()
        beatTheGame()
        break;
      case 'exist':
      case 'breathe':
      case 'stay':
        alert('You stay where you are and the soldiers find and fight you.')
        fightHandler = new Fight(kixleyNCo, monsterGroup);
        fightHandler.fightLoop();
        break;
      case 'transform into a dragon':
        if (percentChance(99.99)) {
          alert('You attempt to transform into a dragon, but fail, and the soldiers kill you.')
          Credits()
          pineapples = bananas
        } else {
          kixleyNCo[1].chosenClass = 12
          kixleyNCo[1].hitPoints = 80000
          kixleyNCo[1].attackPow = 1000
          kixleyNCo[1].magicSkillz = 2000000000000
          kixleyNCo[1].accuracy = 100
          alert('You transform into a dragon, and kill the soldiers as well as Tivél. You then blast down Balbeag\'s door and fight him too.')
          fightingGroup = false;
          finalBossFight()
        }
        break;
      default:
        alert('That wasn\'t an option. Please fight a group of Balbeag\'s soldiers.')
        fightHandler = new Fight(kixleyNCo, monsterGroup);
        fightHandler.fightLoop();
        break;
    }
  }

  function inTowerPostDoomedGroup() {
    loc = 4
    numMons = 1;
    alert('You climb on up the tower, and meet a trembling Tivél, who has just reported to Balbeag. You then have to fight him.')
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
      alert('You use some blobs of doom that you find in Tivél\'s bag to blast down the door and fight Balbeag!')
    }
    monsterGroup[1] = new Fighter(100, 100, 90, "Balbeag", 50, "Boss", 100);
    monsterGroup[1].calledPlusThe = monsterGroup[1].called
    monsterGroup[1].calledPlusthe = monsterGroup[1].called
    fightingBalbeag = true
    monsterGroup[1].hitPoints = (100 + randomNumber(-10, 10)) * diffSetting + monsterGroup[1].lev + Math.pow(kixleyNCo[1].lev, 2);
    monsterGroup[1].attackPow = (monsterGroup[1].lev + randomNumber(5, 10)) * diffSetting;
    fightHandler = new Fight(kixleyNCo, monsterGroup);
    fightHandler.fightLoop();
  }
  
  /**********************\
  | All that other stuff |
  \**********************/

  function Options() {
    alert('This is the options menu!');
    answer = prompt('What would you like to do? Volume: ' + volumeSettings, 'Volume, Quality, Text Pace, Leave').toUpperCase();
    switch (answer) {
      case 'VOLUME':
        volumeSettings = prompt('What do you want to set the volume at?', '1 to 10');
        switch (answer) {
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
            alert('Volume set! Now just imagine the noises at the appropriate volume.');
            Options();
            break;
          default:
            alert('It can only be from 1 to 10.');
            volumeSettings = '';
            Options();
        }
        break;
      case 'QUALITY':
        alert('What are you talking about? We don\'t have any pictures, man.');
        Options();
        break;
      case 'TEXT PACE':
        alert('Hahahahahahahaha. All the text is instant, man.');
        Options();
        break;
      case 'LEAVE':
        if (from === 'in-game') {
          Menu();
        } else {
          StartUpMenu();
        }
        break;
      case 'DEV CHEATS':
        alert('Welcome to the secret area, where you can enable developer cheats.');
        alert('Don\'t use these if you\'re not a dev.');
        answer = prompt('What is the password?', 'Leave').toLowerCase();
        switch (answer) {
          case '65810':
            alert('Access granted!');
            DevCheats();
            break;
          case 'leave':
            switch (loc) {
              case 1:
                Places()
                break;
              case 2:
                InTown()
                break;
              case null:
                StartUpMenu()
                break;
            }
            break;
          default:
            alert('Bad boy. Go sit in an infinite loop.');
            while (true) {
              alert('-rAQZdew');
              alert('That message was brought to you by Murphy, one of the programmer\'s dog.')
              alert('Also this is an infinite loop')
            }
            while (true) {
              alert('-rAQZdew')
              alert('That message was brought to you by Murphy, one of the programmer\'s dog.')
            }
        }
        break;
      default:
        NotAnOption()
        Options()
        break;
    }
  }

  function Places() {
    loc = 1
    if (mountainPass) {
      answer = prompt('Where do you go now? You have ' + totalGold + ' gold, and ' + kixleyNCo[1].hitPoints + '/' + kixleyNCo[1].totalHP + ' health.', 'Town, Plains, Swamp, Mountains, Menu').toUpperCase()  
    } else {
      answer = prompt('Where do you go now? You have ' + totalGold + ' gold, and ' + kixleyNCo[1].hitPoints + '/' + kixleyNCo[1].totalHP + ' health.', 'Town, Plains, Swamp, Menu').toUpperCase()
    }
    switch (answer) {
      case 'TOWN':
        if (aabeaDestroysTown === false) {
          alert('You walk into town, where there is a marketplace and an inn.')
          InTown()
        } else {
          alert('As you near the outskirts of town, you notice the stream of people leaving town. Then you notice that the entire place is now just a gigantic blast crater. Somebody blew it up!!! You decide to investigate, and walk over to the stream of people.')
          alert('When you reach the people, they all say this person named Tivél had just come to town and started fires all over, and then used some weird, magical powers to blow up Smatino.')
          alert('You are sure this Tivél is the same as the one who you met in the swamp, and wish you had used some \'weird, magical powers\' to blow him up')
          alert('You race back to the swamp, and see him from a distance. You can\'t, however, blow him up. There are too many vines in the way. So, you follow him. You see a large tower in the distance, and finally, after a few hours, reach it at night. You see Tivél enter, and then, as the gate is clanging down above him, you slide under it and manage to get in.')
          inTower()
        }
        break;
      case 'PLAINS':
        if (plainsCounter === 7) {
          alert('As you are walking through the plains you see a map lying on the ground. It shows a path leading to a nearby swamp.')
          swampDiscovery = true
        }
        monsInitialize("plains");
        break;
      case 'SWAMP':
        if (!swampDiscovery) {
          alert('You have heard rumors of this place, but have never been able to find out where it is.')
          Places();
        } else {
          if (swampCounter === 7 && killCounter >= 14) {
            alert('As you are walking through the swamp, you meet someone. He says his name is Tivél, and he is heading towards Smatino, but doesn\'t tell why.')
            aabeaDestroysTown = true
          }
          inSwamp = 1;
          monsInitialize("swamp");
        }
        break;
      case 'MOUNTAINS':
      case 'PASS':
      case 'MOUNTAIN PASS':
        if(!mountainPass) {
          alert("You try and try, but you can't get to the mountain!");
          Places();
        } else {
          toMountains = true
          if(percentChance(50)) {
            monsInitialize("plains");
          } else {
            Mountains()
          }
        }
        break;
      case 'SAVE':
        savePlaces()
        break;
      case 'MENU':
        Menu()
        break;
      default:
        NotAnOption()
        Places()
        break;
    }
  }

  function Mountains() {
    alert('You make it through the plains and head off into the mountains.')
    loc = 3;
    monsInitialize("mountains");
  }
  
  function CheckIfGotAchieve(whichOne) {
    switch (whichOne) {
      case 'Kill':
        if (killCounter === 5) {
          alert('You got the Achievement: Kill 5 Monsters.');
          compAchieve.push('Kill 5 Monsters');
        } else if (killCounter === 10) {
          alert('You got the Achievement: Kill 10 Monsters.');
          compAchieve.push('Kill 10 Monsters');
        } else if (killCounter === 20) {
          alert('You got the Achievement: Kill 20 Monsters.');
          compAchieve.push('Kill 20 Monsters');
        }
        Places();
        break;
      case 'Level':
        if (kixleyNCo[1].lev === 5) {
          alert('You got the Achievement: Reach Level 5.');
          compAchieve.push('Reach Level 5');
        } else if (kixleyNCo[1].lev === 10) {
          alert('You got the Achievement: Reach Level 10.');
          compAchieve.push('Reach Level 10');
        } else if (kixleyNCo[1].lev === 20) {
          alert('You got the Achievement: Reach Level 20.');
          compAchieve.push('Reach Level 20');
        }
        break;
      case 'Gold':
        if (cumulativeGold >= 1000 && getGoldAchieve === 0) {
          alert('You got the Achievement: Get 1000 cumulative gold.');
          compAchieve.push('Get 1000 cumulative gold');
          alert('You have ' + 9 - compAchieve.length + ' achievements left!');
          getGoldAchieve = 1;
        } else if (cumulativeGold >= 2000 && getGoldAchieve === 1) {
          alert('You got the Achievement: Get 2000 cumulative gold.');
          compAchieve.push('Get 2000 cumulative gold');
          getGoldAchieve = 2;
          alert('You have ' + 9 - compAchieve.length + ' achievements left!');
        } else if (cumulativeGold >= 5000 && getGoldAchieve === 2) {
          alert('You got the Achievement: Get 5000 cumulative gold.');
          compAchieve.push('Get 5000 cumulative gold');
          getGoldAchieve = -(Math.log(0));
        }
        break;
    }
  }

  function ListingAchievements() {
    alert('All of the achievements:');
    for (e = 0; e < allAchievements.length; e += 1) {
      alert(allAchievements[e]);
    }
    alert('Completed Achievements:');
    if (compAchieve.length === 0) {
      alert('Nothing. :(');
    } else {
      for (e = 0; e < compAchieve.length; e += 1) {
        alert(compAchieve[e]);
      }
    }
    achievementMenu();
  }

  function achievementMenu() {
    achieveCompletion = (compAchieve.length / allAchievements.length) * 100;
    alert('This is the achievement menu. Here you can find the list of achievements, both completed and unfinished.');
    answer = prompt('Achievement completion: ' + achieveCompletion + '%', 'List Achievements, Exit').toUpperCase();
    switch (answer) {
      case 'LIST ACHIEVEMENTS':
        ListingAchievements();
        break;
      case 'PINEAPPLES':
        alert('The mighty pineapple sits on his throne atop the highest mountain of Uruloki. In his slow, booming, voice, he says, \'Whoever has called upon me shall perish!\' Then he turns on you and shoots you with lasers coming from his eyes.')
        alert('\'GAHHH!!!\' you scream as you wake up. \'Oh,\' you think. \'That was just a dream. Whew!\' You stand up and continue browsing your achievements.');
        achievementMenu();
        break;
      case 'EXIT':
        if (from !== 'in-game') {
          StartUpMenu();
        } else {
          Menu()
        }
        break;
      default:
        NotAnOption();
        achievementMenu();
        break;
    }
  }

  function StartUpMenu() {
    if (openingMenu === true) {
      switch (randomNumber(1, 10000)) {
        case 3141:
          alert('WELCOME TO unnamedTextAdventure!');
          break;
        default:
          alert('WELCOME TO KIXLEY!');
          openingMenu = false
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
      alert('We noticed that you are using Internet Explorer. Because of this, your Kixley experience will be unsatisfactory. This is because the boxes will change position.');
      alert('Here are some suggestions for browsers:');
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
    answer = prompt('Choose an option. (Version: Beta 1.2)', 'Start, Options, Load, Achievements, Create New Account, Log In, Exit').toUpperCase()
    switch (answer) {
      case 'START':
        alert('Before you start, please set the difficulty. Easier difficulties have monsters with less health and attack. Harder difficulties have monsters with more health and attack.')
        Difficulty()
        openingMenu = 0
        break;
      case 'OPTIONS':
        Options()
        break;
      case 'LOAD':
        load()
        break;
      case 'ACHIEVEMENTS':
        achievementMenu()
        break;
      case 'EXIT':
        alert('Goodbye!')
        Credits()
        const e = new Error("Thanks for playing!");
        throw e;
        break;
      case 'CREATE NEW ACCOUNT':
        alert('WARNING: As of right now, accounts are not yet in working order. As such, use with caution.')
        MakeNewAccount()
        break;
      case 'LOGIN':
        alert('WARNING: As of right now, accounts are not yet in working order. As such, use with caution.')
        login()
        break;
      case 'YEE':
        var windowObjectReference;
        var strWindowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
        windowObjectReference = window.open('https://www.youtube.com/watch?v=q6EoRBvdVPQ', 'YEE', strWindowFeatures)
        alert('Did you watch it?')
        StartUpMenu()
        break;
      case 'MOZILLA GEAR STORE':
        alert('Check out the plush fox in the store!')
        var windowObjectReference;
        var strWindowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
        windowObjectReference = window.open('https://gear.mozilla.org/?utm_source=directory-tiles&utm_medium=tiles&utm_content=GearV2', 'Mozilla_Gear_Store', strWindowFeatures)
        StartUpMenu()
        break;
      case 'GO DIE IN A HOLE':
        alert('No. Go sit in an infinite loop.')
        while (true) {
          alert('-rAQZdew')
          alert('That message was brought to you by Murphy, one of the programmer\'s dog.')
        }
        break;
      default:
        NotAnOption()
        StartUpMenu()
        break;
    }
  }

  function Menu() {
    from = 'in-game'
    answer = prompt('Choose an option. (Version: Beta 1.1)', 'Options, Exit, Return, Save, Log In').toLowerCase()
    switch (answer) {
      case 'options':
        Options()
        break;
      case 'exit':
        alert('Adios!')
        Credits()
        const e = new Error("Thanks for playing!");
        throw e;
        break;
      case 'return':
        switch (loc) {
          case 1:
            Places()
            break;
          case 2:
            InTown()
            break;
        }
        break;
      case 'save':
        saveMenu()
        break;
      case 'log in':
        alert('WARNING: As of right now, accounts are not yet in working order. As such, use with caution.')
        login()
        break;
      default:
        NotAnOption()
        Menu()
    }
  }

  function Difficulty() {
    if (useDefaults === false || useDefaultDiff === false) {
      answer = prompt('What do you want the difficulty to be?', 'Easy, Normal, Hard, Epic, Legend').toUpperCase()
      switch (answer) {
        case 'EASY':
        case "EZ":
          diffSetting = 0.5
          break;
        case 'NORMAL':
        case "N":
          diffSetting = 1
          break;
        case 'HARD':
        case "H":
          diffSetting = 1.5
          break;
        case 'EPIC':
        case "E":
          diffSetting = 2
          break;
        case 'LEGEND':
        case "L":
          diffSetting = 2.5
          break;
        default:
          NotAnOption()
          Difficulty()
          break;
      }
    } else {
      diffSetting = localStorage.getItem(username + 'Difficulty@Kixley@65810')
      diffSetting = parseInt(diffSetting, 10)
      switch (diffSetting) {
        case 3:
          diffSetting = 0.5
          break;
        case 3.5:
          diffSetting = 1
          break;
        case 4:
          diffSetting = 1.5
          break;
        case 4.5:
          diffSetting = 2
          break;
        case 5:
          diffSetting = 2.5
          break;
      }
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
    if (settingDefault === false) {
      ChooseClass()
    } else {
      settingDefault = false
      switch (diffSetting) {
        case 0.5:
          diffSetting = 3;
          break;
        case 1:
          diffSetting = 1;
          break;
        case 1.5:
          diffSetting = 4;
          break;
        case 2:
          diffSetting = 2;
          break;
        case 2.5:
          diffSetting = 5;
          break;
      }
      localStorage.setItem(username + 'Difficulty@Kixley@65810', diffSetting)
      inAccount()
    }
  }

  function KnightClass() {
    resetSpec()
    answer = prompt('Knight', 'Inspect, Choose, Exit').toUpperCase()
    switch (answer) {
      case 'INSPECT':
        alert('The Knight is a fierce warrior. He/She knows when to fight and when to block, and trains himself ceaselessly. Attack + 2, Health + 15, Blobs of Doom - 100 (similar to mana or magicka), Spells 50% less effective.')
        KnightClass()
        break;
      case 'CHOOSE':
        ChoosingAClass(chosenClass)
        break;
      case 'EXIT':
        ChooseClass()
        break;
      default:
        NotAnOption()
        KnightClass()
        break;
    }
  }

  function MageClass() {
    resetSpec()
    answer = prompt('Mage', 'Inspect, Choose, Exit').toUpperCase()
    switch (answer) {
      case 'INSPECT':
        alert('The Mage does not overuse the fight option. Rather, he/she uses magical attacks that damage the enemy. Attack - 2, Blobs of Doom (similar to mana or magicka) + 100, Health - 15, Spells 50% more effective.')
        MageClass()
        break;
      case 'CHOOSE':
      case 'INSPECT, CHOOSE':
        ChoosingAClass(chosenClass)
        break;
      case 'EXIT':
        ChooseClass()
        break;
      default:
        NotAnOption()
        MageClass()
        break;
    }
  }

  function BarbarianClass() {
    resetSpec()
    answer = prompt('Barbarian', 'Inspect, Choose, Exit').toUpperCase()
    switch (answer) {
      case 'INSPECT':
        alert('The Barbarian hits hard, but at the cost of health. With the Rage spell, he/she can knock out enemies with a single hit. Attack + 4, Health - 25')
        BarbarianClass()
        break;
      case 'CHOOSE':
        ChoosingAClass(chosenClass)
        break;
      case 'EXIT':
        ChooseClass()
        break;
      default:
        NotAnOption()
        BarbarianClass()
        break;
    }
  }

  function ClericClass() {
    resetSpec()
    answer = prompt('Cleric', 'Inspect, Choose, Exit').toUpperCase()
    switch (answer) {
      case 'INSPECT':
        alert('The Cleric would prefer to heal friends than attack foes, but he/she will have to fight now. With the new Heal spell, they can restore some of their health. Attack - 3, Health + 10, Blobs of Doom (similar to mana or magicka) +  50, Spells 25% more effective, Heal spell.')
        ClericClass()
        break;
      case 'CHOOSE':
        ChoosingAClass(chosenClass)
        break;
      case 'EXIT':
        ChooseClass()
        break;
      default:
        NotAnOption()
        ClericClass()
        break;
    }
  }

  function PrinceClass() {
    resetSpec()
    answer = prompt('Prince', 'Inspect, Choose, Exit').toUpperCase()
    switch (answer) {
      case 'INSPECT':
        alert('The Prince is like a Knight on steroids. The fight option is definitely the choice for this class. Attack + 4, Health + 30, Blobs of Doom (similar to mana or magicka) - 200, Spells 75% less effective.')
        PrinceClass()
        break;
      case 'CHOOSE':
        ChoosingAClass(chosenClass)
        break;
      case 'EXIT':
        ChooseClass()
        break;
      default:
        NotAnOption()
        PrinceClass()
        break;
    }
  }

  function ArchmageClass() {
    resetSpec()
    answer = prompt('Arch-Mage', 'Inspect, Choose, Exit').toUpperCase()
    switch (answer) {
      case 'INSPECT':
        alert('The Arch-Mage is like a Mage on steroids. You should definitely use some magic as this class. Attack - 4, Health - 30, Blobs of Doom (similar to mana or magicka) + 200, Spells 75% more effective.')
        ArchmageClass()
        break;
      case 'CHOOSE':
        ChoosingAClass(chosenClass)
        break;
      case 'EXIT':
        ChooseClass()
        break;
      default:
        NotAnOption()
        ArchmageClass()
        break;
    }
  }

  function ThiefClass() {
    spec = ['Steal', 'A 43% chance to steal something from a monster, increasing your attack (for that battle) and decreasing theirs!']
    answer = prompt('Thief', 'Inspect, Inspect Special Attack, Choose, Exit').toUpperCase()
    switch (answer) {
      case 'INSPECT':
        alert('The Thief class has put his/her stealing ability to good use. Now, he/she steals from monsters! Attack - 1, Blobs of Doom (similar to mana or magicka) - 50, Accuracy + 20%, Drops + 50%, Special Attack: Steal.')
        ThiefClass()
        break;
      case 'INSPECT SPECIAL ATTACK':
      case 'INSPECT SPECIAL':
        alert(spec[1])
        ThiefClass()
        break;
      case 'CHOOSE':
        ChoosingAClass(chosenClass)
        break;
      case 'EXIT':
        ChooseClass()
        break;
      default:
        NotAnOption()
        ThiefClass()
        break;
    }
  }

  function NinjaClass() {
    resetSpec()
    answer = prompt('Ninja', 'Inspect, Choose, Exit').toUpperCase()
    switch (answer) {
      case 'INSPECT':
        alert('The Ninja class is oriented towards hitting more and getting hit less. With higher accuracy, this master of hiding also decreases his/her opponent\'s accuracy. Attack - 2, Blobs of Doom (similar to mana or magicka) - 50, Accuracy + 25%, Monster Accuracy - 35%')
        NinjaClass()
        break;
      case 'CHOOSE':
        ChoosingAClass(chosenClass)
        break;
      case 'EXIT':
        ChooseClass()
        break;
      default:
        NotAnOption()
        NinjaClass()
        break;
    }
  }

  function CavalryClass() {
    resetSpec()
    answer = prompt('Cavalry', 'Inspect, Choose, Exit').toUpperCase()
    switch (answer) {
      case 'INSPECT':
        alert('The Cavalry class is like the Knight, but has a higher crit chance. However, the other advantages are less. Attack + 1, Health + 7, Crit Chance + 10%, Crit Multiplier + 0.5, Blobs of Doom (similar to mana or magicka) - 150, Spells 60% less effective.')
        break;
      case 'CHOOSE':
        ChoosingAClass(chosenClass)
        break;
      case 'EXIT':
        ChooseClass()
        break;
      default:
        NotAnOption()
        CavalryClass()
    }
  }

  function ArcherClass() {
    spec = ['Shoot', 'You drop back and shoot an arrow at the monster, decreasing your enemy\'s accuracy. However, this attack costs arrows']
    answer = prompt('Archer', 'Inspect, Choose, Exit').toUpperCase()
    switch (answer) {
      case 'INSPECT':
        alert('The Archer class isn\'t the strongest, but they still can fight well. With the Shoot attack, they can inflict damage while making the monster less accurate. Attack - 2, Health - 7, Blobs of Doom (similar to mana or magicka), - 15, Spells 10% more effective, Accuracy + 30%, Special Attack: Shoot.')
        ArcherClass()
        break;
      case 'INSPECT SPECIAL ATTACK':
      case 'INSPECT SPECIAL':
        alert(spec[1])
        ArcherClass()
        break;
      case 'CHOOSE':
        ChoosingAClass(chosenClass)
        break;
      case 'EXIT':
        ChooseClass()
        break;
      default:
        NotAnOption()
        ArcherClass()
        break;
    }
  }

  function ChoosingAClass(chosenClass) {
    if (useDefaults === true) {
      answer = true
      chosenClass = localStorage.getItem(username + 'Class@Kixley@65810')
    } else {
      answer = confirm('Are you sure?')
    }
    switch (answer) {
      case true:
        if (useDefaults === false) {
          alert('You are now a ' + chosenClass + '!')
        }
        switch (chosenClass) {
          case 'knight':
            kixleyNCo[1].attackPow += 2
            kixleyNCo[1].hitPoints += 15
            kixleyNCo[1].totalHP += 15
            kixleyNCo[1].blobs -= 100
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].magicSkillz -= 0.5
            kixleyNCo[1].chosenClass = 0
            break;
          case 'mage':
            kixleyNCo[1].attackPow -= 2
            kixleyNCo[1].hitPoints -= 15
            kixleyNCo[1].totalHP -= 15
            kixleyNCo[1].blobs += 100
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].magicSkillz += 0.5
            kixleyNCo[1].chosenClass = 1
            break;
          case 'barbarian':
            kixleyNCo[1].attackPow += 4
            kixleyNCo[1].hitPoints -= 25
            kixleyNCo[1].totalHP -= 25
            kixleyNCo[1].chosenClass = 2
            break;
          case 'cleric':
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
          case 'prince':
            kixleyNCo[1].attackPow += 4
            kixleyNCo[1].hitPoints += 30
            kixleyNCo[1].totalHP += 30
            kixleyNCo[1].blobs -= 200
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].magicSkillz -= 0.75
            kixleyNCo[1].chosenClass = 4
            break;
          case 'arch-mage':
            kixleyNCo[1].attackPow -= 4
            kixleyNCo[1].hitPoints -= 30
            kixleyNCo[1].totalHP -= 30
            kixleyNCo[1].blobs += 200
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].magicSkillz += 0.75
            kixleyNCo[1].chosenClass = 5
            break;
          case 'thief':
            kixleyNCo[1].attackPow -= 1
            kixleyNCo[1].blobs -= 50
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].accuracy += 15
            dropMult += 0.5
            kixleyNCo[1].chosenClass = 6
            specOrNo = 'Special Attack, '
            break;
          case 'ninja':
            kixleyNCo[1].attackPow -= 2
            kixleyNCo[1].blobs -= 50
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].accuracy += 20
            monsterGroup[1].accuracy -= 10
            kixleyNCo[1].chosenClass = 7
            hasSpecial = true
            break;
          case 'cavalry':
            kixleyNCo[1].attackPow += 1
            kixleyNCo[1].hitPoints += 7
            kixleyNCo[1].totalHP += 7
            kixleyNCo[1].critChance += 10
            kixleyNCo[1].blobs -= 150
            kixleyNCo[1].totalBlobs = kixleyNCo[1].blobs;
            kixleyNCo[1].magicSkillz -= 0.6
            kixleyNCo[1].chosenClass = 8
            break;
          case 'archer':
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
          case 'super hardcore':
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
          Story()
        } else {
          settingDefault = false
          localStorage.setItem(username + 'Class@Kixley@65810', chosenClass)
          inAccount()
        }
        break;
      case false:
        ChooseClass()
        break;
    }
  }

  function ChooseClass() {
    if (useDefaultClass === true || useDefaults === true) {
      ChoosingAClass(chosenClass)
    } else {
      alert('Along with difficulty, we need you to choose your class. Please select one now.')
      chosenClass = prompt('The classes are: Knights, Mages, Barbarians, Clerics, Princes, Arch-Mages, Thieves, Ninjas, Cavalry, and Archers.', 'Knight, Mage, Barbarian, Cleric, Prince, Arch-Mage, Thief, Ninja, Cavalry, and Archer').toLowerCase()
      switch (chosenClass) {
        case 'knight':
          KnightClass()
          break;
        case 'mage':
          MageClass()
          break;
        case 'barbarian':
          BarbarianClass()
          break;
        case 'cleric':
          ClericClass()
          break;
        case 'prince':
          PrinceClass()
          break;
        case 'arch-mage':
        case 'archmage':
        case 'arch mage':
          chosenClass = 'arch-mage'
          ArchmageClass()
          break;
        case 'thief':
          ThiefClass()
          break;
        case 'ninja':
          NinjaClass()
          break;
        case 'cavalry':
          CavalryClass()
          break;
        case 'archer':
          ArcherClass()
          break;
        case 'super hardcore':
          SuperHardcoreClass()
          break;
        case 'vala':
          ValaClass()
          break;
        case 'good music':
          alert('https://www.youtube.com/watch?v=awrzeuTMQfU Watch this!')
          alert('And while you\'re at it, watch this too!: https://www.youtube.com/watch?v=dQw4w9WgXcQ ')
          ChooseClass()
          break;
        default:
          NotAnOption()
          ChooseClass()
          break;
      }
    }
  }

  function SuperHardcoreClass() {
    temp = randomNumber(80, 100)
    answer = prompt('Super Hardcore', 'Inspect, Choose, Exit').toLowerCase()
    switch (answer) {
      case 'inspect':
        alert('The Super Hardcore is for the hardcore fans, the ones who think that the Legend difficulty is too easy. Attack - 5, BoD - 300, Health - 75, Spells effects / ' + temp + '.')
        SuperHardcoreClass()
        break;
      case 'choose':
        ChoosingAClass(chosenClass)
        break;
      case 'exit':
        ChooseClass()
        break;
      default:
        NotAnOption()
        SuperHardcoreClass()
        break;
    }
  }

  function ValaClass() {
    if (PassOrNot === true) {
      answer = prompt('Vala', 'Inspect, Choose, Exit').toUpperCase()
      switch (answer) {
        case 'INSPECT':
          alert('The Vala class is super cheaty. Everything * INFINITY')
          SuperHardcoreClass()
          break;
        case 'CHOOSE':
          chosenClass = 'Vala'
          ChoosingAClass(chosenClass)
          break;
        case 'EXIT':
          ChooseClass()
          break;
        default:
          NotAnOption()
          SuperHardcoreClass()
          break;
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
    answer = prompt('Where to? You have ' + totalGold + ' gold and ' + kixleyNCo[1].hitPoints + ' health.', 'Marketplace, Inn, Leave, Menu')
    if (answer !== 'the TARDIS') {
      answer = answer.toUpperCase()
    }
    switch (answer) {
      case 'MARKETPLACE':
        InShop()
        break;
      case 'INN':
        InInn()
        break;
      case 'SAVE':
        saveTown()
        break;
      case 'LEAVE':
        alert('You leave town.')
        Places()
        break;
      case 'MENU':
        Menu()
        break;
      case 'YOUR MOM':
      case 'UR MOM':
        alert('You walk up to your mom. \'Woah, is that you, Kixley? It\'s been so long!\' she says. \'Yeah, yeah, mom. I gotta go save the world.\' you say. \'Ok then! Come see me soon!\'')
        InTown()
        break;
      case 'the TARDIS':
        alert('A blue police box shows up out of thin air, making a weird whooshing noise as it does. As the door opens, you walk in, and find yourself in a large box that is much smaller on the outside.')
        alert('A strange man says \'What are you doing in my TARDIS?!?!?!?!?!?!?!\' after the box makes the weird whooshing noise again. He drops you back off at Smatino.')
        dwNamesB = !dwNamesB
        InTown()
        break;
      default:
        NotAnOption()
        InTown()
        break;
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
        alert('You don\'t have enough gold to buy that many health potions. At max you could buy ' + Math.floor(totalGold / hpCost) + ' health potion(s).')
        InShop()
      }
      answer = confirm('Are you sure? You\'re going to buy ' + answer + ' health potions, and you have ' + totalGold + ' gold.', 'Yes, No')
      switch (answer) {
        case true:
          alert('Health potion(s) bought!')
          healthPotion += howMany
          answer = 0
          totalGold -= (hpCost * howMany)
          InShop()
          break;
        case false:
          InShop()
          break;
        default:
          NotAnOption()
          BuyHealthPotion()
      }
    } else {
      alert('That wasn\'t a number! You can\'t buy ' + answer + ' health potions!')
      BuyHealthPotion()
    }
  }

  function BuyWoodenSword() {
    if (woodenSword === 0) {
      if (totalGold >= wsCost) {
        answer = prompt('Are you sure?', 'Yes, No').toUpperCase()
        switch (answer) {
          case 'YES':
            alert('Wooden sword bought!')
            woodenSword++;
            kixleyNCo[1].attackPow *= (1 + (0.05 * (3 - diffSetting)))
            totalGold -= wsCost
            InShop()
            break;
          case 'NO':
            InShop()
            break;
          default:
            NotAnOption()
            BuyWoodenSword()
            break;
        }
      } else {
        alert('You don\'t have enough money.')
        InShop()
      }
    } else {
      alert('SOLD OUT.')
      InShop()
    }
  }

  function BuySpeedBoots() {
    if (speedBoots === 0) {
      if (totalGold >= sbCost) {
        answer = prompt('Are you sure?', 'Yes, No').toUpperCase()
        switch (answer) {
          case 'YES':
            alert('Speed boots bought!')
            speedBoots++
            totalGold -= sbCost
            kixleyNCo[1].accuracy += 5 * (3 - diffSetting)
            break;
          case 'NO':
            InShop()
            break;
          default:
            NotAnOption()
            BuySpeedBoots()
            break;
        }
      } else {
        alert('You don\'t have enough money.')
        InShop()
      }
    } else {
      alert('SOLD OUT.')
      InShop()
    }
    InShop()
  }

  function BuyArrows() {
    answer = prompt('How many arrows do you want?', '1')
    if (answer === '') {
      NotAnOption()
      BuyArrows()
    }
    firstChar = answer.charAt(0)
    if (firstChar === '0' || firstChar === '1' || firstChar === '2' || firstChar === '3' || firstChar === '4' || firstChar === '5' || firstChar === '6' || firstChar === '7' || firstChar === '8' || firstChar === '9') {
      howMany = parseInt(answer, 10)
      if (totalGold < (aCost * howMany)) {
        alert('You don\'t have enough gold to buy that many arrows. At max you could buy ' + Math.floor(totalGold / aCost) + ' arrows(s).')
        InShop()
      }
      answer = confirm('Are you sure? You\'re going to buy ' + answer + ' arrows, and you have ' + totalGold + ' gold. This will cost you ' + (aCost * howMany) + ' gold.', 'Yes, No')
      switch (answer) {
        case true:
          alert('Arrow(s) bought!')
          arrows += howMany
          answer = 0
          totalGold -= (aCost * howMany)
          InShop()
          break;
        case false:
          InShop()
          break;
        default:
          NotAnOption()
          BuyArrows()
      }
    } else {
      alert('That wasn\'t a number! You can\'t buy ' + answer + ' arrows!')
      BuyArrows()
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
   */

  function InShop() {
    alert('The marketplace master greets you.')
    answer = prompt('The marketplace master asks you if you would like to buy, or sell.', 'Buy, Sell, Leave').toUpperCase()
    switch (answer) {
      case 'SELL':
        Sell()
        break;
      case 'BUY':
        Buy()
        break;
      case 'LEAVE':
        InTown()
        break;
      default:
        NotAnOption()
        InShop()
        break;
    }


    function Sell() {
      if (woodenSword === 1 && speedBoots === 1) {
        itemSell = 'Wooden Sword, Speed Boots, Cancel'
      } else if (woodenSword === 1) {
        itemSell = 'Wooden Sword, Cancel'
      } else if (speedBoots === 1) {
        itemSell = 'Speed Boots, Cancel'
      } else {
        alert('You have nothing to sell.')
        InShop()
      }
      answer = prompt('What would you like to sell?', itemSell).toUpperCase()
      switch (answer) {
        case 'WOODEN SWORD':
          if (woodenSword === 1) {
            alert('A guy shows up and offers ' + .9 * wsCost + ' gold for your wooden sword.')
            answer = prompt('Are you sure you want to sell your wooden sword?', 'Yes, No').toUpperCase()
            switch (answer) {
              case 'YES':
                totalGold += .9 * wsCost
                woodenSword = 0
                kixleyNCo[1].attackPow /= (1 + (0.05 * (3 - diffSetting)))
                alert('Wooden sword sold!')
                InShop()
                break;
              case 'NO':
                Sell()
                break;
            }
          } else {
            alert('You don\'t have one to sell.')
            Sell()
          }
          break;
        case 'SPEED BOOTS':
          if (speedBoots === 1) {
            alert('A guy shows up and offers ' + .9 * sbCost + ' gold for your speed boots.')
            answer = prompt('Are you sure you want to sell your speed boots?', 'Yes, No').toUpperCase()
            switch (answer) {
              case 'YES':
                totalGold += .9 * sbCost
                speedBoots = 0
                kixleyNCo[1].accuracy -= 5 * (3 - diffSetting)
                alert('Speed boots sold!')
                InShop()
                break;
              case 'NO':
                Sell()
                break;
              default:
                NotAnOption()
                Sell()
                break;
            }
          } else {
            alert('You don\'t have one to sell.')
          }
          break;
        case 'CANCEL':
          InShop()
          break;
        case 'NUCLEAR WEAPONS':
          if (flamingSword) {
            NotAnOption()
            Sell()
          } else {
            alert('Morgan Freeman shows up and says \'Why are you selling your nuke?\'')
            alert('You respond by asking \'Why are you here, Morgan?\'')
            alert('Morgan Freeman tells you, \'To give you a magical flaming sword.\'')
            alert('Morgan Freeman gives you a magical flaming sword.')
            kixleyNCo[1].attackPow += 20
            flamingSword = true
            alert('You exclaim \'WHOA! It\'s on FIRE!\'')
            Sell()
          }
          break;
        default:
          NotAnOption()
          Sell()
          break;
      }
    }

    function Buy() {
      if (woodenSword === 1 && speedBoots === 1) {
        answer = prompt('One person in the marketplace says, \'What do you want? I have health potions for ' + hpCost + ' gold and arrows for ' + aCost + ' gold.\' You have ' + totalGold + ' gold.', 'Health Potions, Arrows, Cancel').toUpperCase()
      } else if (woodenSword === 1) {
        answer = prompt('One person in the marketplace says, \'What do you want? I have health potions for ' + hpCost + ' gold, a pair of speed boots for ' + sbCost + ' gold, and arrows for ' + aCost + ' gold.\' You have ' + totalGold + ' gold.', 'Health Potion, Speed Boots, Arrows, Cancel').toUpperCase()
      } else if (speedBoots === 1) {
        answer = prompt('One person in the marketplace says, \'What do you want? I have health potions for ' + hpCost + ' gold, a wooden sword for ' + wsCost + ' gold, and arrows for ' + aCost + ' gold.\' You have ' + totalGold + ' gold.', 'Health Potion, Wooden Sword, Arrows, Cancel').toUpperCase()
      } else {
        answer = prompt('One person in the marketplace says, \'What do you want? I have health potions for ' + hpCost + ' gold, a wooden sword for ' + wsCost + ' gold, some speed boots for ' + sbCost + ' gold, and arrows for ' + aCost + ' gold.\' You have ' + totalGold + ' gold.', 'Health Potion, Wooden Sword, Speed Boots, Arrows, Cancel').toUpperCase()
      }
      switch (answer) {
        case 'HEALTH POTION':
        case 'HEALTH POTIONS':
          BuyHealthPotion()
          break;
        case 'WOODEN SWORD':
          BuyWoodenSword()
          break;
        case 'SPEED BOOTS':
          BuySpeedBoots()
          break;
        case 'ARROWS':
          BuyArrows()
          break;
        case 'MEOW':
          alert('https://www.youtube.com/watch?v=QH2-TGUlwu4: Watch this!')
          Buy()
          break;
        case 'CANCEL':
          InShop()
          break;
        default:
          NotAnOption()
          Buy()
          break;
      }
    }
  }

  function InInn() {
    alert('A musty scent fills your nose as you walk into the inn. The dim lights are a stark difference from the outside, and it takes a moment for your eyes to adjust. When they do, they show you a man grinning at you. "Welcom\' to the Rowdy Barstead. You ca\' spend the night here if you like. Only 50 gold. You can also go to the common room. Do jobs fer money. Buy stuff real cheap.')
    answer = prompt('So whadda you say?', 'Yes, No, Common Room').toUpperCase()
    switch (answer) {
      case 'YES':
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
      case 'NO':
        alert('The man sighs as you leave the inn.')
        InTown()
        break;
      case 'COMMON ROOM':
        inCommonRoom()
        break;
      case 'JOHN CENA':
        alert('And his name is... JOHNNNN CENNNNNNAAAAAAAAAAA!!!!!')
        alert('DO DO DO DOOOO!!!')
        InInn()
        break;
      default:
        NotAnOption()
        InInn()
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
    answer = prompt('Hey! Ya want some more blobs? Yu\'ll get 7 this time, still fer 10 gold!', 'Yes, No').toUpperCase()
    switch (answer) {
      case 'YES':
        timeGTOne = 1
        GettingBlobsOfDoom()
        break;
      case 'NO':
        alert('All righty then. See ya later!')
        InInn()
        break;
      default:
        NotAnOption()
        wantingMoreBlobs()
        break;
    }
  }

  function blobsOfDoomShop() {
    answer = prompt('You walk up to Mithrómen. He says, \'Hey kid. I\'m runnin\' low on money, so I\'m selling my blobs o\' doom. So far there\'s been no buyers. You up for it? Only 10 gold for 6 blobs o\' doom.\'', 'Yes, No').toUpperCase()
    switch (answer) {
      case 'YES':
        GettingBlobsOfDoom()
        break;
      case 'NO':
        alert('Mithrómen sighs as you leave.')
        InInn()
        break;
      default:
        NotAnOption()
        blobsOfDoomShop()
        break;
    }
  }

  function questChoiceSwitch() {
    switch (answer) {
      case 'no':
        alert('Galkemen looks like he wants to kill you, so you get away from him and leave the inn, but then decide to go back in and just avoid Galkemen.')
        InInn()
        break;
      case 'yes':
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
      default:
        switch (y) {
          case 0:
            NotAnOption()
            killQuestChoice()
            break;
          case 1:
            NotAnOption()
            questGoldChoice()
            break;
          case 2:
            NotAnOption()
            questExpChoice()
            break;
          case 3:
            NotAnOption()
            questItemChoice()
            break;
        }
        break;
    }
  }

  function killQuestChoice() {
    answer = (prompt('Galkemen says \'Go kill ' + questKillReq + ' monsters.\'', 'Yes, No').toLowerCase())
    questChoiceSwitch()
  }

  function questGoldChoice() {
    answer = (prompt('Galkemen says \'Gimme ' + questGoldReq + ' gold. I\'ll give ya exp fer this one, instead o\' gold.\'', 'Yes, No').toLowerCase())
    questChoiceSwitch()
  }

  function questItemChoice() {
    answer = prompt('Galkemen says \'Go gimme a ' + reqItem + ' fer some exp.\'', 'Yes, No').toLowerCase()
    questChoiceSwitch()
  }

  function questExpChoice() {
    answer = prompt('Galkemen says \'Go get ' + questExpReq + ' exp, so you can gi\' my quests done faster.', 'Yes, No').toLowerCase()
    questChoiceSwitch();
  }

  function buySpeedBootsCheaply() {
    answer = (prompt('Gurthmereth says \'Low on money. Got speed boots. Will sell them real cheap. Only 70 gold.', yesNo).toLowerCase())
    switch (answer) {
      case 'yes':
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
      case 'no':
        alert('Gurthmereth looks at your receding back as you leave the common room.')
        InInn()
        break;
      default:
        NotAnOption()
        buySpeedBootsCheaply()
        break;
    }
  }

  function buyWoodenSwordsCheap() {
    answer = (prompt('Maegfin says \'Low on money. Got wooden swords. Will sell them real cheap. Only 35 gold.', yesNo).toLowerCase())
    switch (answer) {
      case 'yes':
        if (totalGold >= 35) {
          alert('Maegfin hands you the sword, along with a sheath, as you hand him the money')
          totalGold -= 35
          woodenSword = 1
          kixleyNCo[1].attackPow *= 1 + (0.05 * (3 - diffSetting))
          inCommonRoom()
        } else {
          alert('Maegfin sighs and says \'You don\'t have enough money. I want the money.\' Then you leave the common room.')
          InInn()
        }
        break;
      case 'no':
        alert('Maegfin looks at your receding back as you leave the common room.')
        InInn()
        break;
      default:
        NotAnOption()
        buyWoodenSwordsCheap()
        break;
    }
  }
  function beatTheGame() {
    answer = (prompt('You beat the game! Would you like to continue?', yesNo).toLowerCase())
    switch (answer) {
      case 'yes':
        alert('You return and help rebuild Smatino, ready to fight Balbeag\'s remaining monsters who still are evil, though their master is dead');
        alert('Mountain Pass discovered!')
        mountainPass = true
        aabeaDestroysTown = false
        InTown()
        break;
      case 'no':
        pineapples = bananas
        break;
      default:
        NotAnOption()
        beatTheGame()
        break;
    }
  }

  function StatToLevelUp() {
    answer = prompt('Please choose a stat to level up: Attack + ' + swordAdjustedTempMinusOne + ', Health + ' + levelUpHealth + ', Blobs of Doom + ' + levelUpBlobsOfDoom + '.', 'Attack, Health, Blobs of Doom').toUpperCase()
    switch (answer) {
      case 'ATTACK':
        alert('You got ' + swordAdjustedTempMinusOne + ' attack!')
        kixleyNCo[1].attackPow += swordAdjustedTempMinusOne
        baseAttackPower += temp
        attLevelUp++
        break;
      case 'HEALTH':
        alert('You got ' + levelUpHealth + ' health!')
        kixleyNCo[1].hitPoints += levelUpHealth
        kixleyNCo[1].totalHP += levelUpHealth
        break;
      case 'BLOBS OF DOOM':
        alert('You got ' + levelUpBlobsOfDoom + ' blobs of doom!')
        kixleyNCo[1].blobs += levelUpBlobsOfDoom
        kixleyNCo[1].totalBlobs += levelUpBlobsOfDoom
        break;
      default:
        NotAnOption()
        StatToLevelUp()
        break;
    }
  }

  function checkForLevelUp() {
    if (totalExp >= levelReq) {
      kixleyNCo[1].lev += 1
      temp = Math.floor(1.2 * kixleyNCo[1].lev) - 1
      swordAdjustedTempMinusOne = temp * (1 + (0.05 * woodenSword * (3 - diffSetting)));
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
    answer = prompt('The Innkeeper gestures towards a loud, brightly lit room. It is filled with people. You walk over to a corner of the room, where there are four guys. One is named Mithrómen, another is named Galkemen, another is named Maegfin, and the fourth is named Gurthmereth. All four say \'Hi!\'. Do you run away from them in fear, or talk to one of them? If you talk who do you talk to?', 'Run away in fear, Talk to Mithrómen, talk to Galkemen, talk to Maegfin, talk to Gurthmereth').toLowerCase()
    switch (answer) {
      case 'run away in fear':
        alert('You run away in fear.')
        InInn()
        break;
      case 'talk to mithromen':
      case 'talk to mithrómen':
        blobsOfDoomShop()
        break;
      case 'talk to galkemen':
        quest()
        break;
      case 'talk to maegfin':
        buyWoodenSwordsCheap()
        break;
      case 'talk to gurthmereth':
        buySpeedBootsCheaply()
        break;
      default:
        NotAnOption()
        inCommonRoom()
        break;
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
        pineapples = bannanas
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
      if (confirm('We\'ve detected that you do not have a default difficulty. Would you like to set one now?') === true) {
        settingDefault = true
        Difficulty()
        useDefaultDiff = true
      }
    }
    defaultClass = localStorage.getItem(username + 'Class@Kixley@65810')
    if (defaultClass !== null) {
      useDefaultClass = true
      chosenClass = defaultClass
    } else {
      if (confirm('We\'ve detected that you do not have a default class. Would you like to set one now?') === true) {
        settingDefault = true
        ChooseClass()
        useDefaultClass = true
      }
    }
    if (useDefaultDiff === true && useDefaultClass === true) {
      useDefaults = true
    }
    answer = prompt('What would you like to do?', 'Set default difficulty, Set default class, Back to menu, Stay Signed In').toLowerCase()
    switch (answer) {
      case 'set default difficulty':
        settingDefault = true
        Difficulty()
        break;
      case 'set default class':
        settingDefault = true
        ChooseClass()
        break;
      case 'back to menu':
        if (from === 'in-game') {
          Menu()
        } else {
          StartUpMenu()
        }
        break;
      case 'stay signed in':
        localStorage.setItem('staySignedInAs', username)
        break;
      default:
        NotAnOption()
        inAccount()
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
    answer = (prompt('Wanna save?', yesNo).toLowerCase())
    switch (answer) {
      case 'yes':
        alert('OK')
        save()
        break;
      case 'no':
        alert('Too bad. It\'s saving anyway.')
        save()
        break;
      default:
        NotAnOption()
        inTowerPostDoomedGroup()
        break;
    }
  }
}
Kixley()
