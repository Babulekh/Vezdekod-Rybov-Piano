const whiteKeyCodes = ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"];
const blackKeyCodes = ["Digit2", "Digit3", "Digit5", "Digit6", "Digit7", "Digit9", "Digit0", "Equal"];
const whiteKeyNotes = ["Piano.ff.C3", "Piano.ff.D3", "Piano.ff.E3", "Piano.ff.F3", "Piano.ff.G3", "Piano.ff.A3", "Piano.ff.B3", "Piano.ff.C4", "Piano.ff.D4", "Piano.ff.E4", "Piano.ff.F4", "Piano.ff.G4"];
const blackKeyNotes = ["Piano.ff.Db3", "Piano.ff.Eb3", "Piano.ff.Gb3", "Piano.ff.Ab3", "Piano.ff.Bb3", "Piano.ff.Db3", "Piano.ff.Eb3", "Piano.ff.Gb3"];

const whiteKeys = document.querySelectorAll(".whiteKey");
const blackKeys = document.querySelectorAll(".blackKey");

class pianoKey {
    constructor(code, sound, category) {
        this.code = code;
        this.code = sound;
        this.category = category;
    }
}

function keyboardKeyPressed(event) {
    if (whiteKeyCodes.indexOf(event.code) != -1) {
        whiteKeys[whiteKeyCodes.indexOf(event.code)].classList.add("active");
        let sound = new Audio("./sounds/" + whiteKeyNotes[whiteKeyCodes.indexOf(event.code)] +".mp3");
        sound.addEventListener("ended", () => console.log("ended"));
        sound.play();
    }

    if (blackKeyCodes.indexOf(event.code) != -1) {
        blackKeys[blackKeyCodes.indexOf(event.code)].classList.add("active");
        let sound = new Audio("./sounds/" + blackKeyNotes[blackKeyCodes.indexOf(event.code)] +".mp3");
        sound.addEventListener("ended", () => console.log("ended"));
        sound.play();
    }
}

function keyboardKeyReleased(event) {
    if (whiteKeyCodes.indexOf(event.code) != -1) {
        whiteKeys[whiteKeyCodes.indexOf(event.code)].classList.remove("active");
    }

    if (blackKeyCodes.indexOf(event.code) != -1) {
        blackKeys[blackKeyCodes.indexOf(event.code)].classList.remove("active");
    }
}

function keyPressed(event) {
    event.currentTarget.classList.add("active");
    //Проигрывать звук, Убирать класс когда кончается звук клавиши
}

function keyReleased(event) {
    event.currentTarget.classList.remove("active");
    //Прекращать играть звук клавиши
}

for (let wki = 0; wki < whiteKeys.length; wki++) {
    whiteKeys[wki].addEventListener("mousedown", keyPressed);
    whiteKeys[wki].addEventListener("mouseup", keyReleased);
}

for (let bki = 0; bki < blackKeys.length; bki++) {
    blackKeys[bki].addEventListener("mousedown", keyPressed);
    blackKeys[bki].addEventListener("mouseup", keyReleased);
}

window.addEventListener("keydown", keyboardKeyPressed);
window.addEventListener("keyup", keyboardKeyReleased);
