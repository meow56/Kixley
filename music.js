export { loadMusic, playMusic };



var fightMusic;
var towerMusic;
var placesMusic;
var menuMusic;
var townMusic;
var innMusic;
var marketplaceMusic;
var gameOverMusic;
var endMusic;

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


