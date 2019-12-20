import { numMons, dropMult, kixleyNCo, monsInitialize } from './fight.js';
import { writeTextWait, randomNumber, writeText, requestInput } from './utility.js';
import { addKillCount, addCumulativeGold, CheckIfGotAchieve } from './menu.js';
import { playMusic } from './music.js';

export { WonTheFight, totalGold, loc, toMountains };

var inSwamp;
var toMountains;
var plainsCounter = 0;
var swampDiscovery = false;
var mountainPass = false;
var swampCounter = 0;
var fightingGroup = false;
var fightingAAbea = false;
var fightingBalbeag = false;
var totalGold = 0; // gold you have
var totalExp = 0; // exp you have
var expLeft; // exp until level up
var questKillAmt = 0; // amount of monsters you've killed for the quest
var questKillReq; // amount of monsters to kill
var reqItem;
var questGoldReq; // amount of gold you need to give galkemen
var questExpAmt = 0; // amount of exp you've gotten for the quest
var questExpReq; // amount of exp you need to get
var onAQuest = 0; // are you on a quest?
var y; // what type of quest
var levelReq = 300; // exp required until level up
var levelUpHealth = 50;
var totalExtraHealth = 0;
var levelUpBlobsOfDoom = 50;
var loc;

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

function Places() {
  playMusic("Marketplace");
  writeText("Where do you go now?");
  loc = 1;
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
          writeText('You walk into town, where there is a marketplace and an inn.');
          InTown();
        } else {
          writeText('As you near the outskirts of town, you notice the stream of people leaving town. Then you notice that the entire place is now just a gigantic blast crater. Somebody blew it up!!! You decide to investigate, and walk over to the stream of people.');
          writeText('When you reach the people, they all say this person named Tivél had just come to town and started fires all over, and then used some weird, magical powers to blow up Smatino.');
          writeText('You are sure this Tivél is the same as the one who you met in the swamp, and wish you had used some \'weird, magical powers\' to blow him up.');
          writeTextWait('You race back to the swamp, and see him from a distance. You can\'t, however, blow him up. There are too many vines in the way. So, you follow him. You see a large tower in the distance, and finally, after a few hours, reach it at night. You see Tivél enter, and then, as the gate is clanging down above him, you slide under it and manage to get in.', inTower);
        }
        break;
      case 'Plains':
        if (plainsCounter === 7) {
          writeText('As you are walking through the plains you see a map lying on the ground. It shows a path leading to a nearby swamp.');
          swampDiscovery = true;
        }
        monsInitialize("plains");
        break;
      case 'Swamp':
        if (swampCounter === 7 && killCounter >= 14) {
          writeText('As you are walking through the swamp, you meet someone. He says his name is Tivél, and he is heading towards Smatino, but doesn\'t tell why.');
          aabeaDestroysTown = true;
        }
        inSwamp = true;
        monsInitialize("swamp");
        break;
      case 'Mountains':
        toMountains = true
        if(percentChance(50)) {
          monsInitialize("plains");
        } else {
          Mountains();
        }
        break;
      case 'Menu':
        Menu();
        break;
    }
  }
}

function Mountains() {
  writeText('You make it through the plains and head off into the mountains.');
  loc = 3;
  monsInitialize("mountains");
}

function InTown() {
  loc = 2;
  writeText("Where to?");
  requestInput(["Market", "Inn", "Leave", "Menu"], determineAnswer);
  function determineAnswer() {
    switch (answer) {
      case 'Market':
        InShop();
        break;
      case 'Inn':
        InInn();
        break;
      case 'Leave':
        writeText('You leave town.');
        Places();
        break;
      case 'Menu':
        Menu();
        break;
    }
  }
}

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

function WonTheFight() {
  if (inSwamp) {
    inSwamp = false;
    swampCounter++;
    writeTextWait('As the monster dies, you get teleported out of the swamp.', goldAndEXP);
  } else if (fightingGroup) {
    fightingGroup = false;
    writeTextWait('Balbeag\'s soldiers are defeated!', inTowerPostDoomedGroup);
  } else if (fightingAAbea) {
    fightingAAbea = false;
    writeTextWait('Tivél is defeated!', finalBossFight);
  } else if (fightingBalbeag) {
    fightingBalbeag = false;
    Credits(beatTheGame);
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
    var goldDrops = 0;
    var expPoints = 0;
    for(var i = 0; i < numMons; i++) { // better because more accurate probability distribution
      goldDrops += randomNumber(25, 75) * dropMult;
      expPoints += randomNumber(50, 150);
    }
    addKillCount(numMons);
    if (kixleyNCo[1].rageEffect !== 1) {
      writeText('You calm down from your rage.');
      kixleyNCo[1].rageEffect = 1;
    }
    writeText('You got ' + goldDrops + ' gold and ' + expPoints + ' experience!');
    totalGold += goldDrops;
    addCumulativeGold(goldDrops);
    totalExp += expPoints;
    questExpAmt += expPoints;
    CheckIfGotAchieve('Gold');
    if (onAQuest === 1 && y === 1) {
      questKillAmt += numMons;
    }
    if (totalExp >= levelReq) {
      CheckIfGotAchieve('Kill');
      checkForLevelUp();
    } else {
      expLeft = levelReq - totalExp;
      writeText('You have ' + expLeft + ' experience before you level up!');
      CheckIfGotAchieve('Kill');
      Places();
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
    var temp = Math.floor(1.2 * kixleyNCo[1].lev) - 1
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
