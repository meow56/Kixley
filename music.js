export { loadMusic, playMusic };

function Song(name, source) {
  this.name = name;
  this.src = source;
  
  this.play = function() {
    this.src.play();
  }
  
  this.pause = function() {
    this.src.pause();
    this.src.currentTime = 0;
  }
}

var songs = [new Song("Fight"), 
             new Song("Tower"), 
             new Song("Places"), 
             new Song("Menu"), 
             new Song("Town"), 
             new Song("Inn"), 
             new Song("Marketplace"), 
             new Song("GameOver"), 
             new Song("End")];

function loadMusic() {
  for(var i = 0; i < songs.length; i++) {
    songs[i].src = document.getElementById(songs[i].name + "Music");
  }
}

function playMusic(which) { // string with the name
  if(currentlyPlaying() !== which) {
    for(var i = 0; i < songs.length; i++) {
      songs[i].pause();
      if(songs[i].name === which) {
        songs[i].play();
      }
    }
  }
}

function currentlyPlaying() {
  for(var i = 0; i < songs.length; i++) {
    if(songs[i].paused) {
      return songs[i].name;
    }
  }
  return "None";
}
