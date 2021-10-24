//Data
const whiteKeyCodes = ["Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Enter", "Delete"];
const blackKeyCodes = ["Digit2", "Digit3", "Digit5", "Digit6", "Digit7", "Digit9", "Digit0", "Equal", "Backspace", "Insert"];
const whiteKeyNotes = ["B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4"];
const blackKeyNotes = ["Db3", "Eb3", "Gb3", "Ab3", "Bb3", "Db4", "Eb4", "Gb4", "Ab4", "Bb4"];
let melodySrc = "melody.xml";
let xmldoc;
parseXML();
//Ui
const whiteKeys = document.querySelectorAll(".whiteKey");
const blackKeys = document.querySelectorAll(".blackKey");

const playBackButton = document.querySelector(".playBackButton");
const pianoRollButton = document.querySelector(".pianoRollButton");

//Piano and keys classes
class Piano {
    constructor(whiteKeyCodes, blackKeyCodes, whiteKeyNotes, blackKeyNotes) {
        this.pianoKeys = [];
        this.currentNote = 0;
        this.timer;
        this.noteDuration;
        this.melody = [];

        for (let wki = 0; wki < whiteKeys.length; wki++) {
            let key = new pianoKey(whiteKeys[wki], whiteKeyCodes[wki], whiteKeyNotes[wki]);
            this.pianoKeys.push(key);
        }

        for (let bki = 0; bki < blackKeys.length; bki++) {
            let key = new pianoKey(blackKeys[bki], blackKeyCodes[bki], blackKeyNotes[bki]);
            this.pianoKeys.push(key);
        }
    }
}

Piano.prototype.startPlayback = function () {
    let sequence = xmldoc.querySelectorAll("measure");
    this.noteDuration = 60000 / Number(xmldoc.querySelector("per-minute").innerHTML);
    this.melody = [];

    for (let beat of sequence) {
        let notes = beat.querySelectorAll("note pitch");

        for (let note of notes) {
            let key = this.pianoKeys.find((element) => {
                return String(note.querySelector("step").innerHTML) + String(note.querySelector("octave").innerHTML) == element.note;
            });

            let duration = note.parentNode.querySelector("duration").innerHTML;

            this.melody.push({ keyIndex: this.pianoKeys.indexOf(key), duration: (duration / 240) * this.noteDuration });
        }
    }

    this.playNote();
};

Piano.prototype.startPianoRoll = function () {
    let sequence = xmldoc.querySelectorAll("measure");
    this.noteDuration = 60000 / Number(xmldoc.querySelector("per-minute").innerHTML);
    this.melody = [];

    for (let beat of sequence) {
        let notes = beat.querySelectorAll("note pitch");

        for (let note of notes) {
            let key = this.pianoKeys.find((element) => {
                return String(note.querySelector("step").innerHTML) + String(note.querySelector("octave").innerHTML) == element.note;
            });

            let duration = note.parentNode.querySelector("duration").innerHTML;

            if (duration < 100) {
                duration *= 10;
            }

            this.melody.push({ keyIndex: this.pianoKeys.indexOf(key), duration: (duration / 240) * this.noteDuration });
        }
    }

    this.pianoRollTick();
};

Piano.prototype.playNote = function () {
    if (this.currentNote == this.melody.length) {
        this.currentNote = 0;
        playBackButton.removeAttribute("disabled");
        return;
    }

    if (this.melody[this.currentNote]["duration"] < 100) {
        this.melody[this.currentNote]["duration"] *= 10;
    }

    let key = this.pianoKeys[this.melody[this.currentNote]["keyIndex"]];
    let duration = this.melody[this.currentNote]["duration"];

    key.pianoKeyPressed(duration);
    setTimeout(key.pianoKeyReleased.bind(key), this.melody[this.currentNote]["duration"]);
    setTimeout(this.playNote.bind(this), this.melody[this.currentNote]["duration"]);

    this.currentNote++;
};

Piano.prototype.pianoRollTick = function () {
    if (this.currentNote == this.melody.length) {
        this.currentNote = 0;
        pianoRollButton.removeAttribute("disabled");
        return;
    }

    if (this.melody[this.currentNote]["duration"] < 100) {
        this.melody[this.currentNote]["duration"] *= 10;
    }

    let key = this.pianoKeys[this.melody[this.currentNote]["keyIndex"]];
    let duration = this.melody[this.currentNote]["duration"];

    key.pianoKeyPressed(duration);
    setTimeout(key.pianoKeyReleased.bind(key), this.melody[this.currentNote]["duration"]);
    setTimeout(this.playNote.bind(this), 10);

    this.currentNote++;
};

class pianoKey {
    constructor(DOMObject, code, sound) {
        this.DOMObject = DOMObject;
        this.code = code;
        this.note = sound;
        this.sound = playKey.bind(this, this.getPitch());

        this.DOMObject.addEventListener("mousedown", this.pianoKeyPressed.bind(this, 1));
        this.DOMObject.addEventListener("mouseup", this.pianoKeyReleased.bind(this, 1));
    }
}

pianoKey.prototype.getPitch = function () {
    let octave = this.note.charCodeAt(this.note.length - 1) - 48;
    let shift = this.note.charAt(0);
    let b = this.note.charCodeAt(1) == 98;
    shift += b ? "b" : "";
    let pitch;

    switch (shift) {
        case "C":
            pitch = 0;
            break;
        case "Db":
            pitch = 1;
            break;
        case "D":
            pitch = 2;
            break;
        case "Eb":
            pitch = 3;
            break;
        case "E":
            pitch = 4;
            break;
        case "F":
            pitch = 5;
            break;
        case "Gb":
            pitch = 6;
            break;
        case "G":
            pitch = 7;
            break;
        case "Ab":
            pitch = 8;
            break;
        case "A":
            pitch = 9;
            break;
        case "Bb":
            pitch = 10;
            break;
        case "B":
            pitch = 11;
            break;
    }

    pitch = octave * 12 + pitch;
    return pitch;
};

pianoKey.prototype.pianoKeyPressed = function (duration = 1.0) {
    if (this.DOMObject.classList.contains("active")) return;
    if (duration != 1) duration /= 1000;
    this.DOMObject.classList.add("active");
    this.sound(duration);
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
    event?.currentTarget.setAttribute("disabled", "");

    let xhr = new XMLHttpRequest();
    xhr.open("GET", melodySrc);
    xhr.send();
    let parser = new DOMParser();

    xhr.addEventListener("load", () => {
        xmldoc = parser.parseFromString(xhr.responseText, "text/xml");
    });
}

playBackButton?.addEventListener("click", () => {
    piano.startPlayback();
});
pianoRollButton?.addEventListener("click", () => {
    piano.startPianoRoll();
});
