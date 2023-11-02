class KeyboardController extends HTMLDivElement {
	keyboard = null;
	
	constructor(){
		super();
	}

	connectedCallback(){
		let rootNote = this.getAttribute("root-note");
		let rootFreq = parseFloat(this.getAttribute("root-freq"));
		let keyCount = parseInt(this.getAttribute("key-count"));
		this.keyboard = new KeyboardKeys(rootNote, rootFreq, keyCount);
		this.appendChild(this.keyboard);
	}
}

class KeyboardKeys extends HTMLDivElement {
	keys = [];
	keyWidth = 30;
	whiteKeys = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
	blackKeys = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];

	constructor(rootNote, rootFreq, keyCount){
		super();
		super.setAttribute("is", "keyboard-keys");
		for (let k=0, freq=rootFreq, note=rootNote, cursor=0; k < keyCount; ++k, note=this.getNextNote(note), freq=this.getNextFreq(freq)){
			let key = new KeyboardKey(note, freq);
			this.keys.push(key);
		}

		this.adjustPositions();
		
		let qwertyLength = 9;
		let start = parseInt( (keyCount-qwertyLength) / 2 );
		for (let k=start, w=0, b=0; w < 9; ++k){
			let key = this.keys[k];
			if (key.blackKey){
				key.Key = this.blackKeys[b];
			}
			else {
				key.Key = this.whiteKeys[w];
				++w;
				++b;
			}
		}
	}

	connectedCallback(){
		this.keys.forEach(k => this.appendChild(k));
	}

	set KeyWidth(value){
		this.keyWidth = parseFloat(value);
		this.adjustPositions();
	}

	getNextNote(note){
		if (note == "G#"){
			return "A";
		}
		else if (note == "B"){
			return "C";
		}
		else if (note == "E"){
			return "F";
		}
		else if (note.endsWith("#")){
			note = note.replace("#","");
			let code = note.charCodeAt(0);
			code += 1;
			note = String.fromCharCode(code);
			return note;
		}
		else {
			return `${note}#`;
		}
	}

	getNextFreq(freq){
		return freq * (2 ** (1/12));
	}

	adjustPositions(){
		for (let k=0, cursor=0; k < this.keys.length; ++k){
			cursor = this.keys[k].adjustPosition(cursor, this.keyWidth);
		}
	}
}

class KeyboardKey extends HTMLButtonElement {
	note = "A";
	freq = 440.0;
	span = null;
	key = ""; // qwerty keyboard key
	blackKey = false;

	constructor(note, freq){
		super();
		super.setAttribute("is", "keyboard-key");
		this.note = note;
		this.freq = freq;
		this.blackKey = note.endsWith("#");
		this.classList.add(this.blackKey ? "black-key" : "white-key");
		this.span = document.createElement("span");
		this.appendChild(this.span);
		this.onpointerdown = (e) => { this.press(e); };
	}
	
	adjustPosition(position, width){
		if (this.blackKey){
			this.Width = width/2;
			this.LeftPos = position - this.Width/2;
			return position;
		}
		else {
			this.Width = width;
			this.LeftPos = position;
			return this.RightPos;
		}
	}
	
	get Width(){
		return parseFloat(this.style.width.replace("px",""));
	}

	set Width(value){
		this.style.width = `${value}px`;
	}

	get LeftPos(){
		return parseFloat(this.style.left.replace("px",""));
	}

	set LeftPos(value){
		this.style.left = `${value}px`;
	}

	get RightPos(){
		return this.LeftPos + this.Width;
	}

	set Key(key){
		this.key = this.span.innerHTML = key;
	}

	press(event){
		this.onpointerout = this.release;
		this.onpointerup = this.release;
		let ac = new AudioContext();
		this.osc = ac.createOscillator();
		this.osc.frequency.value = this.freq;
		this.osc.connect(ac.destination);
		this.osc.start();
	}

	release(event){
		this.onpointerout = null;
		this.onpointerup = null;
		this.osc.stop();
	}
}

customElements.define("keyboard-controller", KeyboardController, { extends: "div" });
customElements.define("keyboard-keys", KeyboardKeys, { extends: "div" });
customElements.define("keyboard-key", KeyboardKey, { extends: "button" });

