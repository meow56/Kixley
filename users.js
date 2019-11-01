//import;

export { initalizeUsers, MakeNewAccount, login };


window.onerror = function(message, source, lineno, colno, error) {
  if(error.message === "Thanks for playing!") {
    writeText(error.message);
  } else if(error.message === "Cannot read property 'toUpperCase' of null" || error.message === "Cannot read property 'toLowerCase' of null"){
    alert("You just pressed the \"Cancel\" button. That causes the game to end.");
  } else {
    alert("Kixley-Users has run into an unexpected error.");
    alert("To help in debugging, Kixley-Users has this to say:");
    alert(message);
    alert("Error found on line " + lineno);
    alert("Error found on column " + colno);
  }
}



var userCheck;
var username;
var useDefaults = false; // whether to use both defaults
var signedIn;
var defaultDifficulty; // normal difficulty you set in your account
var defaultClass; // normal class you set in your account
var settingDefault = false;
var useDefaultClass = false; // whether to use your default class
var useDefaultDiff = false; // whether to use your default difficulty



function initializeUsers() {
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

function parseBool(stringBool) {
  if (stringBool === 'true') {
    return true
  } else if (stringBool === 'false') {
    return false
  } else {
    return stringBool
  }
}
