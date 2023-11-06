class KeyboardKeys extends HTMLDivElement {
	keys = [];
	keyWidth = 30;
	whiteKbd = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
	blackKbd = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];

	constructor(rootNote, rootFreq, keyCount){
		super();
		super.setAttribute("is", "keyboard-keys");

		for (let k=0, freq=rootFreq, note=rootNote, cursor=0; k < keyCount; ++k, note=this.getNextNote(note), freq=this.getNextFreq(freq)){
			let key = new KeyboardKey(note, freq);
			this.keys.push(key);
		}

		this.adjustPositions();
		
		let qwertyLength = this.whiteKbd.length;
		let startKbd = Math.floor((keyCount-qwertyLength)/2);
		for (let k=startKbd, w=0, b=0; w < qwertyLength; ++k){
			let key = this.keys[k];
			if (key.blackKey){
				key.Kbd = this.blackKbd[b];
			}
			else {
				key.Kbd = this.whiteKbd[w];
				++w;
				++b;
			}
		}
	}

	connectedCallback(){
		this.keys.forEach(k => this.appendChild(k));

		let requiredWidth = this.keys.filter(k => !k.blackKey).length * this.keyWidth;
		let availableWidth = this.getBoundingClientRect().width;
		this.MarginLeft = (availableWidth - requiredWidth) / 2;
		this.announce("qwerty width", this.whiteKbd.length * this.keyWidth);

		let firstKey = this.keys.find(k => k.kbd != "");
		this.announce("qwerty start", this.MarginLeft + firstKey.LeftPos);
	}

	get KeyWidth(){
		return this.keyWidth;
	}

	set KeyWidth(value){
		this.keyWidth = parseFloat(value);
		this.adjustPositions();
	}

	get MarginLeft(){
		return parseFloat(this.style.marginLeft.replace("px",""));
	}

	set MarginLeft(value){
		this.style.marginLeft = `${value}px`;
	}

	stepLeft(){
		this.MarginLeft -= this.keyWidth;
	}

	stepRight(){
		this.MarginLeft += this.keyWidth;
	}

	jumpLeft(){
		this.MarginLeft -= (this.keyWidth * 7);
	}

	jumpRight(){
		this.MarginLeft += (this.keyWidth * 7);
	}

	zoomIn(){
		let oldSize = this.TotalSize;
		this.KeyWidth += 5;
		let newSize = this.TotalSize;
		this.MarginLeft -= (newSize - oldSize) / 2;
	}

	zoomOut(){
		let oldSize = this.TotalSize;
		this.KeyWidth -= 5;
		let newSize = this.TotalSize;
		this.MarginLeft += (oldSize - newSize) / 2;
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
		for (let k=0, nextPos=0; k < this.keys.length; ++k){
			nextPos = this.keys[k].adjustPosition(nextPos, this.keyWidth);
		}
	}

	announce(msg, attachment){
		let e = new CustomEvent("KeyboardKeys", { detail: { msg: msg, attachment: attachment }, bubbles: true });
		this.dispatchEvent(e);
	}
}

customElements.define("keyboard-keys", KeyboardKeys, { extends: "div" });

