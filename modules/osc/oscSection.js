class OscSection extends HTMLFieldSetElement {
	params = null;
	env = null;
	lfo = null;
	oscillators = [];
	
	constructor(){
		super();
		super.setAttribute("is", "osc-section");
		this.appendChild(document.createElement("legend")).innerHTML = "Oscillator";
		this.params = this.appendChild(new OscParams(this.paramsHelpText()));
		this.env = this.appendChild(new EnvModule(EnvModule.NO_SR, EnvModule.USE_DEPTH, this.envHelpText()));
		this.lfo = this.appendChild(new LfoModule(1200, "Cents", KnobInput.CURVED, this.lfoHelpText()));
		this.addEventListener("input", (event) => { this.updateSound(); });
	}

	makeSound(audioContext, key){
		let osc = audioContext.createOscillator();
		osc.calumKey = key;
		osc.type = this.params.shape.Value;
		osc.frequency.value = key.freq;
		
		// Freq env depth adds/subtracts 0-100%
		// i.e. from 0Hz to one octave above current note
		osc.frequency.linearRampToValueAtTime(key.freq + (key.freq * this.env.Depth), audioContext.currentTime + this.env.Attack);
		osc.frequency.linearRampToValueAtTime(key.freq, audioContext.currentTime + this.env.Decay);
		osc.detune.value = this.params.shift.Cents + this.params.detune.Cents;
		
		this.lfo.makeSound(audioContext, key).connect(osc.detune);

		osc.start();
		this.oscillators.push(osc);
		return osc;
	}

	updateSound(){
		for (let osc of this.oscillators){
			osc.frequency.value = osc.calumKey.freq;
			osc.detune.value = this.params.shift.Cents + this.params.detune.Cents;
			osc.type = this.params.shape.Value;
		}
		return true;
	}

	stopSound(audioContext, key, delay){
		let matchingOsc = this.oscillators.filter(o => o.calumKey == key);
		for (let osc of matchingOsc){
			this.oscillators.splice(this.oscillators.findIndex(o => o == osc));
		}

		setTimeout(() => {
			this.lfo.stopSound(audioContext, key);
			matchingOsc.forEach(o => { o.stop(); o.disconnect(); });
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
			<li>Generates the sound wave that passes through all other modules</li>
			<li>Different wave forms (shape) have different harmonics (fuzz)</li>
			<li>Plays the frequency of whichever note was played on the keyboard</li>
			<li>Incrementally shift the frequency above or below the root note by up to 24 notes (2 octaves)</li>
			<li>Detune the frequency above or below that root note in hundredths of a note</li>
		`;
	}

	envHelpText(){
		return `
			<li>Depth: target specified percentage above or below the root frequency</li>
			<li>Attack: time taken to glide from root frequency to target</li>
			<li>Decay: time taken ti glide from target to root frequency</li>
		`;
	}

	lfoHelpText(){
		return `
			<li>Depth: modulate frequency by specified hundredths of a note</li>
			<li>Freq: modulate frequency at specified speed</li>
			<li>Sync on: all pressed keys modulate together</li>
			<li>Sync off: each pressed key spawns its own modulation wave</li>
		`;
	}
}

customElements.define("osc-section", OscSection, { extends: "fieldset" });

