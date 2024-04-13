class SynthRack extends HTMLDivElement {
	static VERSION = 0.5;

	activate = null;
	
	title = null;
	save = null;
	load = null;

	keyboard = null;
	speakers = null;
	audioContext = null;
	modules = [];
	
	constructor(){
		super();
		super.setAttribute("is", "synth-rack");
		let header = this.appendChild(document.createElement("header"));
		this.title = header.appendChild(document.createElement("h1"));
		this.title.setAttribute("contenteditable", "true");
		this.title.innerHTML = "Synth Rack";

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
		if (document.activeElement.percentToParam == undefined){
			// Element doesn't support midi knob yet
			return false;
		}

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
		console.log(json);
		
		let dataString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(json))}`;
		console.log(dataString);

		let a = document.createElement("a");
		a.setAttribute("href", dataString);
		a.setAttribute("download", `${json.name}.json`);
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

