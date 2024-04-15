class SynthModule extends HTMLFormElement {
	header = null;
	osc = null;
	filter = null;
	amp = null;
	pan = null;

	constructor(name){
		super();
		super.setAttribute("is", "synth-module");

		this.header = this.appendChild(document.createElement("h2"));
		this.header.innerHTML = name;
		this.header.setAttribute("contenteditable", "true");

		this.osc = this.appendChild(new OscSection());
		this.filter = this.appendChild(new FilterSection());
		this.amp = this.appendChild(new AmpSection());
		this.pan = this.appendChild(new PanSection());

		let buttons = this.appendChild(new ModuleButtons());
		buttons.duplicate.addEventListener("click", (event) => { this.duplicateModule(event); });
		buttons.remove.addEventListener("click", (event) => { this.removeModule(event); });

		// Default setup
		// - Triangle oscillator (sine too quiet)
		// - 13% amp release (prevent popping)
		this.osc.params.shape.select.value = "triangle";
		this.amp.env.release.percentToParam(13);
	}

	connectedCallback(){
		// Highlight module name for editing
		let selection = window.getSelection();
		selection.removeAllRanges();
		let range = document.createRange();
		range.selectNodeContents(this.header);
		selection.addRange(range);
	}

	duplicateModule(){
		let dupe = new SynthModule();
		dupe.fromJson(this.toJson());
		dupe.header.innerHTML = `${this.header.innerHTML} (duplicate)`;
		
		let e = new CustomEvent("duplicate module", { detail: dupe, bubbles: true });
		this.dispatchEvent(e);

		this.after(dupe);
		return dupe;
	}

	removeModule(){
		// Note: Any existing sounds are not cleaned up
		let e = new CustomEvent("remove module", { detail: this, bubbles: true });
		this.dispatchEvent(e);
		return this;
	}

	makeSound(audioContext, key, speakers){
		let osc = this.osc.makeSound(audioContext, key);
		
		let filter = this.filter.makeSound(audioContext, key);
		osc.connect(filter);
		
		let amp = this.amp.makeSound(audioContext, key);
		filter.connect(amp);
		
		let pan = this.pan.makeSound(audioContext, key);
		amp.connect(pan);
		
		pan.connect(speakers);
		return true;
	}

	stopSound(audioContext, key){
		this.osc.stopSound(audioContext, key, this.amp.env.ReleaseMs)
		this.filter.stopSound(audioContext, key, this.amp.env.ReleaseMs)
		this.amp.stopSound(audioContext, key, this.amp.env.ReleaseMs)
		this.pan.stopSound(audioContext, key, this.amp.env.ReleaseMs)
		return true;
	}

	toJson(){
		let json = {};
		json.name = this.header.innerHTML;
		json.osc = this.osc.toJson();
		json.filter = this.filter.toJson();
		json.amp = this.amp.toJson();
		json.pan = this.pan.toJson();
		return json;
	}

	fromJson(json){
		this.header.innerHTML = json.name;
		this.osc.fromJson(json.osc);
		this.filter.fromJson(json.filter);
		this.amp.fromJson(json.amp);
		this.pan.fromJson(json.pan);
		return true;
	}
}

customElements.define("synth-module", SynthModule, { extends: "form" });

