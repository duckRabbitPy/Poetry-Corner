const msg = new SpeechSynthesisUtterance();
let voices = [];
const voicesDropdown = document.querySelector('[name="voice"]');
const options = document.querySelectorAll('[type="range"], [name="text"]');
const fetchButton = document.querySelector("#fetch");
const speakButton = document.querySelector("#speak");
const stopButton = document.querySelector("#stop");
const loader = document.querySelector(".loader");

function fetchPoem() {
  loader.style.display = "block";
  setCurrentText();
}

async function setCurrentText() {
  let newPoem = await fetch("https://www.poemist.com/api/v1/randompoems")
    .then((response) => response.json())
    .then((data) => {
      return data[0].content;
    });
  populateVoices();
  msg.text = newPoem;
  document.querySelector('[name="text"]').value = newPoem;
  loader.style.display = "none";
}

function populateVoices() {
  voices = speechSynthesis.getVoices();
  voicesDropdown.innerHTML = voices
    .filter((voice) => voice.lang.includes("en"))
    .map(
      (voice) =>
        `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`
    )
    .join("");
}

function setVoice() {
  msg.voice = voices.find((voice) => voice.name === this.value);
  toggle();
}

function toggle(startOver = true) {
  speechSynthesis.cancel();
  if (startOver) {
    speechSynthesis.speak(msg);
  }
}

function setOption() {
  console.log(this.name, this.value);
  msg[this.name] = this.value;
  toggle();
}

speechSynthesis.addEventListener("voiceschanged", populateVoices);
voicesDropdown.addEventListener("change", setVoice);
options.forEach((option) => option.addEventListener("change", setOption));
fetchButton.addEventListener("click", fetchPoem);
speakButton.addEventListener("click", toggle);
stopButton.addEventListener("click", () => toggle(false));
