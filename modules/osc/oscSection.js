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

	stopSound(audioContext, key, delayMs){
		this.lfo.stopSound(audioContext, key, delayMs);

		let matchingOsc = this.oscillators.filter(o => o.calumKey == key);
		for (let osc of matchingOsc){
			this.oscillators.splice(this.oscillators.findIndex(o => o == osc));
		}

		setTimeout(() => {
			matchingOsc.forEach(o => { o.stop(); o.disconnect(); });
		}, delayMs);

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
			<li>Generates the sound wave that passes through all other modules.</li>
			<li>Plays the frequency of whichever note was pressed on the keyboard.</li>
			<li>Shape = different wave forms (shape) have different harmonics (fuzz).</li>
			<li>Shift = incrementally shift the frequency above or below the root note by up to 24 notes (2 octaves).</li>
			<li>Detune = adjust the frequency above or below the root note in hundredths of a note.</li>
		`;
	}

	envHelpText(){
		return `
			<li>Depth = target the specified percentage above or below the root frequency.</li>
			<li>Attack = time taken to glide from the root frequency to the target frequency.</li>
			<li>Decay = time taken to glide from the target frequency to the root frequency.</li>
		`;
	}

	lfoHelpText(){
		return `
			<li>Depth = modulate the frequency by the specified hundredths of a note.</li>
			<li>Freq = modulate the frequency at this specified speed.</li>
			<li>Sync on = all pressed keys modulate together.</li>
			<li>Sync off = each pressed key spawns its own modulation wave.</li>
		`;
	}
}

customElements.define("osc-section", OscSection, { extends: "fieldset" });

