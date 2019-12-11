import { checkDefaults } from './users.js';
import { kixleyNCo, monsterGroup, dropMult, changeDropMult, story } from './fight.js';
import { writeText, requestInput } from './utility.js';

export { diffSetting, Shoot, Difficulty };



function GameClass(name, description, at, he, boD, spEff, spec, acc, drops, speed, critc, critd) {
  this.name = name;
  this.desc = description;
  this.attack = at || 0;
  this.health = he || 0;
  this.blobsOfDoom = boD || 0;
  this.spellEffect = spEff || 0;
  this.accuracy = acc || 0;
  this.dropAmount = drops || 0;
  this.speed = speed || 0;
  this.critChance = critc || 0;
  this.critDamage = critd || 0;
  this.special = spec || null;
  
  this.display = function() {
    writeText(this.name + " class:");
    writeText(this.desc);
    if(this.attack > 0) {
      writeText("Attack + " + this.attack);
    } else if (this.attack < 0) {
      writeText("Attack - " + Math.abs(this.attack));
    }
    
    if(this.health > 0) {
      writeText("Health + " + this.health);
    } else if (this.health < 0) {
      writeText("Health - " + Math.abs(this.health));
    }
    
    if(this.blobsOfDoom > 0) {
      writeText("Blobs of Doom (mana) + " + this.blobsOfDoom);
    } else if (this.blobsOfDoom < 0) {
      writeText("Blobs of Doom (mana) - " + Math.abs(this.blobsOfDoom));
    }
    
    if(this.spellEffect !== 100) {
      writeText("Spells " + this.spellEffect + "% effective");
    }
    
    if(this.accuracy > 0) {
      writeText("Accuracy + " + this.accuracy + "%");
    } else if (this.attack < 0) {
      writeText("Accuracy - " + Math.abs(this.accuracy) + "%");
    }
    
    if(this.dropAmount > 0) {
      writeText("Drop Amount + " + this.dropAmount + "%");
    } else if (this.dropAmount < 0) {
      writeText("Drop Amount - " + Math.abs(this.dropAmount));
    }
    
    if(this.speed > 0) {
      writeText("Speed + " + this.speed + "%");
    } else if (this.speed < 0) {
      writeText("Speed - " + Math.abs(this.speed) + "%");
    }
    
    if(this.critChance > 0) {
      writeText("Crit Chance + " + this.critChance + "%");
    } else if (this.critChance < 0) {
      writeText("Crit Chance - " + Math.abs(this.critChance) + "%");
    }
    
    if(this.critDamage > 0) {
      writeText("Crit Damage Multiplier + " + this.critDamage + "%");
    } else if (this.critDamage < 0) {
      writeText("Crit Damage Multiplier - " + Math.abs(this.critDamage) + "%");
    }
    
    if(this.special !== null) {
      writeText("Special Move: " + this.special.name);
      writeText(this.special.desc);
    }
    
    requestInput(["Choose", "Exit"], determineAnswer, [this]);
    function determineAnswer(obj) {
      switch (answer) {
        case 'Choose':
          obj[0].choose();
          break;
        case 'Exit':
          ChooseClass();
          break;
      }
    }
  }
  
  this.choose = function() {
    kixleyNCo[1].attackPow += this.attack;
    kixleyNCo[1].hitPoints += this.health;
    kixleyNCo[1].blobs += this.blobsOfDoom;
    kixleyNCo[1].magicSkillz = (this.spellEffect / 100);
    kixleyNCo[1].accuracy += this.accuracy;
    changeDropMult(dropMult + (this.dropAmount / 100));
    kixleyNCo[1].speed += this.speed;
    kixleyNCo[1].critChance += this.critChance;
    kixleyNCo[1].critDamage += (this.critDamage / 100);
    kixleyNCo[1].spec = this.special;
    story();
  }
}

function SpecialAttack(name, description, action) {
  this.name = name;
  this.desc = description;
  this.action = action;
}
                           // name, description, attack, health, bod, spell effectiveness, special, accuracy, drops, speed, critc, critmult
