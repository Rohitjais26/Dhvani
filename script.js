console.log("Starting")

let CurrentSong = new Audio();
let songs;
let currFolder;


function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    // Pad minutes and seconds to ensure two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder){
    currFolder = folder;
    //fetch the HTML content from the server
    let a = await fetch(`http://127.0.0.1:5501/${folder}/`)
    let response = await a.text();
    //Parse the HTML to extract the song links
    let div = document.createElement("div")
    div.innerHTML = response
    let as =  div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    } 
    
    //putting the songs into the playlist//
    let songUL = document.querySelector(".PlayerList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song}</div>
                                <div>ROHIT</div>
                            </div>
                            <div class="playnow">
                                <span>play now</span>
                                <img class="invert" src="paly.svg" alt="">
                                
                            </div></li>`
        
    }

//attaching the event listeners to each songs
Array.from(document.querySelector(".PlayerList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click",element =>{
        console.log(e.querySelector(".info").firstElementChild .innerHTML)
        PlayMusic(e.querySelector(".info").firstElementChild .innerHTML.trim())
    })
    
    
    
});
}
 

const PlayMusic = (track , pause = false) => {
    // Correctly set the path to the MP3 file
    //let audio = new Audio("/songs/" + track);
    CurrentSong.src = `/${currFolder}/` + track;
    if (!pause){
        CurrentSong.play()
         play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

/*async function displayalbum() {
    let a = await fetch(`http://127.0.0.1:5501/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let cardContainer = document.querySelector(".cardContainer")
    let anchors = div.getElementsByTagName("a")
    Array.from(anchors).forEach( async e=>{ 
        
        if(e.href.includes("/songs")){
           let folder = e.href.split("/").slice(-2)[1]

           //get the metadata for folder
           let a = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`)
           let response = await a.json();
           console.log(response)
           cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="fav" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <circle cx="12" cy="12" r="12" fill="green" />
                                <g transform="scale(0.85) translate(1.8, 1.8)">
                                    <circle cx="12" cy="12" r="10" stroke="black" stroke-width="1.5" fill="none" />
                                    <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="black" />
                                </g>
                            </svg>
                        </div>
                        <img aria-hidden="false" draggable="false" loading="eager" src="songs/${folder}/cover.jpg" alt="Lord Shiva Playlist " class="mMx2LUixlnN_Fu45JpFB CmkY1Ag0tJDfnFXbGgju _EShSNaBK1wUIaZQFJJQ Yn2Ei5QZn19gria6LjZj" sizes="(min-width: 1280px) 232px, 192px">
                        <h2>${response.Title}</h2>
                        <p>${response.Description}</p>
                    </div>`
        }
    })
    
   
    
}
    */

async function main(){

    await getSongs("songs/fav")
    PlayMusic(songs[1], true)

    //displayalbum()

//attaching the event listeners to play ,pause and next elements
play.addEventListener("click", ()=>{
    if(CurrentSong.paused){
        CurrentSong.play()
        play.src = "pause.svg"
    }else{
        CurrentSong.pause()
        play.src = "paly.svg"
    }
})

// add event listener for currenttime and duration
CurrentSong.addEventListener("timeupdate" , ()=>{
    console.log(CurrentSong.currentTime , CurrentSong.duration)
    document.querySelector(".songtime").innerHTML = `${formatTime(CurrentSong.currentTime)} /${formatTime(CurrentSong.duration)}`
    document.querySelector(".circle").style.left = (CurrentSong.currentTime / CurrentSong.duration) * 100 + "%"

})
// add event listener to seekbar
document.querySelector(".seekbar").addEventListener("click" , e=>{
    let percent = (e.offsetX / e.target.getBoundingClientRect().width ) * 100 
    document.querySelector(".circle").style.left = percent + "%"
    CurrentSong.currentTime = ((CurrentSong.duration) * percent)/100
})

// add event listener to hamburger
document.querySelector(".hamburger").addEventListener("click", e=>{
    document.querySelector(".left").style.left = "0"
})

// add event listener to close  button
document.querySelector(".close").addEventListener("click", e=>{
    document.querySelector(".left").style.left = "-120%"
})

//add event listener to previous button
previous.addEventListener("click", ()=>{
    console.log("previous clicked")
    console.log(CurrentSong)

    let index = songs.indexOf(CurrentSong.src.split("/").slice(-1) [0])
    if((index-1)>=0){
        PlayMusic(songs[index-1])
    }
})

//add event listener to next button
next.addEventListener("click", ()=>{
   CurrentSong.pause();
    console.log("next clicked")
    

    let index = songs.indexOf(CurrentSong.src.split("/").slice(-1) [0])
    if((index+1)< songs.length) {
        PlayMusic(songs[index+1])
    }
})

// add event listeners to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("changed",(e)=>{
    console.log("Setting volume to", e.target.value, "/ 100")
    CurrentSong.volume = parseInt(e.target.value)/100
})

//load the playlist whenever its click 
Array.from(document.getElementsByClassName("card")).forEach(e=>{
    console.log(e)
    e.addEventListener("click", async item=>{ 
        console.log(item , item.currentTarget.dataset)
        songs =  await getSongs(`songs/${item.currentTarget.dataset.folder}`);   
    })
})

    
}
main()