//Data
const whiteKeyCodes = ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "KeyA", "KeyS"];
const blackKeyCodes = ["Digit2", "Digit3", "Digit5", "Digit6", "Digit7", "Digit9", "Digit0", "Equal"];
const whiteKeyNotes = ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4"];
const blackKeyNotes = ["Db3", "Eb3", "Gb3", "Ab3", "Bb3", "Db4", "Eb4", "Gb4", "Ab4", "Bb4"];
let melodySrc = "psk.xml";
let xmldoc;

//Ui
const whiteKeys = document.querySelectorAll(".whiteKey");
const blackKeys = document.querySelectorAll(".blackKey");

const playBackButton = document.querySelector(".playBackButton");

//Piano and keys classes
class Piano {
    constructor(whiteKeyCodes, blackKeyCodes, whiteKeyNotes, blackKeyNotes) {
        this.pianoKeys = [];
        this.currentIndex = 0;
        this.timer;

        for (let wki = 0; wki < whiteKeys.length; wki++) {
            let key = new pianoKey(whiteKeys[wki], whiteKeyCodes[wki], whiteKeyNotes[wki]);
            this.pianoKeys.push(key);
        };

        for (let bki = 0; bki < blackKeys.length; bki++) {
            let key = new pianoKey(blackKeys[bki], blackKeyCodes[bki], blackKeyNotes[bki]);
            this.pianoKeys.push(key);
        };
    };
};

Piano.prototype.startPlayback = function () {
    let sequence = xmldoc.querySelectorAll("measure");
    let melody = [];

    for (let beat of sequence) {
        let notes = beat.querySelectorAll("note pitch");

        for (let note of notes) {
            let key = this.pianoKeys.find((element) => {
                return String(note.querySelector("step").innerHTML) + String(note.querySelector("octave").innerHTML) == element.note;
            });

            melody.push(this.pianoKeys.indexOf(key));
        };
    };

    this.timer = setInterval(() => {
        this.playNote(melody);
    }, 300);
};

Piano.prototype.playNote = function(melody) {
    if(this.currentIndex == melody.length) {
        this.currentIndex = 0;
        clearInterval(this.timer);
        playBackButton.removeAttribute("disabled");
        return;
    }

    let key = this.pianoKeys[melody[this.currentIndex]];

    key.pianoKeyPressed();
    setTimeout(key.pianoKeyReleased.bind(key), 298);

    this.currentIndex++;
};

class pianoKey {
    constructor(DOMObject, code, sound) {
        this.DOMObject = DOMObject;
        this.code = code;
        this.sound = new Audio("./sounds/Piano.ff." + sound + ".mp3");
        this.note = sound;

        this.DOMObject.addEventListener("mousedown", this.pianoKeyPressed.bind(this));
        this.DOMObject.addEventListener("mouseup", this.pianoKeyReleased.bind(this));
    }
}

pianoKey.prototype.pianoKeyPressed = function () {
    if (this.DOMObject.classList.contains("active")) return;

    this.DOMObject.classList.add("active");
    this.sound.currentTime = 0;
    this.sound.play();
};

pianoKey.prototype.pianoKeyReleased = function () {
    this.DOMObject.classList.remove("active");
};

let piano = new Piano(whiteKeyCodes, blackKeyCodes, whiteKeyNotes, blackKeyNotes);

//Ui bindings
function keyboardKeyPressed(event) {
    if (event.repeat) return;
    piano.pianoKeys
        .find((element) => {
            return event.code == element.code;
        })
        ?.pianoKeyPressed();
}

function keyboardKeyReleased(event) {
    piano.pianoKeys
        .find((element) => {
            return event.code == element.code;
        })
        ?.pianoKeyReleased();
}

window.addEventListener("keydown", keyboardKeyPressed);
window.addEventListener("keyup", keyboardKeyReleased);

function parseXML(event) {
    event.currentTarget.setAttribute("disabled", "");

    let xhr = new XMLHttpRequest();
    xhr.open("GET", melodySrc);
    xhr.send();

    xhr.onload = () => {
        let parser = new DOMParser();
        xmldoc = parser.parseFromString(xhr.responseText, "text/xml");
        piano.startPlayback();
    };
}

playBackButton.addEventListener("click", parseXML);