var classes = [new GameClass("Knight", "The knight is a fierce warrior. They know when to fight and when to block, and trains themself ceaselessly.", 2, 15, -100, 50),
               new GameClass("Mage", "The mage does not overuse the fight option. Rather, they use magical attacks that damage the enemy.", -2, -15, 100, 150),
               new GameClass("Barbarian", "The barbarian hits hard, but at the cost of health. With the Rage spell, they can knock out enemies with a single hit.", 4, 75),
               new GameClass("Cleric", "The cleric would prefer to heal friends than attack foes, but they will have to fight now. With the Heal spell, they can restore some of their health.", -3, 10, 50, 125, new SpecialAttack("Heal", "Heal 60 HP for 30 Blobs of Doom", function() {writeText("You heal 60 hitpoints!"); this.hitPoints += 60; if (this.hitPoints > this.totalHP) { this.hitPoints = this.totalHP; } this.blobs -= 30; })),
               new GameClass("Prince", "The prince is like a knight on steroids. The fight option is definitely the choice for this class.", 4, 30, -200, 25),
               new GameClass("Archmage", "The arch-mage is like a mage on steroids. You should definitely use some magic as this class.", -4, -30, 200, 175),
               new GameClass("Thief", "The thief class has put their stealing ability to good use. Now, they steal from monsters!", -1, 0, -50, 0, new SpecialAttack("Steal", "A 43% chance to steal something from a monster, increasing your attack (for that battle) and decreasing theirs!", Steal), 20, 50),
               new GameClass("Ninja", "The ninja class is oriented towards hitting more and getting hit less. With higher accuracy, this master of hiding also decreases their opponent\'s accuracy.", -2, 0, -50, 0, null, 25, 0, 10),
               new GameClass("Cavalry", "The cavalry class is like the knight, but with a higher crit chance. However, the other advantages are less.", 1, 7, -150, 40, null, 0, 0, 0, 10, 50),
               new GameClass("Archer", "The archer class isn't the strongest, but they still can fight well. With the shoot attack, they can inflict damage while making the monster less accurate.", -2, -7, -15, 110, new SpecialAttack("Shoot", "You drop back and shoot an arrow at the monster, decreasing your enemy\'s accuracy. However, this attack costs arrows.", Shoot), 30)
               ];

var classHealthChanges = [
  15, -15, -25,
  15,
  30, -30,
  0,
  0,
  7, -7, -75,
  -(Math.log(0))
];
var diffSetting = 0; // difficulty: Easy = 0.5, Normal = 1.0, Hard = 1.5, Epic = 2.0, Legend = 2.5
var chosenClass;



function Difficulty(settingDefault) { // boolean; whether the user is setting the default for account (see users)
  if (checkDefaults() !== "Both" || checkDefaults() !== "Diff") {
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
        localStorage.setItem(username + 'Difficulty@Kixley@65810', diffSetting);
        inAccount();
      } else {
        ChooseClass();
      }
    }
  } else {
    diffSetting = localStorage.getItem(username + 'Difficulty@Kixley@65810');
    diffSetting = parseInt(diffSetting, 10);
    monsInitialize("start");
  }
}



/*function ChoosingAClass(chosenClass) {
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
}*/

function ChooseClass() {
  if (checkDefaults() === "Class" || checkDefaults() === "Both") {
    ChoosingAClass(chosenClass)
  } else {
    writeText('Along with difficulty, we need you to choose your class. Please select one now.');
    var classNames = [];
    for(var i = 0; i < classes.length; i++) {
      classNames.push(classes[i].name);
    }
    requestInput(classNames, determineAnswer);
    function determineAnswer() {
      for(var i = 0; i < classes.length; i++) {
        if(answer === classes[i].name) {
          classes[i].display();
        }
      }
      chosenClass = answer;
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

function Steal(target) {
  if (percentChance(43)) {
    writeText('You steal ' + target.calledPlusthe + '\'s weapon!')
    kixleyNCo[1].attackPow += 2
    target.attackPow -= 2;
    usedSpec = true;
  } else {
    writeText('You fail to steal ' + target.calledPlusthe + '\'s weapon.')
  }
}

function Shoot(target) {
  usedSpec = true
  target.accuracy -= 30
  inventory[findNameInventory("Arrow")][1]--;
  writeText('You did ' + randomNumber(kixleyNCo[1].attackPow - 3, kixleyNCo[1].attackPow + 3) + ' damage by shooting the monster!');
  target.hitPoints -= randomNumber(kixleyNCo[1].attackPow - 3, kixleyNCo[1].attackPow + 3);
}
