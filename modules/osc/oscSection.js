class OscSection extends HTMLFieldSetElement {
	params = null;
	env = null;
	lfo = null;
	oscillators = [];
	
	constructor(){
		super();
		super.setAttribute("is", "osc-section");
		this.appendChild(document.createElement("legend")).innerHTML = "Oscillator";
		this.params = this.appendChild(new OscParams());
		this.env = this.appendChild(new EnvModule(EnvModule.NO_SR, EnvModule.USE_DEPTH));
		this.lfo = this.appendChild(new LfoModule(1200, "Cents", KnobInput.CURVED));
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
		this.params.fromJson(json);
		this.env.fromJson(json);
		this.lfo.fromJson(json);
		return true;
	}
}

customElements.define("osc-section", OscSection, { extends: "fieldset" });

