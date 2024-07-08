const main_box = document.querySelector(".main_box"),
music_image = main_box.querySelector(".img-area img"),
music_name = main_box.querySelector(".song_details .name"),
music_artist = main_box.querySelector(".song_details .artist"),
play_pause_button = main_box.querySelector(".play_pause"),
previous_button = main_box.querySelector("#previous"),
next_button = main_box.querySelector("#next"),
main_audio = main_box.querySelector("#main-audio"),
progress_area = main_box.querySelector(".progress_box"),
progress_bar = progress_area.querySelector(".progress_bar"),
music_list = main_box.querySelector(".music-list"),
moremusic_button = main_box.querySelector("#more_music"),
close_moremusic = music_list.querySelector("#close");

let music_index = Math.floor((Math.random() * music_songs.length) + 1);
isMusicPaused = true;

window.addEventListener("load", ()=>{
  loadMusic(music_index);
  playingSong(); 
});

function loadMusic(indexNumb){
  music_name.innerText = music_songs[indexNumb - 1].name;
  music_artist.innerText = music_songs[indexNumb - 1].artist;
  music_image.src = `images/${music_songs[indexNumb - 1].src}.jpg`;
  main_audio.src = `songs/${music_songs[indexNumb - 1].src}.mp3`;
}

//play music function
function play_music(){
  main_box.classList.add("paused");
  play_pause_button.querySelector("i").innerText = "pause";
  main_audio.play();
}

//pause music function
function pause_music(){
  main_box.classList.remove("paused");
  play_pause_button.querySelector("i").innerText = "play_arrow";
  main_audio.pause();
}

//previous music function
function previous_music(){
  music_index--; //decrement of music_index by 1
  //if music_index is less than 1 then music_index will be the array length so the last music play
  music_index < 1 ? music_index = music_songs.length : music_index = music_index;
  loadMusic(music_index);
  play_music();
  playingSong(); 
}

//next music function
function next_music(){
  music_index++; //increment of music_index by 1
  //if music_index is greater than array length then music_index will be 1 so the first music play
  music_index > music_songs.length ? music_index = 1 : music_index = music_index;
  loadMusic(music_index);
  play_music();
  playingSong(); 
}

// play or pause button event
play_pause_button.addEventListener("click", ()=>{
  const isMusicPlay = main_box.classList.contains("paused");
  //if isplay_music is true then call pause_music else call play_music
  isMusicPlay ? pause_music() : play_music();
  playingSong();
});

//previous music button event
previous_button.addEventListener("click", ()=>{
  previous_music();
});

//next music button event
next_button.addEventListener("click", ()=>{
  next_music();
});

// update progress bar width according to music current time
main_audio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; //getting playing song currentTime
  const duration = e.target.duration; //getting playing song total duration
  let progressWidth = (currentTime / duration) * 100;
  progress_bar.style.width = `${progressWidth}%`;

  let musicCurrentTime = main_box.querySelector(".current_time"),
  musicDuartion = main_box.querySelector(".max_duration");
  main_audio.addEventListener("loadeddata", ()=>{
    // update song total duration
    let mainAdDuration = main_audio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if(totalSec < 10){ //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });
  // update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){ //if sec is less than 10 then add 0 before it
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song currentTime on according to the progress bar width
progress_area.addEventListener("click", (e)=>{
  let progressWidth = progress_area.clientWidth; //getting width of progress bar
  let clickedOffsetX = e.offsetX; //getting offset x value
  let songDuration = main_audio.duration; //getting song total duration
  
  main_audio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  play_music(); //calling play_music function
  playingSong();
});

//change loop, shuffle, repeat icon onclick
const repeatBtn = main_box.querySelector("#repeat_playlist");
repeatBtn.addEventListener("click", ()=>{
  let get_text = repeatBtn.innerText; //getting this tag innerText
  switch(get_text){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//code for what to do after song ended
main_audio.addEventListener("ended", ()=>{
  // we'll do according to the icon means if user has set icon to
  // loop song then we'll repeat the current song and will do accordingly
  let get_text = repeatBtn.innerText; //getting this tag innerText
  switch(get_text){
    case "repeat":
      next_music(); //calling next_music function
      break;
    case "repeat_one":
      main_audio.currentTime = 0; //setting audio current time to 0
      loadMusic(music_index); //calling loadMusic function with argument, in the argument there is a index of current song
      play_music(); //calling play_music function
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.random() * music_songs.length) + 1); //genereting random index/numb with max range of array length
      do{
        randIndex = Math.floor((Math.random() * music_songs.length) + 1);
      }while(music_index == randIndex); //this loop run until the next random number won't be the same of current music_index
      music_index = randIndex; //passing randomIndex to music_index
      loadMusic(music_index);
      play_music();
      playingSong();
      break;
  }
});

//show music list onclick of music icon
moremusic_button.addEventListener("click", ()=>{
  music_list.classList.toggle("show");
});
close_moremusic.addEventListener("click", ()=>{
  moremusic_button.click();
});

const ul_tag = main_box.querySelector("ul");
// let create li tags according to array length for list
for (let i = 0; i < music_songs.length; i++) {
  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${music_songs[i].name}</span>
                  <p>${music_songs[i].artist}</p>
                </div>
                <span id="${music_songs[i].src}" class="audio-duration">3:40</span>
                <audio class="${music_songs[i].src}" src="songs/${music_songs[i].src}.mp3"></audio>
              </li>`;
  ul_tag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag

  let li_audio_duration_tag = ul_tag.querySelector(`#${music_songs[i].src}`);
  let liAudioTag = ul_tag.querySelector(`.${music_songs[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    };
    li_audio_duration_tag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
    li_audio_duration_tag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
  });
}

//play particular song from the list onclick of li tag
function playingSong(){
  const all_li_tag = ul_tag.querySelectorAll("li");
  
  for (let j = 0; j < all_li_tag.length; j++) {
    let audioTag = all_li_tag[j].querySelector(".audio-duration");
    
    if(all_li_tag[j].classList.contains("playing")){
      all_li_tag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    //if the li tag index is equal to the music_index then add playing class in it
    if(all_li_tag[j].getAttribute("li-index") == music_index){
      all_li_tag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    all_li_tag[j].setAttribute("onclick", "clicked(this)");
  }
}

//particular li clicked function
function clicked(element){
  let get_li_index = element.getAttribute("li-index");
  music_index = get_li_index; //updating current song index with clicked li index
  loadMusic(music_index);
  play_music();
  playingSong();
}