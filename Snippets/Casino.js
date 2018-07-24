//This will be available from the Rowdy Barstead.

function Casino() {
  function Card(value, suit) {
    this.value = value;
    this.suit = suit;
  }

  function Deck(cards) {
    this.cards = cards;

    this.shuffle = function() {
      // From the internet https://www.frankmitchell.org/2015/01/fisher-yates/
      var i = 0,
        j = 0,
        temp = null;

      for (i = this.cards.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this.cards[i];
        this.cards[i] = this.cards[j];
        this.cards[j] = temp;
      }
    }

    this.deal = function(numPlayers) {
      var temp = Math.floor(this.cards.length / numPlayers);
      var temp2 = [];
      for (var i = 0; i < numPlayers; i++) {
        temp2.push(new Deck(this.cards.slice(i * temp, (i + 1) * temp)));
      }
      if (this.cards.length / numPlayers !== temp) {
        temp2.push(new Deck(this.cards.slice((numPlayers - 1) * temp)));
      }
      return temp2;
    }

    this.find = function(cardVal, cardSuit) {
      var invert = (cardSuit.indexOf("!") !== -1);
      var multipleInput = (cardSuit.indexOf("&") !== -1);

      if (cardSuit === "*") {
        for (var i = 0; i < this.cards.length; i++) {
          if (this.cards[i].value === cardVal) {
            return i;
          }
        }
        return -1;
      } else {
        for (var i = 0; i < this.cards.length; i++) {
          if (this.cards[i].value === cardVal) {
            if (multipleInput) {
              var suitsWanted = cardSuit.split("&");
              var allSuits = ["Hearts", "Clubs", "Diamonds", "Spades"];
              if (invert) {
                for (var j = 0; j < suitsWanted.length; j++) {
                  if (suitsWanted[j].indexOf("!") !== -1) {
                    suitsWanted[j] = suitsWanted[j].split("!");
                    suitsWanted[j] = suitsWanted[j].join("");
                  }
                  allSuits.splice(allSuits.indexOf(suitsWanted[j]), 1);
                }
              } else {
                allSuits = suitsWanted;
              }
              for (var j = 0; j < allSuits.length; j++) {
                if (this.cards[i].suit === allSuits[j]) {
                  return i;
                }
              }
            } else {
              var allSuits = ["Hearts", "Clubs", "Diamonds", "Spades"];
              if (invert) {
                cardSuit = cardSuit.split("!");
                cardSuit = cardSuit.join("");
                allSuits.splice(allSuits.indexOf(cardSuit), 1);
              } else {
                allSuits = [cardSuit];
              }
              for (var j = 0; j < allSuits.length; j++) {
                if (this.cards[i].suit === allSuits[j]) {
                  return i;
                }
              }
            } // if multipleInput
          } // if val
        } // for cards
        return -1;
      }
    }

    this.sort = function() {
      var temp = this.cards.slice();
      var sorted = [];
      var pastTemp;
      var temp2 = true;
      while (temp2) {
        pastTemp = temp.slice();

        var temp3 = -1;
        var valBeat = 0;
        var suitBeat;

        for (var i = 0; i < temp.length; i++) {
          if (temp[i].value > valBeat) {
            valBeat = temp[i].value;
            var temp4 = temp[i].suit;
            /*
	  	We don't really need to include suit in sorting, Scumbags is the only game that actually needs sorting and
		suit doesn't matter in Scumbags, number is the only thing we have to sort for. Unless, of course, we add
		another game like hearts where suit matters.
	  */
		  // well, i figure i might as well keep things consistent, especially for viewing.
            switch (temp4) {
              case "Hearts":
                temp4 = 3;
                break;
              case "Clubs":
                temp4 = 2;
                break;
              case "Diamonds":
                temp4 = 1;
                break;
              case "Spades":
                temp4 = 0;
                break;
            }
            suitBeat = temp4;
            temp3 = i;
          } else if (temp[i].value === valBeat) { // hearts, clubs, diamonds, spades
            var temp4 = temp[i].suit;
            switch (temp4) {
              case "Hearts":
                temp4 = 3;
                break;
              case "Clubs":
                temp4 = 2;
                break;
              case "Diamonds":
                temp4 = 1;
                break;
              case "Spades":
                temp4 = 0;
                break;
            }
            if (temp4 > suitBeat) {
              valBeat = temp[i].value;
              suitBeat = temp4;
              temp3 = i;
            }
          }
        }

        var temp5 = temp.splice(temp3, 1);
        sorted.push(temp5[0]);
        temp2 = false;
        for (var i = 0; i < temp.length; i++) {
          if (pastTemp.length !== temp.length) {
            temp2 = true;
          } else {
            if (pastTemp[i] !== temp[i]) {
              temp2 = true;
            }
          }
        }
      }
      this.cards = sorted;
    }

    this.sortScumbags = function() {
      var temp = this.cards.slice();
      for (var i = 0; i < temp.length; i++) {
        if (temp[i].value === 1) {
          temp[i].value = 14;
        }
        if (temp[i].value === 2) {
          temp[i].value = 15;
        }
      }
      var sorted = [];
      var pastTemp;
      var temp2 = true;
      while (temp2) {
        pastTemp = temp.slice();

        var temp3 = -1;
        var valBeat = 0;
        var suitBeat;

        for (var i = 0; i < temp.length; i++) {
          if (temp[i].value > valBeat) {
            valBeat = temp[i].value;
            var temp4 = temp[i].suit;
            switch (temp4) {
              case "Hearts":
                temp4 = 3;
                break;
              case "Clubs":
                temp4 = 2;
                break;
              case "Diamonds":
                temp4 = 1;
                break;
              case "Spades":
                temp4 = 0;
                break;
            }
            suitBeat = temp4;
            temp3 = i;
          } else if (temp[i].value === valBeat) { // hearts, clubs, diamonds, spades
            var temp4 = temp[i].suit;
            switch (temp4) {
              case "Hearts":
                temp4 = 3;
                break;
              case "Clubs":
                temp4 = 2;
                break;
              case "Diamonds":
                temp4 = 1;
                break;
              case "Spades":
                temp4 = 0;
                break;
            }
            if (temp4 > suitBeat) {
              valBeat = temp[i].value;
              suitBeat = temp4;
              temp3 = i;
            }
          }
        }

        var temp5 = temp.splice(temp3, 1);
        sorted.push(temp5[0]);
        temp2 = false;
        for (var i = 0; i < temp.length; i++) {
          if (pastTemp.length !== temp.length) {
            temp2 = true;
          } else {
            if (pastTemp[i] !== temp[i]) {
              temp2 = true;
            }
          }
        }
      }
      for (var i = 0; i < sorted.length; i++) {
        if (sorted[i].value === 14) {
          sorted[i].value = 1;
        }
        if (sorted[i].value === 15) {
          sorted[i].value = 2;
        }
      }
      this.cards = sorted;
    }
  }

  function Game(type, previousPlacement, points) {
    this.type = type;
    this.prePla = previousPlacement;
    this.points = points;
    this.hands;
    this.trick = 0;
    this.currentTurn = 0;
    this.lastActions = ["none", "none", "none", "none"];
    this.cardsToBeat = [];
    this.typeToBeat = "none";
    this.placement = [0, 0, 0, 0];
    this.nextPlace = 1;

    switch (this.type) {
      case "Scumbags":
        if (this.prePla !== [0, 0, 0, 0]) {
          for (var i = 0; i < this.prePla.length; i++) {
            if (this.prePla[i] === 1) {
              var id1 = i;
            } else if (this.prePla[i] === 2) {
              var id2 = i;
            } else if (this.prePla[i] === 3) {
              var id3 = i;
            } else if (this.prePla[i] === 4) {
              var id4 = i;
            }
          }

          this.points[id1] += 2;
          this.points[id2] += 1;
          this.points[id3] -= 1;
          this.points[id4] -= 2;

          this.exchangeCards(2, id1, id4);
          this.exchangeCards(1, id2, id3);
        }
        if (this.trick === 0) {
          for (var i = 0; i < this.hands.length; i++) {
            if (this.hands[i].find(3, "Clubs") !== -1) {
              this.currentTurn = i;
            }
          }
        }
        scumbagsLoop();
        break;
    }

    this.exchangeCards = function(howMany, better, worse) {
      if (better === 0) { // if you get the better cards
        this.hands[better].sortScumbags();
        this.hands[worse].sortScumbags();
        for(var i = 0; i < howMany; i++) {
          chooseCardsAsk(worse);
        }
      } else { // the computer is in control of what cards to give/take
        this.hands[better].sortScumbags();
        this.hands[worse].sortScumbags();
        var temp = this.hands[worse].cards.splice(0, howMany);
        var temp2 = this.hands[better].cards.splice(-howMany, howMany);
        for (var i = 0; i < temp.length; i++) {
          this.hands[worse].cards.push(temp2[i]);
          this.hands[better].cards.push(temp[i]);
        }
      }
    }
  }

  function chooseCardsAsk(worse) {
    writeText("What card would you like to ask for?");
    writeText("Your hand:");
    for(var i = 0; i < game.hands[0].cards.length; i++) {
      var temp = "";
      switch(game.hands[0].cards[i].value) {
        case 11:
          temp += "Jack";
          break;
        case 12:
          temp += "Queen";
          break;
        case 13:
          temp += "King";
          break;
        case 1:
          temp += "Ace";
          break;
        default:
          temp += game.hands[0].cards[i].value;
      }
      temp += " of ";
      temp += game.hands[0].cards[i].suit;
      writeText(temp);
    }
    requestInput([3, "3 of Clubs", 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace", 2], determineAnswer);
    function determineAnswer() {
      switch(answer) {
        case "Jack":
          answer = 11;
          break;
        case "Queen":
          answer = 12;
          break;
        case "King":
          answer = 13;
          break;
        case "Ace":
          answer = 1;
          break;
        case "3 of Clubs":
          break;
        default:
          answer = +answer;
          break;
      }
      if(answer === "3 of Clubs") {
        var temp = game.hands[worse].find(3, "Clubs");
        if(temp === -1) {
          writeText("The man says, \"Sorry, I don't have that.\"");
          chooseCardsAsk(worse);
        } else {
          
        }
      }
    }
  }
  
  function scumbagsLoop() {
    var temp2 = 0;
    for (var i = 0; i < 4; i++) {
      if (game.placement[i] === 0) {
        temp2++;
      }
    }
    if (temp2 <= 1) {
      for (var i = 0; i < 4; i++) {
        if (game.placement[i] === 0) {
          game.placement[i] = 4;
        }
      }
      var temp = game.placement;
      var temp3 = game.points;
      game = new Game("Scumbags", temp, temp3);
    } else {
      var temp = true;
      for (var i = 0; i < 4; i++) {
        if (i !== game.currentTurn && game.lastActions[i] !== "pass") {
          temp = false; // someone has not passed
        }
      }
      if (temp) { // end of trick
        game.currentTurn = (game.currentTurn + 1) % 4;
        game.cardsToBeat = [];
        game.typeToBeat = "none";
        game.lastActions = ["none", "none", "none", "none"];
        game.trick++;
        scumbagsLoop();
      } else { // keep playing
        playTurn(game.hands[game.currentTurn], function() {
          if (game.hands[game.currentTurn].cards.length === 0 && game.placement[game.currentTurn] === 0) {
            game.placement[game.currentTurn] = game.nextPlace++;
          }
          game.currentTurn = (game.currentTurn + 1) % 4;
          scumbagsLoop();
        }); // play cards
      }
    }
  }

  function playTurn(hand, whenDone) {
    if (hand.length !== 0) {
      if (hand === game.hands[0]) { // that's you!
        displayOptions(hand, whenDone);
      } else { // that's not you!
        scumbagAI(hand, whenDone);
      }
    } else {
      game.lastActions[game.currentTurn] = "pass";
      whenDone();
    }
  }

  function scumbagAI(hand, whenDone) {
    hand.sortScumbags();
    for (var i = 0; i < hand.length; i++) {
      if (hand[i].value === 1) {
        hand[i].value = 14;
      }
      if (hand[i].value === 2) {
        hand[i].value = 15;
      }
    }
    if (game.cardsToBeat[0].value > hand.cards[0].value) { // is the highest card on the table higher than your highest card?
      game.lastActions[game.currentTurn] = "pass";
      whenDone();
    } else {
      if (game.typeToBeat === "single") { // if single, play lowest card that is higher than the played one
        var temp;
        var temp2 = true;
        if (hand.cards.length === 1) {
          temp = 0;
          temp2 = false;
        }
        for (var i = 0; i < hand.cards.length; i++) {
          if (hand.cards[i].value <= game.cardsToBeat[0].value && temp2) {
            temp = i - 1;
            temp2 = false;
          }
        }
        game.lastActions[game.currentTurn] = "play";
        for (var i = 0; i < hand.length; i++) {
          if (hand[i].value === 14) {
            hand[i].value = 1;
          }
          if (hand[i].value === 15) {
            hand[i].value = 2;
          }
        }
        game.cardsToBeat = [hand.cards[temp]];
        whenDone();
      } else if (game.typeToBeat === "double") {
        var temp = hand.cards.slice();

        function findDoubles(index) {
          if (temp[index + 1] !== undefined) {
            if (temp[index].value === temp[index + 1].value) {
              index++;
              findDoubles(index);
            } else {
              temp.splice(index, 1);
              findDoubles(index);
            }
          } else {
            temp.splice(index, 1);
          }
        }
        findDoubles(0);
        if (temp.length === 0) { // if the player has no doubles, pass
          game.lastActions[game.currentTurn] = "pass";
          whenDone();
        } else {
          var temp2;
          var temp3 = true;
          if (temp.length === 1) {
            temp2 = 0;
            temp3 = false;
          }
          for (var i = 0; i < temp.length; i++) {
            if (temp[i].value <= game.cardsToBeat[0].value && temp3) { // choose the lowest double that beats
              temp2 = i - 1;
              temp3 = false;
            }
          }
          if (temp3) {
            game.lastActions[game.currentTurn] = "pass";
            whenDone();
          } else {
            var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first double card
            var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the other double card
            game.lastActions[game.currentTurn] = "play";
            for (var i = 0; i < hand.length; i++) {
              if (hand[i].value === 14) {
                hand[i].value = 1;
              }
              if (hand[i].value === 15) {
                hand[i].value = 2;
              }
            }
            game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5]];
            whenDone();
          }
        }
      } else if (game.typeToBeat === "triple") {
        var temp = hand.cards.slice(); // list of triples
        function findTriples(index) {
          if (temp[index + 2] !== undefined) {
            if (temp[index].value === temp[index + 1].value && temp[index + 1].value === temp[index + 2].value) {
              index++;
              findTriples(index);
            } else {
              temp.splice(index, 1);
              findTriples(index);
            }
          } else {
            temp.splice(index, 2);
          }
        }
        findTriples(0);
        if (temp.length === 0) { // if the player has no triples, pass
          game.lastActions[game.currentTurn] = "pass";
          whenDone();
        } else {
          var temp2;
          var temp3 = true;
          if (temp.length === 1) {
            temp2 = 0;
            temp3 = false;
          }
          for (var i = 0; i < temp.length; i++) {
            if (temp[i].value <= game.cardsToBeat[0].value && temp3) { // choose the lowest triple that beats
              temp2 = i - 1;
              temp3 = false;
            }
          }
          if (temp3) {
            game.lastActions[game.currentTurn] = "pass";
            whenDone();
          } else {
            var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first triple card
            var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the second triple card
            var temp6 = hand.find(temp[temp2].value, "!" + temp[temp2].suit + "&" + hand[temp5].suit); // find the final triple card
            game.lastActions[game.currentTurn] = "play";
            for (var i = 0; i < hand.length; i++) {
              if (hand[i].value === 14) {
                hand[i].value = 1;
              }
              if (hand[i].value === 15) {
                hand[i].value = 2;
              }
            }
            game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6]];
            whenDone();
          }
        }
      } else if (game.typeToBeat === "quadruple") {
        var temp = hand.cards.slice(); // list of quadruples
        function findQuadruples(index) {
          if (temp[index + 3] !== undefined) {
            if (temp[index].value === temp[index + 1].value && temp[index + 1].value === temp[index + 2].value && temp[index + 2].value === temp[index + 3].value) {
              index++;
              findQuadruples(index);
            } else {
              temp.splice(index, 1);
              findQuadruples(index);
            }
          } else {
            temp.splice(index, 3);
          }
        }
        findQuadruples(0);
        if (temp.length === 0) { // if the player has no quadruples, pass
          game.lastActions[game.currentTurn] = "pass";
          whenDone();
        } else {
          var temp2;
          var temp3 = true;
          if (temp.length === 1) {
            temp2 = 0;
            temp3 = false;
          }
          for (var i = 0; i < temp.length; i++) {
            if (temp[i].value <= game.cardsToBeat[0].value && temp3) { // choose the lowest quadruple that beats
              temp2 = i - 1;
              temp3 = false;
            }
          }
          if (temp3) {
            game.lastActions[game.currentTurn] = "pass";
            whenDone();
          } else {
            var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first quadruple card
            var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the second quadruple card
            var temp6 = hand.find(temp[temp2].value, "!" + temp[temp2].suit + "&" + hand[temp5].suit); // find the third quadruple card
            var temp7 = hand.find(temp[temp2].value, "!" + temp[temp2].suit + "&" + hand[temp5].suit + "&" + hand[temp6].suit); // find the final quadruple card
            game.lastActions[game.currentTurn] = "play";
            for (var i = 0; i < hand.length; i++) {
              if (hand[i].value === 14) {
                hand[i].value = 1;
              }
              if (hand[i].value === 15) {
                hand[i].value = 2;
              }
            }
            game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7]];
            whenDone();
          }
        }
      } else if (game.typeToBeat === "ddoubles") {
        var temp = hand.cards.slice(); // list of double doubles (ie 44 55)
        function findDoublesElim(index) {
          if (temp[index + 1] !== undefined) {
            if (temp[index].value === temp[index + 1].value) {
              if (temp[index + 2] !== undefined) {
                if (temp[index + 3] !== undefined) {
                  if (temp[index + 2].value === temp[index + 3].value) {
                    temp.splice(index + 2, 1); // eliminate quads
                  }
                }
                if (temp[index + 1].value === temp[index + 2].value) {
                  temp.splice(index + 1, 1); //eliminate triples
                }
              }
              index++;
              findDoublesElim(index);
            } else {
              temp.splice(index, 1);
              findDoublesElim(index);
            }
          } else {
            temp.splice(index, 1);
          }
        }
        findDoublesElim(0);

        function findTwoSequence(index) {
          if (temp[index + 1] !== undefined) {
            if (temp[index].value - 1 === temp[index + 1].value) {
              index++;
              findTwoSequence(index);
            } else {
              temp.splice(index, 1);
              findTwoSequence(index);
            }
          } else {
            temp.splice(index, 1);
          }
        }
        findTwoSequence(0);
        if (temp.length === 0) {
          game.lastActions[game.currentTurn] = "pass";
          whenDone();
        } else {
          var temp2;
          var temp3 = true;
          if (temp.length === 1) {
            temp2 = 0;
            temp3 = false;
          }
          for (var i = 0; i < temp.length; i++) {
            if (temp[i].value <= game.cardsToBeat[0].value && temp3) { // choose the lowest ddoubles that beats
              temp2 = i - 1;
              temp3 = false;
            }
          }
          if (temp3) {
            game.lastActions[game.currentTurn] = "pass";
            whenDone();
          } else {
            var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first double, first card
            var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the first double, second card
            var temp6 = hand.find(temp[temp2].value - 1, "*"); // find the second double, first card
            var temp7 = hand.find(temp[temp2].value - 1, "!" + hand[temp6].suit); // find the second double, second card
            game.lastActions[game.currentTurn] = "play";
            for (var i = 0; i < hand.length; i++) {
              if (hand[i].value === 14) {
                hand[i].value = 1;
              }
              if (hand[i].value === 15) {
                hand[i].value = 2;
              }
            }
            game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7]];
            whenDone();
          }
        }
      } else if (game.typeToBeat === "tdoubles") {
        var temp = hand.cards.slice(); // list of triple doubles (ie 44 55 66)
        function findDoublesElim(index) {
          if (temp[index + 1] !== undefined) {
            if (temp[index].value === temp[index + 1].value) {
              if (temp[index + 2] !== undefined) {
                if (temp[index + 3] !== undefined) {
                  if (temp[index + 2].value === temp[index + 3].value) {
                    temp.splice(index + 2, 1); // eliminate quads
                  }
                }
                if (temp[index + 1].value === temp[index + 2].value) {
                  temp.splice(index + 1, 1); // eliminate triples
                }
              }
              index++;
              findDoublesElim(index);
            } else {
              temp.splice(index, 1);
              findDoublesElim(index);
            }
          } else {
            temp.splice(index, 1);
          }
        }
        findDoublesElim(0);

        function findThreeSequence(index) {
          if (temp[index + 2] !== undefined) {
            if (temp[index].value - 1 === temp[index + 1].value && temp[index + 1].value - 1 === temp[index + 2].value) {
              index++;
              findThreeSequence(index);
            } else {
              temp.splice(index, 1);
              findThreeSequence(index);
            }
          } else {
            temp.splice(index, 2);
          }
        }
        findThreeSequence(0);
        if (temp.length === 0) {
          game.lastActions[game.currentTurn] = "pass";
          whenDone();
        } else {
          var temp2;
          var temp3 = true;
          if (temp.length === 1) {
            temp2 = 0;
            temp3 = false;
          }
          for (var i = 0; i < temp.length; i++) {
            if (temp[i].value <= game.cardsToBeat[0].value && temp3) { // choose the lowest tdoubles that beats
              temp2 = i - 1;
              temp3 = false;
            }
          }
          if (temp3) {
            game.lastActions[game.currentTurn] = "pass";
            whenDone();
          } else {
            var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first double, first card
            var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the first double, second card
            var temp6 = hand.find(temp[temp2].value - 1, "*"); // find the second double, first card
            var temp7 = hand.find(temp[temp2].value - 1, "!" + hand[temp6].suit); // find the second double, second card
            var temp8 = hand.find(temp[temp2].value - 2, "*"); // find the third double, first card
            var temp9 = hand.find(temp[temp2].value - 2, "!" + hand[temp8].suit); // find the third double, second card
            game.lastActions[game.currentTurn] = "play";
            for (var i = 0; i < hand.length; i++) {
              if (hand[i].value === 14) {
                hand[i].value = 1;
              }
              if (hand[i].value === 15) {
                hand[i].value = 2;
              }
            }
            game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7], hand.cards[temp8], hand.cards[temp9]];
            whenDone();
          }
        }
      } else if (game.typeToBeat === "qdoubles") {
        var temp = hand.cards.slice(); // list of quadruple doubles (ie 44 55 66 77)
        function findDoublesElim(index) {
          if (temp[index + 1] !== undefined) {
            if (temp[index].value === temp[index + 1].value) {
              if (temp[index + 2] !== undefined) {
                if (temp[index + 3] !== undefined) {
                  if (temp[index + 2].value === temp[index + 3].value) {
                    temp.splice(index + 2, 1); // eliminate quads
                  }
                }
                if (temp[index + 1].value === temp[index + 2].value) {
                  temp.splice(index + 1, 1); //eliminate triples
                }
              }
              index++;
              findDoublesElim(index);
            } else {
              temp.splice(index, 1);
              findDoublesElim(index);
            }
          } else {
            temp.splice(index, 1);
          }
        }
        findDoublesElim(0);

        function findFourSequence(index) {
          if (temp[index + 3] !== undefined) {
            if (temp[index].value - 1 === temp[index + 1].value && temp[index + 1].value - 1 === temp[index + 2].value && temp[index + 2].value - 1 === temp[index + 3].value) {
              index++;
              findFourSequence(index);
            } else {
              temp.splice(index, 1);
              findFourSequence(index);
            }
          } else {
            temp.splice(index, 3);
          }
        }
        findFourSequence(0);
        if (temp.length === 0) {
          game.lastActions[game.currentTurn] = "pass";
          whenDone();
        } else {
          var temp2;
          var temp3 = true;
          if (temp.length === 1) {
            temp2 = 0;
            temp3 = false;
          }
          for (var i = 0; i < temp.length; i++) {
            if (temp[i].value <= game.cardsToBeat[0].value && temp3) { // choose the lowest qdoubles that beats
              temp2 = i - 1;
              temp3 = false;
            }
          }
          if (temp3) {
            game.lastActions[game.currentTurn] = "pass";
            whenDone();
          } else {
            var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first double, first card
            var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the first double, second card
            var temp6 = hand.find(temp[temp2].value - 1, "*"); // find the second double, first card
            var temp7 = hand.find(temp[temp2].value - 1, "!" + hand[temp6].suit); // find the second double, second card
            var temp8 = hand.find(temp[temp2].value - 2, "*"); // find the third double, first card
            var temp9 = hand.find(temp[temp2].value - 2, "!" + hand[temp8].suit); // find the third double, second card
            var temp10 = hand.find(temp[temp2].value - 3, "*"); // find the fourth double, first card
            var temp11 = hand.find(temp[temp2].value - 3, "!" + hand[temp10].suit); // find the fourth double, second card
            game.lastActions[game.currentTurn] = "play";
            for (var i = 0; i < hand.length; i++) {
              if (hand[i].value === 14) {
                hand[i].value = 1;
              }
              if (hand[i].value === 15) {
                hand[i].value = 2;
              }
            }
            game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7], hand.cards[temp8], hand.cards[temp9], hand.cards[temp10], hand.cards[temp11]];
            whenDone();
          }
        }
      } else if (game.typeToBeat === "pdoubles") { // too lazy to write "quidoubles" so p (pent) works fine
        var temp = hand.cards.slice(); // list of quintuple doubles (ie 44 55 66 77 88)
        function findDoublesElim(index) {
          if (temp[index + 1] !== undefined) {
            if (temp[index].value === temp[index + 1].value) {
              if (temp[index + 2] !== undefined) {
                if (temp[index + 3] !== undefined) {
                  if (temp[index + 2].value === temp[index + 3].value) {
                    temp.splice(index + 2, 1); // eliminate quads
                  }
                }
                if (temp[index + 1].value === temp[index + 2].value) {
                  temp.splice(index + 1, 1); //eliminate triples
                }
              }
              index++;
              findDoublesElim(index);
            } else {
              temp.splice(index, 1);
              findDoublesElim(index);
            }
          } else {
            temp.splice(index, 1);
          }
        }
        findDoublesElim(0);

        function findFiveSequence(index) {
          if (temp[index + 4] !== undefined) {
            if (temp[index].value - 1 === temp[index + 1].value && temp[index + 1].value - 1 === temp[index + 2].value && temp[index + 2].value - 1 === temp[index + 3].value && temp[index + 3].value - 1 === temp[index + 4].value) {
              index++;
              findFiveSequence(index);
            } else {
              temp.splice(index, 1);
              findFiveSequence(index);
            }
          } else {
            temp.splice(index, 4);
          }
        }
        findFiveSequence(0);
        if (temp.length === 0) {
          game.lastActions[game.currentTurn] = "pass";
          whenDone();
        } else {
          var temp2;
          var temp3 = true;
          if (temp.length === 1) {
            temp2 = 0;
            temp3 = false;
          }
          for (var i = 0; i < temp.length; i++) {
            if (temp[i].value <= game.cardsToBeat[0].value && temp3) { // choose the lowest pdoubles that beats
              temp2 = i - 1;
              temp3 = false;
            }
          }
          if (temp3) {
            game.lastActions[game.currentTurn] = "pass";
            whenDone();
          } else {
            var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first double, first card
            var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the first double, second card
            var temp6 = hand.find(temp[temp2].value - 1, "*"); // find the second double, first card
            var temp7 = hand.find(temp[temp2].value - 1, "!" + hand[temp6].suit); // find the second double, second card
            var temp8 = hand.find(temp[temp2].value - 2, "*"); // find the third double, first card
            var temp9 = hand.find(temp[temp2].value - 2, "!" + hand[temp8].suit); // find the third double, second card
            var temp10 = hand.find(temp[temp2].value - 3, "*"); // find the fourth double, first card
            var temp11 = hand.find(temp[temp2].value - 3, "!" + hand[temp10].suit); // find the fourth double, second card
            var temp12 = hand.find(temp[temp2].value - 4, "*"); // find the fifth double, first card
            var temp13 = hand.find(temp[temp2].value - 4, "!" + hand[temp12].suit); // find the fifth double, second card
            game.lastActions[game.currentTurn] = "play";
            for (var i = 0; i < hand.length; i++) {
              if (hand[i].value === 14) {
                hand[i].value = 1;
              }
              if (hand[i].value === 15) {
                hand[i].value = 2;
              }
            }
            game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7], hand.cards[temp8], hand.cards[temp9], hand.cards[temp10], hand.cards[temp11], hand.cards[temp12], hand.cards[temp13]];
            whenDone();
          }
        }
      } else if (game.typeToBeat === "sdoubles") {
        var temp = hand.cards.slice(); // list of sextuple doubles (ie 44 55 66 77 88 99)
        function findDoublesElim(index) {
          if (temp[index + 1] !== undefined) {
            if (temp[index].value === temp[index + 1].value) {
              if (temp[index + 2] !== undefined) {
                if (temp[index + 3] !== undefined) {
                  if (temp[index + 2].value === temp[index + 3].value) {
                    temp.splice(index + 2, 1); // eliminate quads
                  }
                }
                if (temp[index + 1].value === temp[index + 2].value) {
                  temp.splice(index + 1, 1); //eliminate triples
                }
              }
              index++;
              findDoublesElim(index);
            } else {
              temp.splice(index, 1);
              findDoublesElim(index);
            }
          } else {
            temp.splice(index, 1);
          }
        }
        findDoublesElim(0);

        function findSixSequence(index) {
          if (temp[index + 5] !== undefined) {
            if (temp[index].value - 1 === temp[index + 1].value && temp[index + 1].value - 1 === temp[index + 2].value && temp[index + 2].value - 1 === temp[index + 3].value && temp[index + 3].value - 1 === temp[index + 4].value && temp[index + 4].value - 1 === temp[index + 5].value) {
              index++;
              findSixSequence(index);
            } else {
              temp.splice(index, 1);
              findSixSequence(index);
            }
          } else {
            temp.splice(index, 5);
          }
        }
        findSixSequence(0);
        if (temp.length === 0) {
          game.lastActions[game.currentTurn] = "pass";
          whenDone();
        } else {
          var temp2;
          var temp3 = true;
          if (temp.length === 1) {
            temp2 = 0;
            temp3 = false;
          }
          for (var i = 0; i < temp.length; i++) {
            if (temp[i].value <= game.cardsToBeat[0].value && temp3) { // choose the lowest sdoubles that beats
              temp2 = i - 1;
              temp3 = false;
            }
          }
          if (temp3) {
            game.lastActions[game.currentTurn] = "pass";
            whenDone();
          } else {
            var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first double, first card
            var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the first double, second card
            var temp6 = hand.find(temp[temp2].value - 1, "*"); // find the second double, first card
            var temp7 = hand.find(temp[temp2].value - 1, "!" + hand[temp6].suit); // find the second double, second card
            var temp8 = hand.find(temp[temp2].value - 2, "*"); // find the third double, first card
            var temp9 = hand.find(temp[temp2].value - 2, "!" + hand[temp8].suit); // find the third double, second card
            var temp10 = hand.find(temp[temp2].value - 3, "*"); // find the fourth double, first card
            var temp11 = hand.find(temp[temp2].value - 3, "!" + hand[temp10].suit); // find the fourth double, second card
            var temp12 = hand.find(temp[temp2].value - 4, "*"); // find the fifth double, first card
            var temp13 = hand.find(temp[temp2].value - 4, "!" + hand[temp12].suit); // find the fifth double, second card
            var temp14 = hand.find(temp[temp2].value - 5, "*"); // find the sixth double, first card
            var temp15 = hand.find(temp[temp2].value - 5, "!" + hand[temp14].suit); // find the sixth double, second card
            game.lastActions[game.currentTurn] = "play";
            for (var i = 0; i < hand.length; i++) {
              if (hand[i].value === 14) {
                hand[i].value = 1;
              }
              if (hand[i].value === 15) {
                hand[i].value = 2;
              }
            }
            game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7], hand.cards[temp8], hand.cards[temp9], hand.cards[temp10], hand.cards[temp11], hand.cards[temp12], hand.cards[temp13], hand.cards[temp14], hand.cards[temp15]];
            whenDone();
          }
        }
      } else if (game.typeToBeat === "qrun") {
        var temp = hand.cards.slice(); // list of quadruple runs (ie 4 5 6 7)
        function elimRepeats(index) {
          if (temp[index + 3] !== undefined) {
            if (temp[index + 2].value === temp[index + 3].value) {
              temp.splice(index, 4); // eliminate quads
              elimRepeats(index);
            }
          }
          if (temp[index + 2] !== undefined) {
            if (temp[index + 1].value === temp[index + 2].value) {
              temp.splice(index, 3); // eliminate triples
              elimRepeats(index);
            }
          }
          if (temp[index + 1] !== undefined) {
            if (temp[index].value === temp[index + 1].value) {
              temp.splice(index, 2); // eliminate doubles
              elimRepeats(index);
            }
            index++;
            elimRepeats(index);
          } else {
            if (temp[index] !== undefined && temp[index - 1] !== undefined) {
              if (temp[index - 1].value === temp[index].value) {
                temp.splice(index, 1);
              }
            }
          }
        }
        elimRepeats(0);

        function quadRun(index) {
          if (temp[index + 3] !== undefined) {
            if (temp[index].value - 1 === temp[index + 1].value && temp[index + 1].value - 1 === temp[index + 2].value && temp[index + 2].value - 1 === temp[index + 3].value) {
              index++;
              quadRun(index);
            } else {
              temp.splice(index, 1);
              quadRun(index);
            }
          } else {
            temp.splice(index, 3);
          }
        }
        quadRun(0);
        if (temp.length === 0) {
          game.lastActions[game.currentTurn] = "pass";
          whenDone();
        } else {
          var temp2;
          var temp3 = true;
          if (temp.length === 1) {
            temp2 = 0;
            temp3 = false;
          }
          for (var i = 0; i < temp.length; i++) {
            if (temp[i].value <= game.cardsToBeat[0].value && temp3) { // choose the lowest qrun that beats
              temp2 = i - 1;
              temp3 = false;
            }
          }
          if (temp3) {
            game.lastActions[game.currentTurn] = "pass";
            whenDone();
          } else {
            var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first card
            var temp5 = hand.find(temp[temp2].value - 1, "*"); // find the second card
            var temp6 = hand.find(temp[temp2].value - 2, "*"); // find the third card
            var temp7 = hand.find(temp[temp2].value - 3, "*"); // find the fourth card
            game.lastActions[game.currentTurn] = "play";
            for (var i = 0; i < hand.length; i++) {
              if (hand[i].value === 14) {
                hand[i].value = 1;
              }
              if (hand[i].value === 15) {
                hand[i].value = 2;
              }
            }
            game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7]];
            whenDone();
          }
        }
      } else if (game.typeToBeat === "orun") {
        var temp = hand.cards.slice(); // list of octuple runs (ie 4 5 6 7 8 9 10 J)
        function elimRepeats(index) {
          if (temp[index + 3] !== undefined) {
            if (temp[index + 2].value === temp[index + 3].value) {
              temp.splice(index, 4); // eliminate quads
              elimRepeats(index);
            }
          }
          if (temp[index + 2] !== undefined) {
            if (temp[index + 1].value === temp[index + 2].value) {
              temp.splice(index, 3); // eliminate triples
              elimRepeats(index);
            }
          }
          if (temp[index + 1] !== undefined) {
            if (temp[index].value === temp[index + 1].value) {
              temp.splice(index, 2); // eliminate doubles
              elimRepeats(index);
            }
            index++;
            elimRepeats(index);
          } else {
            if (temp[index] !== undefined && temp[index - 1] !== undefined) {
              if (temp[index - 1].value === temp[index].value) {
                temp.splice(index, 1);
              }
            }
          }
        }
        elimRepeats(0);

        function octRun(index) {
          if (temp[index + 7] !== undefined) {
            if (temp[index].value - 1 === temp[index + 1].value && temp[index + 1].value - 1 === temp[index + 2].value && temp[index + 2].value - 1 === temp[index + 3].value && temp[index + 3].value - 1 === temp[index + 4].value && temp[index + 4].value - 1 === temp[index + 5].value && temp[index + 5].value - 1 === temp[index + 6].value && temp[index + 6].value - 1 === temp[index + 7].value) {
              index++;
              octRun(index);
            } else {
              temp.splice(index, 1);
              octRun(index);
            }
          } else {
            temp.splice(index, 7);
          }
        }
        octRun(0);
        if (temp.length === 0) {
          game.lastActions[game.currentTurn] = "pass";
          whenDone();
        } else {
          var temp2;
          var temp3 = true;
          if (temp.length === 1) {
            temp2 = 0;
            temp3 = false;
          }
          for (var i = 0; i < temp.length; i++) {
            if (temp[i].value <= game.cardsToBeat[0].value && temp3) { // choose the lowest orun that beats
              temp2 = i - 1;
              temp3 = false;
            }
          }
          if (temp3) {
            game.lastActions[game.currentTurn] = "pass";
            whenDone();
          } else {
            var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first card
            var temp5 = hand.find(temp[temp2].value - 1, "*"); // find the second card
            var temp6 = hand.find(temp[temp2].value - 2, "*"); // find the third card
            var temp7 = hand.find(temp[temp2].value - 3, "*"); // find the fourth card
            var temp8 = hand.find(temp[temp2].value - 4, "*"); // find the fifth card
            var temp9 = hand.find(temp[temp2].value - 5, "*"); // find the sixth card
            var temp10 = hand.find(temp[temp2].value - 6, "*"); // find the seventh card
            var temp11 = hand.find(temp[temp2].value - 7, "*"); // find the eigth card
            game.lastActions[game.currentTurn] = "play";
            for (var i = 0; i < hand.length; i++) {
              if (hand[i].value === 14) {
                hand[i].value = 1;
              }
              if (hand[i].value === 15) {
                hand[i].value = 2;
              }
            }
            game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7], hand.cards[temp8], hand.cards[temp9], hand.cards[temp10], hand.cards[temp11]];
            whenDone();
          }
        }
      } else if (game.typeToBeat === "drun") {
        var temp = hand.cards.slice(); // list of duodec runs (ie 4 5 6 7 8 9 10 J Q K A 2)
        function elimRepeats(index) {
          if (temp[index + 3] !== undefined) {
            if (temp[index + 2].value === temp[index + 3].value) {
              temp.splice(index, 4); // eliminate quads
              elimRepeats(index);
            }
          }
          if (temp[index + 2] !== undefined) {
            if (temp[index + 1].value === temp[index + 2].value) {
              temp.splice(index, 3); // eliminate triples
              elimRepeats(index);
            }
          }
          if (temp[index + 1] !== undefined) {
            if (temp[index].value === temp[index + 1].value) {
              temp.splice(index, 2); // eliminate doubles
              elimRepeats(index);
            }
            index++;
            elimRepeats(index);
          } else {
            if (temp[index] !== undefined && temp[index - 1] !== undefined) {
              if (temp[index - 1].value === temp[index].value) {
                temp.splice(index, 1);
              }
            }
          }
        }
        elimRepeats(0);

        function duodecRun(index) {
          if (temp[index + 11] !== undefined) {
            if (temp[index].value - 1 === temp[index + 1].value && temp[index + 1].value - 1 === temp[index + 2].value && temp[index + 2].value - 1 === temp[index + 3].value && temp[index + 3].value - 1 === temp[index + 4].value && temp[index + 4].value - 1 === temp[index + 5].value && temp[index + 5].value - 1 === temp[index + 6].value && temp[index + 6].value - 1 === temp[index + 7].value && temp[index + 7].value - 1 === temp[index + 8].value && temp[index + 8].value - 1 === temp[index + 9].value && temp[index + 9].value - 1 === temp[index + 10].value && temp[index + 10].value - 1 === temp[index + 11].value) {
              index++;
              duodecRun(index);
            } else {
              temp.splice(index, 1);
              duodecRun(index);
            }
          } else {
            temp.splice(index, 11);
          }
        }
        duodecRun(0);
        if (temp.length === 0) {
          game.lastActions[game.currentTurn] = "pass";
          whenDone();
        } else {
          var temp2;
          var temp3 = true;
          if (temp.length === 1) {
            temp2 = 0;
            temp3 = false;
          }
          for (var i = 0; i < temp.length; i++) {
            if (temp[i].value <= game.cardsToBeat[0].value && temp3) { // choose the lowest drun that beats
              temp2 = i - 1;
              temp3 = false;
            }
          }
          if (temp3) {
            game.lastActions[game.currentTurn] = "pass";
            whenDone();
          } else {
            var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first card
            var temp5 = hand.find(temp[temp2].value - 1, "*"); // find the second card
            var temp6 = hand.find(temp[temp2].value - 2, "*"); // find the third card
            var temp7 = hand.find(temp[temp2].value - 3, "*"); // find the fourth card
            var temp8 = hand.find(temp[temp2].value - 4, "*"); // find the fifth card
            var temp9 = hand.find(temp[temp2].value - 5, "*"); // find the sixth card
            var temp10 = hand.find(temp[temp2].value - 6, "*"); // find the seventh card
            var temp11 = hand.find(temp[temp2].value - 7, "*"); // find the eigth card
            var temp12 = hand.find(temp[temp2].value - 8, "*"); // find the ninth card
            var temp13 = hand.find(temp[temp2].value - 9, "*"); // find the tenth card
            var temp14 = hand.find(temp[temp2].value - 10, "*"); // find the eleventh card
            var temp15 = hand.find(temp[temp2].value - 11, "*"); // find the twelfth card
            game.lastActions[game.currentTurn] = "play";
            for (var i = 0; i < hand.length; i++) {
              if (hand[i].value === 14) {
                hand[i].value = 1;
              }
              if (hand[i].value === 15) {
                hand[i].value = 2;
              }
            }
            game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7], hand.cards[temp8], hand.cards[temp9], hand.cards[temp10], hand.cards[temp11], hand.cards[temp12], hand.cards[temp13], hand.cards[temp14], hand.cards[temp15]];
            whenDone();
          }
        }
      } else {
        trickStart(hand, whenDone); // if it's none of them, that means that they're starting
        // moved to new function cuz this one was getting kinda long and i was basically going to copy paste it in
      }
    }
  }

  function trickStart(hand, whenDone) { // chooses a play to start with. in order: drun, sdoubles, pdoubles, orun, qdoubles, tdoubles, qrun, ddoubles, quadruples, triples, doubles, single
    var temp = hand.cards.slice(); // list of duodec runs (ie 4 5 6 7 8 9 10 J Q K A 2)
    function elimRepeats(index) {
      if (temp[index + 3] !== undefined) {
        if (temp[index + 2].value === temp[index + 3].value) {
          temp.splice(index, 4); // eliminate quads
          elimRepeats(index);
        }
      }
      if (temp[index + 2] !== undefined) {
        if (temp[index + 1].value === temp[index + 2].value) {
          temp.splice(index, 3); // eliminate triples
          elimRepeats(index);
        }
      }
      if (temp[index + 1] !== undefined) {
        if (temp[index].value === temp[index + 1].value) {
          temp.splice(index, 2); // eliminate doubles
          elimRepeats(index);
        }
        index++;
        elimRepeats(index);
      } else {
        if (temp[index] !== undefined && temp[index - 1] !== undefined) {
          if (temp[index - 1].value === temp[index].value) {
            temp.splice(index, 1);
          }
        }
      }
    }
    elimRepeats(0);

    function duodecRun(index) {
      if (temp[index + 11] !== undefined) {
        if (temp[index].value - 1 === temp[index + 1].value && temp[index + 1].value - 1 === temp[index + 2].value && temp[index + 2].value - 1 === temp[index + 3].value && temp[index + 3].value - 1 === temp[index + 4].value && temp[index + 4].value - 1 === temp[index + 5].value && temp[index + 5].value - 1 === temp[index + 6].value && temp[index + 6].value - 1 === temp[index + 7].value && temp[index + 7].value - 1 === temp[index + 8].value && temp[index + 8].value - 1 === temp[index + 9].value && temp[index + 9].value - 1 === temp[index + 10].value && temp[index + 10].value - 1 === temp[index + 11].value) {
          index++;
          duodecRun(index);
        } else {
          temp.splice(index, 1);
          duodecRun(index);
        }
      } else {
        temp.splice(index, 11);
      }
    }
    duodecRun(0);
    if (temp.length === 0) {
      trickStartSDoubles(hand, whenDone); // move to function, otherwise it'd get messy
    } else {
      var temp2 = temp.length - 1; // pick the lowest one
      var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first card
      var temp5 = hand.find(temp[temp2].value - 1, "*"); // find the second card
      var temp6 = hand.find(temp[temp2].value - 2, "*"); // find the third card
      var temp7 = hand.find(temp[temp2].value - 3, "*"); // find the fourth card
      var temp8 = hand.find(temp[temp2].value - 4, "*"); // find the fifth card
      var temp9 = hand.find(temp[temp2].value - 5, "*"); // find the sixth card
      var temp10 = hand.find(temp[temp2].value - 6, "*"); // find the seventh card
      var temp11 = hand.find(temp[temp2].value - 7, "*"); // find the eigth card
      var temp12 = hand.find(temp[temp2].value - 8, "*"); // find the ninth card
      var temp13 = hand.find(temp[temp2].value - 9, "*"); // find the tenth card
      var temp14 = hand.find(temp[temp2].value - 10, "*"); // find the eleventh card
      var temp15 = hand.find(temp[temp2].value - 11, "*"); // find the twelfth card
      game.lastActions[game.currentTurn] = "play";
      for (var i = 0; i < hand.length; i++) {
        if (hand[i].value === 14) {
          hand[i].value = 1;
        }
        if (hand[i].value === 15) {
          hand[i].value = 2;
        }
      }
      game.typeToBeat = "drun";
      game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7], hand.cards[temp8], hand.cards[temp9], hand.cards[temp10], hand.cards[temp11], hand.cards[temp12], hand.cards[temp13], hand.cards[temp14], hand.cards[temp15]];
      whenDone();
    }
  }

  function trickStartSDoubles(hand, whenDone) {
    var temp = hand.cards.slice(); // list of sextuple doubles (ie 44 55 66 77 88 99)
    function findDoublesElim(index) {
      if (temp[index + 1] !== undefined) {
        if (temp[index].value === temp[index + 1].value) {
          if (temp[index + 2] !== undefined) {
            if (temp[index + 3] !== undefined) {
              if (temp[index + 2].value === temp[index + 3].value) {
                temp.splice(index + 2, 1); // eliminate quads
              }
            }
            if (temp[index + 1].value === temp[index + 2].value) {
              temp.splice(index + 1, 1); // eliminate triples
            }
          }
          index++;
          findDoublesElim(index);
        } else {
          temp.splice(index, 1);
          findDoublesElim(index);
        }
      } else {
        temp.splice(index, 1);
      }
    }
    findDoublesElim(0);

    function findSixSequence(index) {
      if (temp[index + 5] !== undefined) {
        if (temp[index].value - 1 === temp[index + 1].value && temp[index + 1].value - 1 === temp[index + 2].value && temp[index + 2].value - 1 === temp[index + 3].value && temp[index + 3].value - 1 === temp[index + 4].value && temp[index + 4].value - 1 === temp[index + 5].value) {
          index++;
          findSixSequence(index);
        } else {
          temp.splice(index, 1);
          findSixSequence(index);
        }
      } else {
        temp.splice(index, 5);
      }
    }
    findSixSequence(0);
    if (temp.length === 0) {
      trickStartPDoubles(hand, whenDone);
    } else {
      var temp2 = temp.length - 1; // choose the lowest
      var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first double, first card
      var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the first double, second card
      var temp6 = hand.find(temp[temp2].value - 1, "*"); // find the second double, first card
      var temp7 = hand.find(temp[temp2].value - 1, "!" + hand[temp6].suit); // find the second double, second card
      var temp8 = hand.find(temp[temp2].value - 2, "*"); // find the third double, first card
      var temp9 = hand.find(temp[temp2].value - 2, "!" + hand[temp8].suit); // find the third double, second card
      var temp10 = hand.find(temp[temp2].value - 3, "*"); // find the fourth double, first card
      var temp11 = hand.find(temp[temp2].value - 3, "!" + hand[temp10].suit); // find the fourth double, second card
      var temp12 = hand.find(temp[temp2].value - 4, "*"); // find the fifth double, first card
      var temp13 = hand.find(temp[temp2].value - 4, "!" + hand[temp12].suit); // find the fifth double, second card
      var temp14 = hand.find(temp[temp2].value - 5, "*"); // find the sixth double, first card
      var temp15 = hand.find(temp[temp2].value - 5, "!" + hand[temp14].suit); // find the sixth double, second card
      game.lastActions[game.currentTurn] = "play";
      for (var i = 0; i < hand.length; i++) {
        if (hand[i].value === 14) {
          hand[i].value = 1;
        }
        if (hand[i].value === 15) {
          hand[i].value = 2;
        }
      }
      game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7], hand.cards[temp8], hand.cards[temp9], hand.cards[temp10], hand.cards[temp11], hand.cards[temp12], hand.cards[temp13], hand.cards[temp14], hand.cards[temp15]];
      game.typeToBeat = "sdouble";
      whenDone();
    }
  }

  function trickStartPDoubles(hand, whenDone) {
    var temp = hand.cards.slice(); // list of quintuple doubles (ie 44 55 66 77 88)
    function findDoublesElim(index) {
      if (temp[index + 1] !== undefined) {
        if (temp[index].value === temp[index + 1].value) {
          if (temp[index + 2] !== undefined) {
            if (temp[index + 3] !== undefined) {
              if (temp[index + 2].value === temp[index + 3].value) {
                temp.splice(index + 2, 1); // eliminate quads
              }
            }
            if (temp[index + 1].value === temp[index + 2].value) {
              temp.splice(index + 1, 1); // eliminate triples
            }
          }
          index++;
          findDoublesElim(index);
        } else {
          temp.splice(index, 1);
          findDoublesElim(index);
        }
      } else {
        temp.splice(index, 1);
      }
    }
    findDoublesElim(0);

    function findFiveSequence(index) {
      if (temp[index + 4] !== undefined) {
        if (temp[index].value - 1 === temp[index + 1].value && temp[index + 1].value - 1 === temp[index + 2].value && temp[index + 2].value - 1 === temp[index + 3].value && temp[index + 3].value - 1 === temp[index + 4].value) {
          index++;
          findFiveSequence(index);
        } else {
          temp.splice(index, 1);
          findFiveSequence(index);
        }
      } else {
        temp.splice(index, 4);
      }
    }
    findFiveSequence(0);
    if (temp.length === 0) {
      trickStartORun(hand, whenDone);
    } else {
      var temp2 = temp.length - 1;
      var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first double, first card
      var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the first double, second card
      var temp6 = hand.find(temp[temp2].value - 1, "*"); // find the second double, first card
      var temp7 = hand.find(temp[temp2].value - 1, "!" + hand[temp6].suit); // find the second double, second card
      var temp8 = hand.find(temp[temp2].value - 2, "*"); // find the third double, first card
      var temp9 = hand.find(temp[temp2].value - 2, "!" + hand[temp8].suit); // find the third double, second card
      var temp10 = hand.find(temp[temp2].value - 3, "*"); // find the fourth double, first card
      var temp11 = hand.find(temp[temp2].value - 3, "!" + hand[temp10].suit); // find the fourth double, second card
      var temp12 = hand.find(temp[temp2].value - 4, "*"); // find the fifth double, first card
      var temp13 = hand.find(temp[temp2].value - 4, "!" + hand[temp12].suit); // find the fifth double, second card
      game.lastActions[game.currentTurn] = "play";
      for (var i = 0; i < hand.length; i++) {
        if (hand[i].value === 14) {
          hand[i].value = 1;
        }
        if (hand[i].value === 15) {
          hand[i].value = 2;
        }
      }
      game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7], hand.cards[temp8], hand.cards[temp9], hand.cards[temp10], hand.cards[temp11], hand.cards[temp12], hand.cards[temp13]];
      game.typeToBeat = "pdouble";
      whenDone();
    }
  }

  function trickStartORun(hand, whenDone) {
    var temp = hand.cards.slice(); // list of octuple runs (ie 4 5 6 7 8 9 10 J)
    function elimRepeats(index) {
      if (temp[index + 3] !== undefined) {
        if (temp[index + 2].value === temp[index + 3].value) {
          temp.splice(index, 4); // eliminate quads
          elimRepeats(index);
        }
      }
      if (temp[index + 2] !== undefined) {
        if (temp[index + 1].value === temp[index + 2].value) {
          temp.splice(index, 3); // eliminate triples
          elimRepeats(index);
        }
      }
      if (temp[index + 1] !== undefined) {
        if (temp[index].value === temp[index + 1].value) {
          temp.splice(index, 2); // eliminate doubles
          elimRepeats(index);
        }
        index++;
        elimRepeats(index);
      } else {
        if (temp[index] !== undefined && temp[index - 1] !== undefined) {
          if (temp[index - 1].value === temp[index].value) {
            temp.splice(index, 1);
          }
        }
      }
    }
    elimRepeats(0);

    function octRun(index) {
      if (temp[index + 7] !== undefined) {
        if (temp[index].value - 1 === temp[index + 1].value && temp[index + 1].value - 1 === temp[index + 2].value && temp[index + 2].value - 1 === temp[index + 3].value && temp[index + 3].value - 1 === temp[index + 4].value && temp[index + 4].value - 1 === temp[index + 5].value && temp[index + 5].value - 1 === temp[index + 6].value && temp[index + 6].value - 1 === temp[index + 7].value) {
          index++;
          octRun(index);
        } else {
          temp.splice(index, 1);
          octRun(index);
        }
      } else {
        temp.splice(index, 7);
      }
    }
    octRun(0);
    if (temp.length === 0) {
      startTrickQDoubles(hand, whenDone);
    } else {
      var temp2 = temp.length - 1;
      var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first card
      var temp5 = hand.find(temp[temp2].value - 1, "*"); // find the second card
      var temp6 = hand.find(temp[temp2].value - 2, "*"); // find the third card
      var temp7 = hand.find(temp[temp2].value - 3, "*"); // find the fourth card
      var temp8 = hand.find(temp[temp2].value - 4, "*"); // find the fifth card
      var temp9 = hand.find(temp[temp2].value - 5, "*"); // find the sixth card
      var temp10 = hand.find(temp[temp2].value - 6, "*"); // find the seventh card
      var temp11 = hand.find(temp[temp2].value - 7, "*"); // find the eigth card
      game.lastActions[game.currentTurn] = "play";
      for (var i = 0; i < hand.length; i++) {
        if (hand[i].value === 14) {
          hand[i].value = 1;
        }
        if (hand[i].value === 15) {
          hand[i].value = 2;
        }
      }
      game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7], hand.cards[temp8], hand.cards[temp9], hand.cards[temp10], hand.cards[temp11]];
      game.typeToBeat = "orun";
      whenDone();
    }
  }

  function startTrickQDoubles(hand, whenDone) {
    var temp = hand.cards.slice(); // list of quadruple doubles (ie 44 55 66 77)
    function findDoublesElim(index) {
      if (temp[index + 1] !== undefined) {
        if (temp[index].value === temp[index + 1].value) {
          if (temp[index + 2] !== undefined) {
            if (temp[index + 3] !== undefined) {
              if (temp[index + 2].value === temp[index + 3].value) {
                temp.splice(index + 2, 1); // eliminate quads
              }
            }
            if (temp[index + 1].value === temp[index + 2].value) {
              temp.splice(index + 1, 1); // eliminate triples
            }
          }
          index++;
          findDoublesElim(index);
        } else {
          temp.splice(index, 1);
          findDoublesElim(index);
        }
      } else {
        temp.splice(index, 1);
      }
    }
    findDoublesElim(0);

    function findFourSequence(index) {
      if (temp[index + 3] !== undefined) {
        if (temp[index].value - 1 === temp[index + 1].value && temp[index + 1].value - 1 === temp[index + 2].value && temp[index + 2].value - 1 === temp[index + 3].value) {
          index++;
          findFourSequence(index);
        } else {
          temp.splice(index, 1);
          findFourSequence(index);
        }
      } else {
        temp.splice(index, 3);
      }
    }
    findFourSequence(0);
    if (temp.length === 0) {
      startTrickTDoubles(hand, whenDone);
    } else {
      var temp2 = temp.length - 1;
      var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first double, first card
      var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the first double, second card
      var temp6 = hand.find(temp[temp2].value - 1, "*"); // find the second double, first card
      var temp7 = hand.find(temp[temp2].value - 1, "!" + hand[temp6].suit); // find the second double, second card
      var temp8 = hand.find(temp[temp2].value - 2, "*"); // find the third double, first card
      var temp9 = hand.find(temp[temp2].value - 2, "!" + hand[temp8].suit); // find the third double, second card
      var temp10 = hand.find(temp[temp2].value - 3, "*"); // find the fourth double, first card
      var temp11 = hand.find(temp[temp2].value - 3, "!" + hand[temp10].suit); // find the fourth double, second card
      game.lastActions[game.currentTurn] = "play";
      for (var i = 0; i < hand.length; i++) {
        if (hand[i].value === 14) {
          hand[i].value = 1;
        }
        if (hand[i].value === 15) {
          hand[i].value = 2;
        }
      }
      game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7], hand.cards[temp8], hand.cards[temp9], hand.cards[temp10], hand.cards[temp11]];
      game.typeToBeat = "qdouble";
      whenDone();
    }
  }

  function startTrickTDoubles(hand, whenDone) {
    var temp = hand.cards.slice(); // list of triple doubles (ie 44 55 66)
    function findDoublesElim(index) {
      if (temp[index + 1] !== undefined) {
        if (temp[index].value === temp[index + 1].value) {
          if (temp[index + 2] !== undefined) {
            if (temp[index + 3] !== undefined) {
              if (temp[index + 2].value === temp[index + 3].value) {
                temp.splice(index + 2, 1); // eliminate quads
              }
            }
            if (temp[index + 1].value === temp[index + 2].value) {
              temp.splice(index + 1, 1); // eliminate triples
            }
          }
          index++;
          findDoublesElim(index);
        } else {
          temp.splice(index, 1);
          findDoublesElim(index);
        }
      } else {
        temp.splice(index, 1);
      }
    }
    findDoublesElim(0);

    function findThreeSequence(index) {
      if (temp[index + 2] !== undefined) {
        if (temp[index].value - 1 === temp[index + 1].value && temp[index + 1].value - 1 === temp[index + 2].value) {
          index++;
          findThreeSequence(index);
        } else {
          temp.splice(index, 1);
          findThreeSequence(index);
        }
      } else {
        temp.splice(index, 2);
      }
    }
    findThreeSequence(0);
    if (temp.length === 0) {
      trickStartQRun(hand, whenDone);
    } else {
      var temp2 = temp.length - 1;
      var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first double, first card
      var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the first double, second card
      var temp6 = hand.find(temp[temp2].value - 1, "*"); // find the second double, first card
      var temp7 = hand.find(temp[temp2].value - 1, "!" + hand[temp6].suit); // find the second double, second card
      var temp8 = hand.find(temp[temp2].value - 2, "*"); // find the third double, first card
      var temp9 = hand.find(temp[temp2].value - 2, "!" + hand[temp8].suit); // find the third double, second card
      game.lastActions[game.currentTurn] = "play";
      for (var i = 0; i < hand.length; i++) {
        if (hand[i].value === 14) {
          hand[i].value = 1;
        }
        if (hand[i].value === 15) {
          hand[i].value = 2;
        }
      }
      game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7], hand.cards[temp8], hand.cards[temp9]];
      game.typeToBeat = "tdouble";
      whenDone();
    }
  }

  function trickStartQRun(hand, whenDone) {
    var temp = hand.cards.slice(); // list of quadruple runs (ie 4 5 6 7)
    function elimRepeats(index) {
      if (temp[index + 3] !== undefined) {
        if (temp[index + 2].value === temp[index + 3].value) {
          temp.splice(index, 4); // eliminate quads
          elimRepeats(index);
        }
      }
      if (temp[index + 2] !== undefined) {
        if (temp[index + 1].value === temp[index + 2].value) {
          temp.splice(index, 3); // eliminate triples
          elimRepeats(index);
        }
      }
      if (temp[index + 1] !== undefined) {
        if (temp[index].value === temp[index + 1].value) {
          temp.splice(index, 2); // eliminate doubles
          elimRepeats(index);
        }
        index++;
        elimRepeats(index);
      } else {
        if (temp[index] !== undefined && temp[index - 1] !== undefined) {
          if (temp[index - 1].value === temp[index].value) {
            temp.splice(index, 1);
          }
        }
      }
    }
    elimRepeats(0);

    function quadRun(index) {
      if (temp[index + 3] !== undefined) {
        if (temp[index].value - 1 === temp[index + 1].value && temp[index + 1].value - 1 === temp[index + 2].value && temp[index + 2].value - 1 === temp[index + 3].value) {
          index++;
          quadRun(index);
        } else {
          temp.splice(index, 1);
          quadRun(index);
        }
      } else {
        temp.splice(index, 3);
      }
    }
    quadRun(0);
    if (temp.length === 0) {
      startTrickDDoubles(hand, whenDone);
    } else {
      var temp2 = temp.length - 1;
      var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first card
      var temp5 = hand.find(temp[temp2].value - 1, "*"); // find the second card
      var temp6 = hand.find(temp[temp2].value - 2, "*"); // find the third card
      var temp7 = hand.find(temp[temp2].value - 3, "*"); // find the fourth card
      game.lastActions[game.currentTurn] = "play";
      for (var i = 0; i < hand.length; i++) {
        if (hand[i].value === 14) {
          hand[i].value = 1;
        }
        if (hand[i].value === 15) {
          hand[i].value = 2;
        }
      }
      game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7]];
      game.typeToBeat = "qrun";
      whenDone();
    }
  }

  function startTrickDDoubles(hand, whenDone) {
    var temp = hand.cards.slice(); // list of double doubles (ie 44 55)
    function findDoublesElim(index) {
      if (temp[index + 1] !== undefined) {
        if (temp[index].value === temp[index + 1].value) {
          if (temp[index + 2] !== undefined) {
            if (temp[index + 3] !== undefined) {
              if (temp[index + 2].value === temp[index + 3].value) {
                temp.splice(index + 2, 1); // eliminate quads
              }
            }
            if (temp[index + 1].value === temp[index + 2].value) {
              temp.splice(index + 1, 1); // eliminate triples
            }
          }
          index++;
          findDoublesElim(index);
        } else {
          temp.splice(index, 1);
          findDoublesElim(index);
        }
      } else {
        temp.splice(index, 1);
      }
    }
    findDoublesElim(0);

    function findTwoSequence(index) {
      if (temp[index + 1] !== undefined) {
        if (temp[index].value - 1 === temp[index + 1].value) {
          index++;
          findTwoSequence(index);
        } else {
          temp.splice(index, 1);
          findTwoSequence(index);
        }
      } else {
        temp.splice(index, 1);
      }
    }
    findTwoSequence(0);
    if (temp.length === 0) {
      trickStartQuadruples(hand, whenDone);
    } else {
      var temp2 = temp.length - 1;
      var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first double, first card
      var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the first double, second card
      var temp6 = hand.find(temp[temp2].value - 1, "*"); // find the second double, first card
      var temp7 = hand.find(temp[temp2].value - 1, "!" + hand[temp6].suit); // find the second double, second card
      game.lastActions[game.currentTurn] = "play";
      for (var i = 0; i < hand.length; i++) {
        if (hand[i].value === 14) {
          hand[i].value = 1;
        }
        if (hand[i].value === 15) {
          hand[i].value = 2;
        }
      }
      game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7]];
      game.typeToBeat = "ddouble";
      whenDone();
    }
  }

  function trickStartQuadruples(hand, whenDone) {
    var temp = hand.cards.slice(); // list of quadruples
    function findQuadruples(index) {
      if (temp[index + 3] !== undefined) {
        if (temp[index].value === temp[index + 1].value && temp[index + 1].value === temp[index + 2].value && temp[index + 2].value === temp[index + 3].value) {
          index++;
          findQuadruples(index);
        } else {
          temp.splice(index, 1);
          findQuadruples(index);
        }
      } else {
        temp.splice(index, 3);
      }
    }
    findQuadruples(0);
    if (temp.length === 0) {
      trickStartTriples(hand, whenDone); // sends 6 lines of garbage to your opponent
    } else {
      var temp2 = temp.length - 1;
      var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first quadruple card
      var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the second quadruple card
      var temp6 = hand.find(temp[temp2].value, "!" + temp[temp2].suit + "&" + hand[temp5].suit); // find the third quadruple card
      var temp7 = hand.find(temp[temp2].value, "!" + temp[temp2].suit + "&" + hand[temp5].suit + "&" + hand[temp6].suit); // find the final quadruple card
      game.lastActions[game.currentTurn] = "play";
      for (var i = 0; i < hand.length; i++) {
        if (hand[i].value === 14) {
          hand[i].value = 1;
        }
        if (hand[i].value === 15) {
          hand[i].value = 2;
        }
      }
      game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6], hand.cards[temp7]];
      game.typeToBeat = "quadruple";
      whenDone();
    }
  }

  function trickStartTriples(hand, whenDone) {
    var temp = hand.cards.slice(); // list of triples
    function findTriples(index) {
      if (temp[index + 2] !== undefined) {
        if (temp[index].value === temp[index + 1].value && temp[index + 1].value === temp[index + 2].value) {
          index++;
          findTriples(index);
        } else {
          temp.splice(index, 1);
          findTriples(index);
        }
      } else {
        temp.splice(index, 2);
      }
    }
    findTriples(0);
    if (temp.length === 0) {
      startTrickDoubles(hand, whenDone); // avoid getting these
    } else {
      var temp2 = temp.length - 1;
      var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first triple card
      var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the second triple card
      var temp6 = hand.find(temp[temp2].value, "!" + temp[temp2].suit + "&" + hand[temp5].suit); // find the final triple card
      game.lastActions[game.currentTurn] = "play";
      for (var i = 0; i < hand.length; i++) {
        if (hand[i].value === 14) {
          hand[i].value = 1;
        }
        if (hand[i].value === 15) {
          hand[i].value = 2;
        }
      }
      game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5], hand.cards[temp6]];
      game.typeToBeat = "triple";
      whenDone();
    }
  }

  function startTrickDoubles(hand, whenDone) {
    var temp = hand.cards.slice();

    function findDoubles(index) {
      if (temp[index + 1] !== undefined) {
        if (temp[index].value === temp[index + 1].value) {
          index++;
          findDoubles(index);
        } else {
          temp.splice(index, 1);
          findDoubles(index);
        }
      } else {
        temp.splice(index, 1);
      }
    }
    findDoubles(0);
    if (temp.length === 0) {
      startTrickSingle(hand, whenDone); // if the player has an absolutely /terrible/ hand with absolutely nothing in it, play a single
    } else {
      var temp2 = temp.length - 1;
      var temp4 = hand.find(temp[temp2].value, temp[temp2].suit); // find the first double card
      var temp5 = hand.find(temp[temp2].value, "!" + temp[temp2].suit); // find the other double card
      game.lastActions[game.currentTurn] = "play";
      for (var i = 0; i < hand.length; i++) {
        if (hand[i].value === 14) {
          hand[i].value = 1;
        }
        if (hand[i].value === 15) {
          hand[i].value = 2;
        }
      }
      game.cardsToBeat = [hand.cards[temp4], hand.cards[temp5]];
      game.typeToBeat = "double";
      whenDone();
    }
  }

  function startTrickSingle(hand, whenDone) {
    var temp = hand.cards.length - 1;
    game.lastActions[game.currentTurn] = "play";
    for (var i = 0; i < hand.length; i++) {
      if (hand[i].value === 14) {
        hand[i].value = 1;
      }
      if (hand[i].value === 15) {
        hand[i].value = 2;
      }
    }
    game.cardsToBeat = [hand.cards[temp]];
    game.typeToBeat = "single";
    whenDone();
  }

  function displayOptions(hand, whenDone) {
    var temp = "",
      toPlay = new Deck([]);
    for (var i = 0; i < hand.length; i++) {
      if (hand[i].value !== 1 && hand[i].value !== 11 && hand[i].value !== 12 && hand[i].value !== 13) {
        temp += hand[i].value.toString() + " of ";
      } else {
        switch (hand[i].value) {
          case 1:
            temp += "Ace of ";
            break;
          case 11:
            temp += "Jack of ";
            break;
          case 12:
            temp += "Queen of ";
            break;
          case 13:
            temp += "King of ";
            break;
        }
      }
      temp += hand[i].suit + ". ";
    }
    alert("Hand: " + temp);
    // temp.push("Pass");
    // temp.push("Finished");
    answer = prompt("What thingy?" /*, determineAnswer*/ );

    function determineAnswer() {
      switch (answer) {
        case "Pass":
          game.lastActions[game.currentTurn] = "pass";
          whenDone();
          break;
        case "Finished":
          validPlay(toPlay, whenDone);
          break;
        default:
          var temp = answer.split(" ");
          var temp5;
          switch (temp[0]) {
            case "Ace":
              temp5 = "1";
              break;
            case "Jack":
              temp5 = "11";
              break;
            case "Queen":
              temp5 = "12";
              break;
            case "King":
              temp5 = "13";
              break;
            default:
              temp5 = temp[0]
              break;
          }
          var temp3 = temp[temp.length - 1].split(".");
          temp3 = temp3[0];
          var temp2 = true; // yes, add it to the play
          for (var i = 0; i < toPlay.cards.length; i++) {
            if (toPlay.cards[i].value.toString() === temp5 && toPlay.cards[i].suit === temp3) {
              toPlay.cards.splice(i, 1); // remove it if it's already there
              temp2 = false; // don't add it back!
            }
          }
          if (temp2) {
            toPlay.cards.push(answer); // actually add it to the play
          }
          break;
      }
    }
  }

  function validPlay(toPlay, whenDone) {
    if (toPlay.cards.length === 0) {
      //alert("no bad");
      displayOptions(game.hands[0], whenDone);
    } else {
      toPlay.sortScumbags();
      if (game.typeToBeat === "none") {
        var playIt = false;
        var typeToBeat;
        for (var i = 0; i < toPlay.length; i++) {
          if (toPlay[i].value === 1) {
            toPlay[i].value = 14;
          }
          if (toPlay[i].value === 2) {
            toPlay[i].value = 15;
          }
        }
        var playIt = false;
        if (toPlay.cards.length === 1) {
          playIt = true;
          typeToBeat = "single";
        } else if (toPlay.cards.length === 2 && toPlay[0].value === toPlay[1].value) {
          playIt = true;
          typeToBeat = "double";
        } else if (toPlay.cards.length === 3 && toPlay[0].value === toPlay[1].value && toPlay[1].value === toPlay[2].value) {
          playIt = true;
          typeToBeat = "triple";
        } else if (toPlay.cards.length === 4 && toPlay[0].value === toPlay[1].value && toPlay[1].value === toPlay[2].value && toPlay[2].value === toPlay[3].value) {
          playIt = true;
          typeToBeat = "quadruple";
        } else if (toPlay.cards.length === 4 && toPlay[0].value === toPlay[1].value && toPlay[2].value === toPlay[3].value) {
          playIt = true;
          typeToBeat = "ddouble";
        } else if (toPlay.cards.length === 6 && toPlay[0].value === toPlay[1].value && toPlay[2].value === toPlay[3].value && toPlay[4].value === toPlay[5].value) {
          playIt = true;
          typeToBeat = "tdouble";
        } else if (toPlay.cards.length === 8 && toPlay[0].value === toPlay[1].value && toPlay[2].value === toPlay[3].value && toPlay[4].value === toPlay[5].value && toPlay[6].value === toPlay[7].value) {
          playIt = true;
          typeToBeat = "qdouble";
        } else if (toPlay.cards.length === 10 && toPlay[0].value === toPlay[1].value && toPlay[2].value === toPlay[3].value && toPlay[4].value === toPlay[5].value && toPlay[6].value === toPlay[7].value && toPlay[8].value === toPlay[9].value) {
          playIt = true;
          typeToBeat = "pdouble";
        } else if (toPlay.cards.length === 12 && toPlay[0].value === toPlay[1].value && toPlay[2].value === toPlay[3].value && toPlay[4].value === toPlay[5].value && toPlay[6].value === toPlay[7].value && toPlay[8].value === toPlay[9].value && toPlay[9].value === toPlay[10].value) {
          playIt = true;
          typeToBeat = "sdouble";
        } else if (toPlay.cards.length === 4 && toPlay[0].value - 1 === toPlay[1].value && toPlay[1].value - 1 === toPlay[2].value && toPlay[2].value - 1 === toPlay[3].value) {
          playIt = true;
          typeToBeat = "qrun";
        } else if (toPlay.cards.length === 8 && toPlay[0].value - 1 === toPlay[1].value && toPlay[1].value - 1 === toPlay[2].value && toPlay[2].value - 1 === toPlay[3].value && toPlay[3].value - 1 === toPlay[4].value && toPlay[4].value - 1 === toPlay[5].value && toPlay[5].value - 1 === toPlay[6].value && toPlay[6] - 1 === toPlay[7]) {
          playIt = true;
          typeToBeat = "orun";
        } else if (toPlay.cards.length === 12 && toPlay[0].value - 1 === toPlay[1].value && toPlay[1].value - 1 === toPlay[2].value && toPlay[2].value - 1 === toPlay[3].value && toPlay[3].value - 1 === toPlay[4].value && toPlay[4].value - 1 === toPlay[5].value && toPlay[5].value - 1 === toPlay[6].value && toPlay[6].value - 1 === toPlay[7].value && toPlay[7].value - 1 === toPlay[8].value && toPlay[8].value - 1 === toPlay[9].value && toPlay[9].value - 1 === toPlay[10].value && toPlay[10].value - 1 === toPlay[11].value) {
          playIt = true;
          typeToBeat = "drun";
        }
        if (playIt) {
          for (var i = 0; i < toPlay.length; i++) {
            if (toPlay[i].value === 14) {
              toPlay[i].value = 1;
            }
            if (toPlay[i].value === 15) {
              toPlay[i].value = 2;
            }
          }
          game.lastActions[0] = "play";
          game.cardsToBeat = toPlay.cards.slice();
          game.typeToBeat = typeToBeat;
          whenDone();
        } else {
          // invalid! do it again, baka
          displayOptions(game.hands[0], whenDone);
        }
      } else {
        for (var i = 0; i < toPlay.length; i++) {
          if (toPlay[i].value === 1) {
            toPlay[i].value = 14;
          }
          if (toPlay[i].value === 2) {
            toPlay[i].value = 15;
          }
        }
        var playIt = false;
        if (game.typeToBeat === "single" && toPlay.cards.length === 1) {
          if (toPlay.cards[0].value > game.cardsToBeat[0].value) {
            playIt = true;
          }
        } else if (game.typeToBeat === "double" && toPlay.cards.length === 2 && toPlay[0].value === toPlay[1].value) {
          if (toPlay.cards[0].value > game.cardsToBeat[0].value) {
            playIt = true;
          }
        } else if (game.typeToBeat === "triple" && toPlay.cards.length === 3 && toPlay[0].value === toPlay[1].value && toPlay[1].value === toPlay[2].value) {
          if (toPlay.cards[0].value > game.cardsToBeat[0].value) {
            playIt = true;
          }
        } else if (game.typeToBeat === "quadruple" && toPlay.cards.length === 4 && toPlay[0].value === toPlay[1].value && toPlay[1].value === toPlay[2].value && toPlay[2].value === toPlay[3].value) {
          if (toPlay.cards[0].value > game.cardsToBeat[0].value) {
            playIt = true;
          }
        } else if (game.typeToBeat === "ddoubles" && toPlay.cards.length === 4 && toPlay[0].value === toPlay[1].value && toPlay[2].value === toPlay[3].value) {
          if (toPlay.cards[0].value > game.cardsToBeat[0].value) {
            playIt = true;
          }
        } else if (game.typeToBeat === "tdoubles" && toPlay.cards.length === 6 && toPlay[0].value === toPlay[1].value && toPlay[2].value === toPlay[3].value && toPlay[4].value === toPlay[5].value) {
          if (toPlay.cards[0].value > game.cardsToBeat[0].value) {
            playIt = true;
          }
        } else if (game.typeToBeat === "qdoubles" && toPlay.cards.length === 8 && toPlay[0].value === toPlay[1].value && toPlay[2].value === toPlay[3].value && toPlay[4].value === toPlay[5].value && toPlay[6].value === toPlay[7].value) {
          if (toPlay.cards[0].value > game.cardsToBeat[0].value) {
            playIt = true;
          }
        } else if (game.typeToBeat === "pdoubles" && toPlay.cards.length === 10 && toPlay[0].value === toPlay[1].value && toPlay[2].value === toPlay[3].value && toPlay[4].value === toPlay[5].value && toPlay[6].value === toPlay[7].value && toPlay[8].value === toPlay[9].value) {
          if (toPlay.cards[0].value > game.cardsToBeat[0].value) {
            playIt = true;
          }
        } else if (game.typeToBeat === "sdoubles" && toPlay.cards.length === 12 && toPlay[0].value === toPlay[1].value && toPlay[2].value === toPlay[3].value && toPlay[4].value === toPlay[5].value && toPlay[6].value === toPlay[7].value && toPlay[8].value === toPlay[9].value && toPlay[9].value === toPlay[10].value) {
          if (toPlay.cards[0].value > game.cardsToBeat[0].value) {
            playIt = true;
          }
        } else if (game.typeToBeat === "qrun" && toPlay.cards.length === 4 && toPlay[0].value - 1 === toPlay[1].value && toPlay[1].value - 1 === toPlay[2].value && toPlay[2].value - 1 === toPlay[3].value) {
          if (toPlay.cards[0].value > game.cardsToBeat[0].value) {
            playIt = true;
          }
        } else if (game.typeToBeat === "orun" && toPlay.cards.length === 8 && toPlay[0].value - 1 === toPlay[1].value && toPlay[1].value - 1 === toPlay[2].value && toPlay[2].value - 1 === toPlay[3].value && toPlay[3].value - 1 === toPlay[4].value && toPlay[4].value - 1 === toPlay[5].value && toPlay[5].value - 1 === toPlay[6].value && toPlay[6] - 1 === toPlay[7]) {
          if (toPlay.cards[0].value > game.cardsToBeat[0].value) {
            playIt = true;
          }
        } else if (game.typeToBeat === "drun" && toPlay.cards.length === 12 && toPlay[0].value - 1 === toPlay[1].value && toPlay[1].value - 1 === toPlay[2].value && toPlay[2].value - 1 === toPlay[3].value && toPlay[3].value - 1 === toPlay[4].value && toPlay[4].value - 1 === toPlay[5].value && toPlay[5].value - 1 === toPlay[6].value && toPlay[6].value - 1 === toPlay[7].value && toPlay[7].value - 1 === toPlay[8].value && toPlay[8].value - 1 === toPlay[9].value && toPlay[9].value - 1 === toPlay[10].value && toPlay[10].value - 1 === toPlay[11].value) {
          if (toPlay.cards[0].value > game.cardsToBeat[0].value) {
            playIt = true;
          }
        }
        if (playIt) {
          for (var i = 0; i < toPlay.length; i++) {
            if (toPlay[i].value === 14) {
              toPlay[i].value = 1;
            }
            if (toPlay[i].value === 15) {
              toPlay[i].value = 2;
            }
          }
          game.lastActions[0] = "play";
          game.cardsToBeat = toPlay.cards.slice();
          whenDone();
        } else {
          // invalid! do it again, baka
          displayOptions(game.hands[0], whenDone);
        }
      }
    }
  }

  var deck = new Deck([]);
  for (var i = 0; i < 4; i++) {
    var temp = ["Hearts", "Clubs", "Diamonds", "Spades"];
    for (var j = 1; j < 14; j++) {
      deck.cards.push(new Card(j, temp[i]));
    }
  }
  var hands;
  var slot1 = ["B", "7", "C", "B", "L", "L", "C", "D"];
  var oneIsStopped = false;
  var indexOne = 0;
  var slot2 = ["C", "C", "7", "D", "B", "L", "L", "B"];
  var twoIsStopped = false;
  var indexTwo = 0;
  var slot3 = ["B", "L", "B", "D", "C", "L", "C", "7"];
  var threeIsStopped = false;
  var indexThree = 0;

  var answer
  var H = "Hearts"
  var C = "Clubs"
  var D = "Diamonds"
  var S = "Spades"
  var J = "Jack"
  var Q = "Queen"
  var K = "King"
  var A = "Ace"
  var sortedDeck = [
    [1, 2, 3, 2, H], //[Actual value, What's on the card, What's on the card in Scumbags and Warlords, Blackjack Value, Suit]
    [2, 3, 4, 3, H],
    [3, 4, 5, 4, H],
    [4, 5, 6, 5, H],
    [5, 6, 7, 6, H],
    [6, 7, 8, 7, H],
    [7, 8, 9, 8, H],
    [8, 9, 10, 9, H],
    [9, 10, J, 10, H],
    [10, J, Q, 10, H],
    [11, Q, K, 10, H],
    [12, K, A, 10, H],
    [13, A, 2, 11, H],
    [1, 2, 3, 2, C],
    [2, 3, 4, 3, C],
    [3, 4, 5, 4, C],
    [4, 5, 6, 5, C],
    [5, 6, 7, 6, C],
    [6, 7, 8, 7, C],
    [7, 8, 9, 8, C],
    [8, 9, 10, 9, C],
    [9, 10, J, 10, C],
    [10, J, Q, 10, C],
    [11, Q, K, 10, C],
    [12, K, A, 10, C],
    [13, A, 2, 11, C],
    [1, 2, 3, 2, D],
    [2, 3, 4, 3, D],
    [3, 4, 5, 4, D],
    [4, 5, 6, 5, D],
    [5, 6, 7, 6, D],
    [6, 7, 8, 7, D],
    [7, 8, 9, 8, D],
    [8, 9, 10, 9, D],
    [9, 10, J, 10, D],
    [10, J, Q, 10, D],
    [11, Q, K, 10, D],
    [12, K, A, 10, D],
    [13, A, 2, 11, D],
    [1, 2, 3, 2, S],
    [2, 3, 4, 3, S],
    [3, 4, 5, 4, S],
    [4, 5, 6, 5, S],
    [5, 6, 7, 6, S],
    [6, 7, 8, 7, S],
    [7, 8, 9, 8, S],
    [8, 9, 10, 9, S],
    [9, 10, J, 10, S],
    [10, J, Q, 10, S],
    [11, Q, K, 10, S],
    [12, K, A, 10, S],
    [13, A, 2, 11, S],
  ]
  var shuffledDeck = []
  var hand1 = []
  var hand2 = []
  var hand3 = []
  var hand4 = []
  //Scumbags cases
  var dubs
  var trips
  var quads
  var doubleDoubles
  var tripleDoubles
  var quadrupleDoubles
  var quintupleDoubles
  var sextupleDoubles //If you get really lucky...
  var runFour //The one after run 3
  var runEight
  var runTwelve
  //From old code
  var bet
  var tempVal
  //other
  var numOfHits = 0
  var numOfAIHits = 0
  var playerTotal = 0
  var AITotal = 0


  //Got this from the internet https://www.frankmitchell.org/2015/01/fisher-yates/
  function shuffle(array) {
    var i = 0,
      j = 0,
      temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    shuffledDeck = array
  }

  function dealScumbags() {
    for (i = 1; i <= 13; i++) {
      hand1.push(shuffledDeck[i])
    }
    for (i = 14; i <= 26; i++) {
      hand2.push(shuffledDeck[i])
    }
    for (i = 27; i <= 39; i++) {
      hand3.push(shuffledDeck[i])
    }
    for (i = 40; i <= 52; i++) {
      hand4.push(shuffledDeck[i])
    }
  }

  function chooseGame() {
    answer = prompt('What game do you want to play?', 'Scumbags and Warlords, High or Low, Blackjack, Slots').toUpperCase() //I'm making this with alert/prompt because I don't want to copy the writing functions, also I'm just better with alert/prompt.
    switch (answer) {
      case 'SCUMBAGS AND WARLORDS':
        scumbagsAndWarlords()
        break;
      case 'HIGH OR LOW':
        TheActualHighLow()
        break;
      case 'BLACKJACK':
        blackjack()
        break;
      case 'SLOTS':
        slots()
        break;
    }
  }

  function scumbagsAndWarlords() {
    var game = new Game("Scumbags");
    deck.shuffle();
    game.hands = deck.deal(4);
    alert('Your hand is ' + game.hands[0] + '.')

  }

  function TheActualHighLow() {
    answer = prompt('Do you know how High or Low works?', 'Yes, No').toUpperCase()
    switch (answer) {
      case 'YES':
        TheActualForRealsiesHighLow()
        break;
      case 'NO':
        HighLowTutorial()
        break;
      default:
        NotAnOption()
        TheActualHighLow()
    }
  }

  function HighLowTutorial() {
    alert('High or Low is a game played with a deck of cards. The dealer deals a card, and you guess whether the next card is higher or lower. 2 is lower than 3, 3 is lower than 4, etc. Aces are the highest card, for the purposes of this game. If the first card is an Ace or a 2, a new card will be dealt, because those are the highest and lowest cards. If the card value is the same, you get your bet back. The next alert will show how much you will be payed if you guess right. Any decimal will be rounded down. After you win, you will be given a choice. If you want to continue, then you can get more money. Otherwise, you can just stop and take the money you already have in the bank.')
    alert('If you get dealt a 3, you will get: a 10.7 multiplier if you guess lower, and a 1.1 if you guess higher.')
    alert('If you get dealt a 4, you will get: a 5.3 multiplier if you guess lower, and a 1.1 if you guess higher.')
    alert('If you get dealt a 5, you will get: a 3.5 multiplier if you guess lower, and a 1.1 if you guess higher.')
    alert('If you get dealt a 6, you will get: a 2.6 multiplier if you guess lower, and a 1.3 if you guess higher.')
    alert('If you get dealt a 7, you will get: a 2.1 multiplier if you guess lower, and a 1.5 if you guess higher.')
    alert('If you get dealt a 8, you will get: a 1.7 multiplier if you guess lower, and a 1.7 if you guess higher.')
    alert('If you get dealt a 9, you will get: a 1.5 multiplier if you guess lower, and a 2.1 if you guess higher.')
    alert('If you get dealt a 10, you will get: a 1.3 multiplier if you guess lower, and a 2.6 if you guess higher.')
    alert('If you get dealt a Jack, you will get: a 1.1 multiplier if you guess lower, and a 3.5 if you guess higher.')
    alert('If you get dealt a Queen, you will get: a 1.1 multiplier if you guess lower, and a 5.3 if you guess higher.')
    alert('If you get dealt a King, you will get: a 1.1 multiplier if you guess lower, and a 10.7 if you guess higher.')
    TheActualForRealsiesHighLow()
  }

  function TheActualForRealsiesHighLow() {
    shuffle(sortedDeck)
    alert('You got a ' + shuffledDeck[1][2] + '.')
    valueNum = tempVal
    answer = prompt('Higher or Lower?', 'Higher, Lower').toUpperCase()
    switch (answer) {
      case 'HIGHER':
        highLow = 1
        IsHigher()
        break;
      case 'LOWER':
        highLow = 0
        IsHigher()
        break;
      default:
        NotAnOption()
        alert('Picking a new card…')
        TheActualForRealsiesHighLow()
    }
  }

  function IsHigher() {
    if (shuffledDeck[1][1] > shuffledDeck[2][1]) {
      if (highLow === 1) {
        alert('Right!')
        Winnings('high')
      } else {
        alert('Wrong. :(')
        bet = 0
        PlayMore()
      }
    } else {
      if (highLow === 0) {
        alert('Right!')
        Winnings('low')
      } else {
        alert('Wrong. :(')
        bet = 0
        PlayMore()
      }
    }
  }

  function Winnings(which) {
    if (which === 'high') {
      switch (shuffledDeck[1][1]) {
        case 3:
        case 4:
        case 5:
          bet *= 1.1
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 6:
          bet *= 1.3
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 7:
          bet *= 1.5
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 8:
          bet *= 1.7
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 9:
          bet *= 2.1
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 10:
          bet *= 2.6
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 11:
          bet *= 3.5
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 12:
          bet *= 5.3
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 13:
          bet *= 10.7
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
      }
      PlayMore('high or low')
    } else {
      switch (shuffledDeck[1][1]) {
        case 13:
        case 12:
        case 11:
          bet *= 1.1
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 10:
          bet *= 1.3
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 9:
          bet *= 1.5
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 8:
          bet *= 1.7
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 7:
          bet *= 2.1
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 6:
          bet *= 2.6
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 5:
          bet *= 3.5
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 4:
          bet *= 5.3
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
        case 3:
          bet *= 10.7
          bet = Math.floor(bet)
          alert('You have ' + bet + ' gold in the bank.')
          break;
      }
      PlayMore('high or low')
    }
  }

  function PlayMore(what) {
    answer = prompt('Would you like to take your money or continue?', 'Take Money, Continue').toUpperCase()
    switch (answer) {
      case 'TAKE MONEY':
        alert('You won ' + bet + ' gold.')
        totalGold += bet
        usedCards = []
        InCasino()
        break;
      case 'CONTINUE':
        TheActualForRealsiesHighLow()
        break;
      default:
        NotAnOption()
        PlayMore()
    }
  }

  function blackjack() {
    shuffle(sortedDeck)
    hand1.push(shuffledDeck[1])
    hand1.push(shuffledDeck[2])
    hand2.push(shuffledDeck[3])
    hand2.push(shuffledDeck[4])
    alert('You have a ' + hand1[1][2] + ' and a ' + hand1[2][2] + '. The dealer can see the ' + hand1[1][2] + '.')
    alert('Your opponent has a ' + hand2[3][2] + '.')
    AIHit()
    answer = prompt('Do you want a hit?', 'Yes, No').toUpperCase()
    switch (answer) {
      case 'YES':
        firstHit()
        break;
      case 'NO':
        evaluateBlackjack()
        break;
      default:
        NotAnOption()
        break;
    }
  }

  function firstHit() {
    hand1.push(shuffledDeck[52])
    alert('You got a ' + hand1[3][2] + '. You now have a ' + hand1[1][2] + ', a ' + hand1[2][2] + ', and a ' + hand1[3][2] + '.')
    AIHit()
    answer = prompt('Do you want another hit?', 'Yes, No').toUpperCase()
    switch (answer) {
      case 'YES':
        hit()
        break;
      case 'NO':
        evaluateBlackjack()
        break;
      default:
        NotAnOption()
        break;
    }
  }

  function evaluateBlackjack() {
    alert('Sorry, that hasn\'t been implemented yet.')
  }

  function AIHit() {
    AITotal = 0
    while(AITotal <= 17) {
      for (i = hand2.length - 1; i > 0; i -= 1) {
        AITotal += hand2[i][4]
      }
      if (AITotal <= 17) {
        hand2.push(shuffledDeck[5])
      }
    }
  }

  function slotsStart() {

  }
  chooseGame()
}
Casino()
