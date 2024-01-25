const songName = document.getElementById("name-music");
const song = document.getElementById("audio");
const bandName = document.getElementById("name-band");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const skip = document.getElementById("skip");
const back = document.getElementById("start");
const likeButton = document.getElementById('like');
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');


const tempoPerdido = {
    songName: 'Tempo Perdido',
    artist: 'Legião Urbana',
    file: 'tempo_perdido',
    liked: false,
  };
  const quePaiseEsse = {
    songName: 'Que País é Esse',
    artist: 'Capital Inicial',
    file: 'que_pais_e_esse',
    liked: false,
  };
  const soHoje = {
    songName: "Só Hoje",
    artist: 'Capital Inicial',
    file: 'so_hoje',
    liked: false,
  };
  let isPlaying = false;
  let isShuffled = false;
  let repeatOn = false;
  const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [tempoPerdido, quePaiseEsse, soHoje];
  let sortedPlaylist = [...originalPlaylist];
  let index = 0;

function playSong(){
    play.querySelector('.bi').classList.remove('bi-play-circle');
    play.querySelector('.bi').classList.add('bi-pause-circle');
    song.play();
    isPlaying = true;
}

function pauseSong() {
    play.querySelector('.bi').classList.add('bi-play-circle');
    play.querySelector('.bi').classList.remove('bi-pause-circle');
    song.pause();
    isPlaying = false;
  }

function playPauseDecider() {
  if (isPlaying === true) {
    pauseSong();
  } else {
    playSong();
  }
}

function initializeSong() {
    cover.src = `imagem/${sortedPlaylist[index].file}.jpg`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
  }

  function previousSong() {
    if (index === 0) {
      index = sortedPlaylist.length - 1;
    } else {
      index -= 1;
    }
    initializeSong();
    playSong();
  }

function nextSong() {
  if (index === sortedPlaylist.length - 1) {
    index = 0;
  } else {
    index += 1;
  }
  initializeSong();
  playSong();
}

function updatePrograss(){ 
    const barWidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event){
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX
    const jumpToTime = (clickPosition/width)* song.duration;
    song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while (currentIndex > 0) {
      let randomIndex = Math.floor(Math.random() * size);
      let aux = preShuffleArray[currentIndex];
      preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
      preShuffleArray[randomIndex] = aux;
      currentIndex -= 1;
    }
  }

  function shuffleButtonClicked() {
    if (isShuffled === false) {
      isShuffled = true;
      shuffleArray(sortedPlaylist);
      shuffleButton.classList.add('button-active');
    } else {
      isShuffled = false;
      sortedPlaylist = [...originalPlaylist];
      shuffleButton.classList.remove('button-active');
    }
  }

  function repeatButtonCllicked(){
    if (repeatOn === false) {
      repeatOn = true;
      repeatButton.classList.add('button-active');
    } else {
      repeatOn = false;
      repeatButton.classList.remove('button-active');
    }
  }
  function nextOrRepeat(){
    if (repeatOn === false) {
      nextSong();
    } else {
      playSong();
    }
  }
  
  function toHHMMSS(originalNumber){
    let hours = Math.floor(originalNumber/3600);
    let min = Math.floor((originalNumber - hours*3600)/60);
    let secs = Math.floor(originalNumber - hours*3600 - min*60);

    return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
  }

  function likeButtonRender() {
    if (sortedPlaylist[index].liked === true){
      likeButton.querySelector('.bi').classList.remove('bi-suit-heart');
      likeButton.querySelector('.bi').classList.add('bi-suit-heart-fill');
      likeButton.classList.add('button-active');
    }
    else{
      likeButton.querySelector('.bi').classList.add('bi-suit-heart');
      likeButton.querySelector('.bi').classList.remove('bi-suit-heart-fill');
      likeButton.classList.remove('button-active');
    }
  }
  
  function likeButtonCliked() {
    if (sortedPlaylist[index].liked === false){
      (sortedPlaylist[index].liked = true);
    } else {
      (sortedPlaylist[index].liked = false);
    }
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
  }
initializeSong();

play.addEventListener('click', playPauseDecider);
back.addEventListener('click', previousSong);
skip.addEventListener('click', nextSong ); 
song.addEventListener('timeupdate', updatePrograss);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonCllicked);
likeButton.addEventListener('click', likeButtonCliked);