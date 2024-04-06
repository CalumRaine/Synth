class KeyboardController extends HTMLDivElement {
	static ALL_NOTES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
	static ALL_QWERTY = ["A", "W", "S", "E", "D", "R", "F", "T", "G", "Y", "H", "U", "J", "I", "K", "O", "L"];
	allKeys = [];
	
	static WHITE_NOTES = ["A", "B", "C", "D", "E", "F", "G"];
	static WHITE_QWERTY = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
	whiteKeys = [];
	
	static BLACK_NOTES = ["A#", "C#", "D#", "F#", "G#"];
	static BLACK_QWERTY = ["W", "E", "R", "T", "Y", "U", "I", "O"];
	blackKeys = [];
	
	static WHITE_KEY_WIDTH = 30;
	static BLACK_KEY_WIDTH = 15;
	
	static NUM_KEYS = 88;
	//static ROOT_FREQ = 440.0;
	static ROOT_FREQ = 27.5;
	static ROOT_NOTE = "A";

	rail = null;
	handle = null;
	keyboard = null;

	constructor(){
		super();
		super.setAttribute("is", "keyboard-controller");

		// Setup child objects
		this.rail = this.appendChild(new QwertyRail());
		this.keyboard = this.appendChild(new KeyboardKeys());
		this.handle = this.rail.appendChild(new QwertyHandle());

		// Make white/black keys
		for (let k=0, freq=KeyboardController.ROOT_FREQ, note=KeyboardController.ROOT_NOTE; k < KeyboardController.NUM_KEYS; ++k){
			// Create key with note and freq
			let key = new KeyboardKey(k+1, note, freq);
			this.keyboard.appendChild(key);
			this.allKeys.push(key);

			// Set key position, width and class
			let pos = this.whiteKeys.length * KeyboardController.WHITE_KEY_WIDTH;
			if (note.endsWith("#")){
				// Black key
				pos -= KeyboardController.BLACK_KEY_WIDTH / 2;
				key.classList.add("black-key");
				key.style.width = `${KeyboardController.BLACK_KEY_WIDTH}px`;
				this.blackKeys.push(key);
			}
			else {
				// White key
				key.classList.add("white-key");
				key.style.width = `${KeyboardController.WHITE_KEY_WIDTH}px`;
				this.whiteKeys.push(key);
			}
			key.MarginLeft = pos;

			// Get next note
			if (note.endsWith("#") || note == "E" || note == "B"){
				let code = note.charCodeAt(0);
				code += 1;
				code %= "H".charCodeAt(0);
				code %= "A".charCodeAt(0);
				code += "A".charCodeAt(0);
				note = String.fromCharCode(code);
			}
			else {
				note += "#";
			}

			// Get next frequency
			freq = freq * (2 ** (1/12));
		}

		// Set width of rail/handle
		this.rail.style.width = `${this.whiteKeys.length * KeyboardController.WHITE_KEY_WIDTH}px`;
		this.handle.style.width = `${KeyboardController.WHITE_QWERTY.length * KeyboardController.WHITE_KEY_WIDTH}px`;
		
		// Put qwerty rail at middle C
		let cKeys = this.whiteKeys.filter(k => k.note == "C");
		let middleC = cKeys[Math.floor((cKeys.length - 1) / 2)];
		this.handle.MarginLeft = middleC.MarginLeft;
		this.mapQwerty();

		this.rail.addEventListener("pointerdown", (event) => { this.grabHandle(event); });
		document.addEventListener("pointermove", (event) => { this.dragHandle(event); });
		document.addEventListener("pointerup", (event) => { this.dropHandle(event); });
	}

	connectedCallback(){
		// Centre keyboard on screen
		let requiredWidth = this.whiteKeys.length * KeyboardController.WHITE_KEY_WIDTH;
		let availableWidth = this.getBoundingClientRect().width;
		let marginLeft = (availableWidth - requiredWidth) / 2;
		this.rail.style.marginLeft = `${marginLeft}px`;
		this.keyboard.style.marginLeft = `${marginLeft}px`;
	}

	mapQwerty(){
		this.allKeys.forEach(k => k.QwertyKey = "");

		// Find nearest key to left edge of handle
		let nearestKey = this.whiteKeys[0];
		let nearestDist = Math.abs(this.handle.MarginLeft - nearestKey.MarginLeft);
		for (let k=0; k < this.whiteKeys.length; ++k){
			let key = this.whiteKeys[k];
			let dist = Math.abs(this.handle.MarginLeft - key.MarginLeft);
			if (dist < nearestDist){
				nearestKey = key;
				nearestDist = dist;
			}
			else if (dist > nearestDist){
				break;
			}
		}

		let index = this.allKeys.findIndex(k => k == nearestKey);
		for (let wq=0, bq=0, k=index; wq < KeyboardController.WHITE_QWERTY.length && k < KeyboardController.NUM_KEYS; ++k){
			let key = this.allKeys[k];
			if (this.whiteKeys.includes(key)){
				key.QwertyKey = KeyboardController.WHITE_QWERTY[wq++];
			}
			else {
				key.QwertyKey = KeyboardController.BLACK_QWERTY[bq++];
			}
		}
	}

	grabHandle(event){
		this.rail.Grabbed = true;
	}

	dragHandle(event){
		if (!this.rail.Grabbed){
			return false;
		}
		this.handle.MarginLeft += event.movementX;
		this.mapQwerty();
	}

	dropHandle(event){
		this.rail.Grabbed = false;
		let key = this.whiteKeys.find(k => k.qwertyKey == KeyboardController.WHITE_QWERTY[0]);
		this.handle.MarginLeft = key.MarginLeft;
	}
}

customElements.define("keyboard-controller", KeyboardController, { extends: "div" });

