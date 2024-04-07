class SynthRack extends HTMLDivElement {
	activate = null;
	audioContext = null;
	modules = [];
	keyboard = null;
	speakers = null;
	
	constructor(){
		super();
		super.setAttribute("is", "synth-rack");
		this.keyboard = this.appendChild(new KeyboardController());
		this.modules.push(this.appendChild(new SynthModule()));

		this.activate = this.appendChild(document.createElement("dialog"));
		let start = this.activate.appendChild(document.createElement("button"));
		start.innerHTML = "Start";
		start.onclick = (event) => { this.initialise(event); };

		this.keyboard.allKeys.forEach(k => k.onpointerdown = (event) => { this.playKey(k); });
		this.keyboard.allKeys.forEach(k => k.onpointerup = (event) => { this.releaseKey(k); });
		document.addEventListener("keydown", (event) => { this.playQwerty(event) });
		document.addEventListener("keyup", (event) => { this.releaseQwerty(event) });
	}

	connectedCallback(){
		this.activate.showModal();
	}

	initialise(event){
		this.audioContext = new AudioContext();
		this.speakers = this.audioContext.createGain();
		this.speakers.gain.value = 0.2;
		this.speakers.connect(this.audioContext.destination);

		navigator.requestMIDIAccess().then((access) => { this.setupMidi(access); });
		this.activate.close();
	}

	setupMidi(midiAccess){
		for (let input of midiAccess.inputs.values()){
			input.open();
			input.onstatechange = (event) => { console.log("STATE CHANGED", event); };
			input.onmidimessage = (event) => { this.handleMidi(event.data); };
		}

		return true;
	}

	playKey(key){
		key.play();
		this.modules.forEach(m => m.makeSound(this.audioContext, key, this.speakers));
		return true;
	}

	releaseKey(key){
		key.release();
		this.modules.forEach(m => m.stopSound(this.audioContext, key));
		return true;
	}

	playQwerty(event){
		if (event.repeat){
			return false;
		}
		else if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey){
			return false;
		}

		let key = this.keyboard.allKeys.find(k => k.qwertyKey == event.key.toUpperCase());
		return key == null ? false : this.playKey(key);
	}

	releaseQwerty(event){
		let key = this.keyboard.allKeys.find(k => k.qwertyKey == event.key.toUpperCase());
		return key == null ? false : this.releaseKey(key);
	}

	handleMidi(message){
		switch (message[0]){
			case 158:
				return this.midiKey(message[1], message[2]);
			case 190:
				return this.midiKnob(message[2]);
			default:
				console.log("Unhandled midi message", message);
				return false;
		}
	}

	midiKey(num, vel){
		num -= 20;
		let key = this.keyboard.allKeys.find(k => k.num == num);
		return vel > 0 ? this.playKey(key) : this.releaseKey(key);
	}

	midiKnob(value){
		let fraction = value / 127;
		let input = document.activeElement;
		let range = input.max - input.min;
		value = parseFloat(input.min) + (range * fraction);
		
		let decimalPlaces = 0;
		for (let step=input.step; step < 1; step *= 10, ++decimalPlaces);

		input.value = value.toFixed(decimalPlaces);
		input.setAttribute("value", input.value);
		input.dispatchEvent(new Event("change", { bubbles: true }));
		return true;
	}
}

customElements.define("synth-rack", SynthRack, { extends: "div" });
