class AmpSection extends HTMLFieldSetElement {
	params = null;
	env = null;
	lfo = null;
	amps = [];
	
	constructor(){
		super();
		super.setAttribute("is", "amp-section");
		this.appendChild(document.createElement("legend")).innerHTML = "Amp";
		this.params = this.appendChild(new AmpParams(this.paramsHelpText()));
		this.env = this.appendChild(new EnvModule(EnvModule.USE_SR, EnvModule.NO_DEPTH, this.envHelpText()));
		this.lfo = this.appendChild(new LfoModule(1, "", KnobInput.LINEAR, this.lfoHelpText()));
		this.addEventListener("input", (event) => { this.updateSound(); });
	}

	makeSound(audioContext, key){
		let amp = audioContext.createGain();
		amp.calumKey = key;
		amp.gain.value = 0.0;
		amp.gain.linearRampToValueAtTime(this.params.gain.Value, audioContext.currentTime + this.env.Attack);
		amp.gain.linearRampToValueAtTime(this.params.gain.Value * this.env.Sustain, audioContext.currentTime + this.env.Decay);

		this.lfo.makeSound(audioContext, key).connect(amp.gain);

		this.amps.push(amp);
		return amp;
	}

	updateSound(){
		this.amps.forEach(g => g.gain.value = this.params.gain.Value);
		return true;
	}

	stopSound(audioContext, key, delay){
		let matchingAmps = this.amps.filter(a => a.calumKey == key);
		for (let amp of matchingAmps){
			amp.gain.cancelScheduledValues(0.0);
			amp.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + this.env.Release);
			this.amps.splice(this.amps.findIndex(a => a == amp), 1);
		}

		setTimeout(() => {
			this.lfo.stopSound(audioContext, key);
			matchingAmps.forEach(a => a.disconnect());
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
			<li>Adjust the volume of this module.</li>
		`;
	}

	envHelpText(){
		return `
			<li>Attack = time taken to glide from silence to the gain value.</li>
			<li>Decay = time taken to glide from the gain value to the sustain value.</li>
			<li>Sustain = gain value to hold until the key is released.</li>
			<li>Release = time taken to glide from the sustain value back to silence when the key is released.</li>
		`;
	}

	lfoHelpText(){
		return `
			<li>Depth = modulate volume by this specified value.</li>
			<li>Freq = modulate volume at this specified speed.</li>
			<li>Sync on = all pressed keys modulate together.</li>
			<li>Sync off = each pressed key spawns its own modulation wave.</li>
		`;
	}
}

customElements.define("amp-section", AmpSection, { extends: "fieldset" });

