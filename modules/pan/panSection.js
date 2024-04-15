class PanSection extends HTMLFieldSetElement {
	params = null;
	env = null;
	lfo = null;
	pans = [];
	
	constructor(){
		super();
		super.setAttribute("is", "pan-section");
		this.appendChild(document.createElement("legend")).innerHTML = "Pan";
		this.params = this.appendChild(new PanParams(this.paramsHelpText()));
		this.env = this.appendChild(new EnvModule(EnvModule.USE_SR, EnvModule.USE_DEPTH, this.envHelpText()));
		this.lfo = this.appendChild(new LfoModule(1, "", KnobInput.LINEAR, this.lfoHelpText()));
		this.addEventListener("input", (event) => { this.updateSound(); });
	}

	makeSound(audioContext, key){
		let pan = audioContext.createStereoPanner();
		pan.calumKey = key;
		pan.pan.value = this.params.pan.Value;
		
		let target = this.env.Depth >= 0 ? (this.params.pan.paramMax - this.params.pan.Value) : (this.params.pan.Value + this.params.pan.paramMax);
		target *= this.env.Depth;
		target += this.params.pan.Value;

		let delta = target - this.params.pan.Value;

		pan.pan.linearRampToValueAtTime(target, audioContext.currentTime + this.env.Attack);
		pan.pan.linearRampToValueAtTime(this.params.pan.Value + (delta * this.env.Sustain), audioContext.currentTime + this.env.Decay);

		this.lfo.makeSound(audioContext, key).connect(pan.pan);

		this.pans.push(pan);
		return pan;
	}

	updateSound(){
		this.pans.forEach(p => p.pan.value = this.params.pan.Value);
		return true;
	}

	stopSound(audioContext, key, delay){
		let matchingPans = this.pans.filter(p => p.calumKey == key);
		for (let pan of matchingPans){
			pan.pan.cancelScheduledValues(0.0);
			pan.pan.linearRampToValueAtTime(this.params.pan.Value, audioContext.currentTime + this.env.Release);
			this.pans.splice(this.pans.findIndex(p => p == pan), 1);
		}

		setTimeout(() => {
			this.lfo.stopSound(audioContext, key);
			matchingPans.forEach(p => p.disconnect());
		}, delay);

		return true;
	}

	toJson(){
		let json = {};
		json.params = this.params.toJson();
		json.env = this.env.toJson();
		json.lfo = this.lfo.toJson();
		return json;
	}

	fromJson(json){
		this.params.fromJson(json.params);
		this.env.fromJson(json.env);
		this.lfo.fromJson(json.lfo);
		return true;
	}

	paramsHelpText(){
		return `
			<li>Move sound left or right</li>
		`;
	}

	envHelpText(){
		return `
			<li>Positive depth: target position between pan value and far right</li>
			<li>Negative depth: target position between pan value and far left</li>
			<li>Attack: time taken to glide from pan position to target position</li>
			<li>Decay: time taken to glide from target position to sustain position</li>
			<li>Sustain: position between sustain position and target position to hold until release</li>
			<li>Release: time taken to glide from sustain position back to pan position</li>
		`;
	}

	lfoHelpText(){
		return `
			<li>Depth: modulate sound left and right by specified amount</li>
			<li>Freq: modulate pan at specified speed</li>
			<li>Sync on: all pressed keys modulate together</li>
			<li>Sync off: each pressed key spawns its own modulation wave</li>
		`;
	}
}

customElements.define("pan-section", PanSection, { extends: "fieldset" });

