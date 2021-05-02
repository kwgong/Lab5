// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');
const grey = document.getElementById("image-wrapper");
//const obj = getDimmensions(400,400, canvas.width, canvas.height);

const inp = document.getElementById("image-input");

const top = document.getElementById("text-top");
const bottom = document.getElementById("text-bottom");

const form = document.getElementById("generate-meme");
const gen = document.querySelector("button"); 
const clear = document.getElementById("button-group").firstElementChild;
const read = document.getElementById("button-group").lastElementChild;
const voice = document.getElementById("voice-selection");

const volume = document.getElementById("volume-group");
const slider = volume.lastElementChild;
const vol_img = volume.firstElementChild;


console.log(slider.attributes);

voice.disabled = false;

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load',(event) => {
  // TODO 
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  const obj = getDimmensions(400, 400, img.width, img.height);

  ctx.drawImage(img, obj.startX, obj.startY, obj.width, obj.height);
  clear.disabled = false;

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

//Adds src to img
inp.addEventListener('change', (event) => {
  img.src = URL.createObjectURL(inp.files[0]); 
});


var synth = window.speechSynthesis;
var voiceSelect = document.querySelector('select');
var voices = [];
var str = top.value + " " + bottom.value;
var utterThis = new SpeechSynthesisUtterance(str);
var vol = slider.value;

slider.addEventListener('click', (event) => {
  vol = slider.value / 100;

  if(vol >= .34 || vol <= .66){
    vol_img.src = "icons/volume-level-2.svg";
  }
  else if(vol >= .01 || vol <= .33){
    vol_img.src = "icons/volume-level-1.svg";
  }
  else if(vol == 0){
    vol_img.src = "icons/volume-level-0.svg";
  }
  else{
    vol_img.src = "icons/volume-level-3.svg";
  }
});

function populateVoiceList() {
  voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    //console.log(voices[i]);
    if(voices[i].name == "Google US English") {
      option.textContent += ' -- DEFAULT';
      option.selected = voices[i] + ' --DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

var synth = window.speechSynthesis;
var voiceSelect = document.querySelector('select');
var voices = [];
var vol = slider.value;


slider.addEventListener('click', (event) => {
  vol = slider.value / 100;

  if(vol >= .34 && vol <= .66){
    vol_img.src = "icons/volume-level-2.svg";
  }
  else if(vol >= .01 && vol <= .33){
    vol_img.src = "icons/volume-level-1.svg";
  }
  else if(vol == 0){
    vol_img.src = "icons/volume-level-0.svg";
  }
  else{
    vol_img.src = "icons/volume-level-3.svg";
  }
});

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

read.onclick = function(event) {
  event.preventDefault();

  var str = top.value + " " + bottom.value;
  var utterThis = new SpeechSynthesisUtterance(str);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }

  //var vol = 100;
  utterThis.volume = vol;
  synth.speak(utterThis);
}




//Method to add text to screen
form.addEventListener('submit', (event) => {
  ctx.font = '50px serif';
  ctx.fillStyle = "white";
  /*if(img != null){
    ctx.fillText(`${form.elements[1].value}`, (canvas.width/2) - 45, canvas.height-img.height);
    ctx.fillText(`${form.elements[2].value}`, (canvas.width/2) - 45, canvas.height - 20);
  }
  else{*/
    ctx.fillText(`${form.elements[1].value}`, (canvas.width/2) - 30, 80);
    ctx.strokeText(`${form.elements[1].value}`,(canvas.width/2) - 30, 80);
    ctx.fillText(`${form.elements[2].value}`, (canvas.width/2) - 30, canvas.height - 20);
    ctx.strokeText(`${form.elements[2].value}`,(canvas.width/2) - 30, canvas.height - 20);
  //}
  ctx.textAlign = "center";
  clear.disabled = false;
  read.disabled = false;
  voices.disabled = false;
  event.preventDefault();
});

//Method to clear things
clear.addEventListener('click', (event) =>{
  top.value = "";
  bottom.value = "";
  ctx.clearRect(0,0,canvas.width, canvas.height);
  clear.disabled = true;
  read.disabled = true;
  inp.value = "";
});





/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
