class KeyboardKey extends HTMLButtonElement {
	note = "A";
	freq = 440.0;
	span = null;
	kbd = "";
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
		window.addEventListener("keydown", (e) => { this.kbdDown(e); } );
		window.addEventListener("keyup", (e) => { this.kbdUp(e); } );
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

	set Kbd(kbd){
		this.kbd = kbd;
		this.span.innerHTML = kbd;
	}

	kbdDown(event){
		if (event.repeat || event.key.toUpperCase() != this.kbd){
			return false;
		}
		else {
			return this.press(event);
		}
	}

	kbdUp(event){
		if (event.key.toUpperCase() != this.kbd){
			return false;
		}
		else {
			return this.release(event);
		}
	}

	press(event){
		this.classList.add("key-pressed");
		this.onpointerout = this.release;
		this.onpointerup = this.release;
		
		// Only for testing
		let ac = new AudioContext();
		this.osc = ac.createOscillator();
		this.osc.frequency.value = this.freq;
		this.osc.connect(ac.destination);
		this.osc.start();
	}

	release(event){
		this.classList.remove("key-pressed");
		this.onpointerout = null;
		this.onpointerup = null;
		this.osc.stop();
	}
}

customElements.define("keyboard-key", KeyboardKey, { extends: "button" });

