class SynthRack extends HTMLDivElement {
	static VERSION = 0.7;

	activate = null;
	
	title = null;
	save = null;
	load = null;

	keyboard = null;
	compressor = null;
	speakers = null;
	audioContext = null;
	modules = [];
	
	constructor(){
		super();
		super.setAttribute("is", "synth-rack");
		let header = this.appendChild(document.createElement("header"));
		this.title = header.appendChild(document.createElement("h1"));
		this.title.innerHTML = "Synth Rack";
		this.title.setAttribute("contenteditable", "true");
		this.title.setAttribute("title", "Patch name");

		this.save = header.appendChild(document.createElement("button"));
		this.save.setAttribute("title", "Export Patch");
		this.save.innerHTML = "&#128190";
		this.save.addEventListener("click", (event) => { this.savePatch(event); });

		this.load = header.appendChild(document.createElement("button"));
		this.load.innerHTML = "&#128194";
		this.load.setAttribute("title", "Import Patch");
		this.load.onclick = function() { this.querySelector("input").click(); };
		let upload = this.load.appendChild(document.createElement("input"));
		upload.setAttribute("type", "file");
		upload.setAttribute("accept", "application/json");
		upload.setAttribute("hidden", "");
		upload.addEventListener("input", (event) => { this.loadPatch(event); });

		this.keyboard = this.appendChild(new KeyboardController());
		this.modules.push(this.appendChild(new SynthModule(this.getUniqueName())));
		this.addEventListener("duplicate module", (event) => { this.modules.push(event.detail); });
		this.addEventListener("remove module", (event) => { this.removeModule(event.detail); });

		this.activate = this.appendChild(document.createElement("dialog"));
		this.activate.className = "activate";
		let start = this.activate.appendChild(document.createElement("button"));
		start.innerHTML = "Start";
		start.onclick = (event) => { this.initialise(event); };

		this.keyboard.allKeys.forEach(k => {
			// Play key on mouse/touch down
			k.onpointerdown = (event) => { event.preventDefault(); this.playKey(k); }

			// Play key when sliding into key with pressed mouse
			k.onpointerenter = (event) => { event.preventDefault(); return event.buttons > 0 ? this.playKey(k) : false };

			// Release key when sliding out
			k.onpointerleave = (event) => { event.preventDefault(); return event.buttons > 0 ? this.releaseKey(k) : false; }
			
			// Release key when lifting mouse/touch
			k.onpointerup = (event) => { event.preventDefault(); this.releaseKey(k); }

			// Ignore right click and long press
			k.oncontextmenu = (event) => event.preventDefault();
		});

		document.addEventListener("keydown", (event) => { this.playQwerty(event) });
		document.addEventListener("keyup", (event) => { this.releaseQwerty(event) });
	}

	connectedCallback(){
		this.activate.showModal();
	}

	initialise(event){
		this.audioContext = new AudioContext();
		this.speakers = this.audioContext.createGain();
		this.speakers.gain.value = 1.0;

		this.compressor = this.audioContext.createDynamicsCompressor();
		this.compressor.ratio.value = 20;		// default = 12
		this.compressor.threshold.value = -30;		// default = -24
		this.compressor.knee.value = 20;		// default = 30
		this.compressor.attack.value = 0.002;		// default = 0.003

		this.speakers.connect(this.compressor);
		this.compressor.connect(this.audioContext.destination);

		navigator.requestMIDIAccess().then((access) => { this.setupMidi(access); });
		this.activate.close();
	}

	removeModule(module){
		if (this.modules.length == 1){
			// Refuse to remove the only module
			return false;
		}
		
		let index = this.modules.findIndex(m => m == module);
		this.modules.splice(index, 1);
		module.remove();
		return true;
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
		/* message: [status, data_1, data_2]
		 * STATUS
		 * 128-143 = Note off
		 * 144-159 = Note on (supported)
		 * 160-175 = Polyphonic aftertouch
		 * 176-191 = Control/Mode change (supported)
		 * 192-207 = Program change
		 * 208-223 = Channel aftertouch
		 * 224-239 = Pitch bend (supported)
		 * 240     = System exclusive
		 * 241     = Time code
		 * 242     = Song position pointer
		 * 243     = Song selection
		 * 244     = Reserved
		 * 245     = Reserved
		 * 246     = Tune request
		 * 247     = SysEx
		 * 248     = Timing clock
		 * 249     = Reserved
		 * 250     = Start
		 * 251     = Continue
		 * 252     = Stop
		 * 253     = Reserved
		 * 254     = Active sensing
		 * 255     = System reset
		 */ 
		
		let type = message[0];
		if (type >= 144 && type <= 159){
			return this.midiKey(message[1], message[2]);
		}
		else if (type >= 176 && type <= 191){
			// DATA_1
			// 1 = modulation wheel
			// 7 = volume control
		 	// (126 others covered in MIDI spec)
			return this.midiKnob(message[2]);
		}
		else if (type >= 224 && type <= 239){
			// Pitch bend
			return this.midiKnob(message[2] - 0.5);
		}
		else {
			console.log(`Midi: Status ${type} not handled.`);
			return false;
		}
	}

	midiKey(num, vel){
		num -= 20;
		let key = this.keyboard.allKeys.find(k => k.num == num);
		return vel > 0 ? this.playKey(key) : this.releaseKey(key);
	}

	midiKnob(value){
		if (document.activeElement.percentToParam == undefined){
			// Element doesn't support midi knob yet
			return false;
		}

		// Knob adjusts parameter of whichever input has focus
		document.activeElement.percentToParam(value / 1.27);
		return true;
	}

	getUniqueName(){
		let num=0;
		for (num=this.modules.length+1; this.modules.some(m => m.header.innerHTML == `Module ${num}`); ++num);
		return `Module ${num}`;
	}

	savePatch(){
		let json = {};
		json.version = SynthRack.VERSION;
		json.name = this.title.innerHTML;
		json.modules = this.modules.map(m => m.toJson());
		
		let dataString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(json))}`;

		let a = document.createElement("a");
		a.setAttribute("href", dataString);
		a.setAttribute("download", `${json.name.replace(" ", "_")}.json`);
		a.click();
		return json;
	}

	loadPatch(event){
		if (event.target.files.length != 1){
			console.log(`Expected 1 file but received ${event.target.files.length}.`);
			return false;
		}

		let fr = new FileReader();
		fr.onload = (event) => {
			let json = "";
			try {
				json = JSON.parse(fr.result);
			}
			catch (error) {
				console.log("JSON parse error:", error);
				return false;
			}
			
			if (SynthRack.VERSION != json.version){
				console.log(`WARNING: Loading version ${json.version} into ${SynthRack.VERSION}`);
			}

			this.title.innerHTML = json.name;
			this.modules.forEach(m => m.remove());
			this.modules = [];
			for (let jsonModule of json.modules){
				let module = new SynthModule();
				module.fromJson(jsonModule);
				this.appendChild(module);
				this.modules.push(module);
			}

			return true;
		};
		fr.readAsText(event.target.files[0]);
		event.target.value = null;
		return true;
	}
}

customElements.define("synth-rack", SynthRack, { extends: "div" });

