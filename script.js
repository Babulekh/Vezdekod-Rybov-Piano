const whiteKeyCodes = ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"];
const blackKeyCodes = ["Digit2", "Digit3", "Digit5", "Digit6", "Digit7", "Digit9", "Digit0", "Equal"];
const whiteKeyNotes = ["Piano.ff.C3", "Piano.ff.D3", "Piano.ff.E3", "Piano.ff.F3", "Piano.ff.G3", "Piano.ff.A3", "Piano.ff.B3", "Piano.ff.C4", "Piano.ff.D4", "Piano.ff.E4", "Piano.ff.F4", "Piano.ff.G4"];
const blackKeyNotes = ["Piano.ff.Db3", "Piano.ff.Eb3", "Piano.ff.Gb3", "Piano.ff.Ab3", "Piano.ff.Bb3", "Piano.ff.Db4", "Piano.ff.Eb4", "Piano.ff.Gb4"];

const whiteKeys = document.querySelectorAll(".whiteKey");
const blackKeys = document.querySelectorAll(".blackKey");

const pianoKeys = [];

class pianoKey {
    constructor(DOMObject, code, sound, category) {
        this.DOMObject = DOMObject;
        this.code = code;
        this.sound = new Audio("./sounds/" + sound + ".mp3");

        this.DOMObject.addEventListener("mousedown", this.pianoKeyPressed.bind(this));
        this.DOMObject.addEventListener("mouseup", this.pianoKeyReleased.bind(this));
    };
};

pianoKey.prototype.pianoKeyPressed = function () {
    this.DOMObject.classList.add("active");
    this.sound.currentTime = 0;
    this.sound.play();
};

pianoKey.prototype.pianoKeyReleased = function () {
    this.DOMObject.classList.remove("active");
    // this.sound.pause();
};

for (let wki = 0; wki < whiteKeys.length; wki++) {
    let key = new pianoKey(whiteKeys[wki], whiteKeyCodes[wki], whiteKeyNotes[wki]);
    pianoKeys.push(key);
};

for (let bki = 0; bki < blackKeys.length; bki++) {
    let key = new pianoKey(blackKeys[bki], blackKeyCodes[bki], blackKeyNotes[bki]);
    pianoKeys.push(key);
};

function keyboardKeyPressed(event) {
    if (event.repeat) return;
    pianoKeys.find(element => {return event.code == element.code;})?.pianoKeyPressed();
};

function keyboardKeyReleased(event) {
    pianoKeys.find(element => {return event.code == element.code;})?.pianoKeyReleased();
};

window.addEventListener("keydown", keyboardKeyPressed);
window.addEventListener("keyup", keyboardKeyReleased);
