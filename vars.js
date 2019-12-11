// menu.js
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
var loc;
var from;
var answer;

// places
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

// fighting
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

// items
var inventory = []; // 2D: [[InventoryItem, amount], [InventoryItem, amount]]
var pastInventory; // used for hud update
var catalog = [new InventoryItem("Health Potion", useHealthPotion, "item", 20, "Restores health."), 
               new InventoryItem("Wooden Sword", Function("this.equipped.finalDamage *= 1 + (0.05 * (3 - diffSetting))"), "weapon", 50, "Increases attack by a small amount."), 
               new InventoryItem("Simple Staff", Function("this.equipped.tempMagicSkillz *= 1 + (0.05 * (3 - diffSetting))"), "weapon", 50, "Increases magic by a small amount."), 
               new InventoryItem("Speed Boots", Function("this.equipped.accuracy += 5 * (3 - diffSetting)"), "boots", 100, "Increases accuracy."), 
               new InventoryItem("Arrows", Shoot, "item", 5, "Used with the Archer class.")];
var hpEff = 10 + (10 * (3 - diffSetting)); // how much HP health potions restore

// classes
var diffSetting = 0; // difficulty: Easy = 0.5, Normal = 1.0, Hard = 1.5, Epic = 2.0, Legend = 2.5
var chosenClass;




// unsorted
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
var timeGTOne = 0; // whether you get 6 or 7 BoD when Mithrómen sells you BoD
var temp;
var levelReq = 300; // exp required until level up
var levelUpHealth = 50;
var totalExtraHealth = 0;
var levelUpBlobsOfDoom = 50;
var x; // rng
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
