import * from './vars.js';
import { Shoot } from './classes.js';

export { displayInventory, changeCatalogPrice, changeHealthPotionEff };

function changeCatalogPrice(multFactor) {
  for(var i = 0; i < catalog.length; i++) {
    catalog[i].price *= multFactor; 
  }
}

function changeHealthPotionEff(addFact) {
  hpEff = 10 + addFact; 
}

function FakeFighter(name) {
  this.called = name;
}


function InventoryItem(name, effect, type, cost, description) {
  this.name = name; // string
  this.effect = effect; // function eg Function("this.finalDamage * 1.05")
  this.type = type; // string eg "weapon", "boots", "helmet", etc
  this.cost = cost;
  if(this.type !== "item") {
    this.equipped = new FakeFighter("unequip");
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








function useHealthPotion() {
  writeText('You pull a health potion out of your bag and drink it! Yum! It tastes like snickerdoodle cookies!')
  writeText(hpEff + ' hit points restored!')
  kixleyNCo[1].hitPoints += hpEff;
  for(var i = 0; i < inventory.length; i++) {
    if(inventory[i][0].name === "Health Potion") {
      inventory[i][1]--;
    }
  }
  if (kixleyNCo[1].hitPoints > kixleyNCo[1].totalHP) {
    kixleyNCo[1].hitPoints = kixleyNCo[1].totalHP
  }
}

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
          inventory[i][0].equipped = new FakeFighter("unequip"); // unequip, item side
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
                  kixleyNCo[j].equipped[index].equipped = new FakeFighter("unequip"); // unequip, inventory side
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
