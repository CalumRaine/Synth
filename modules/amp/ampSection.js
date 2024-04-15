class AmpSection extends HTMLFieldSetElement {
	params = null;
	env = null;
	lfo = null;
	amps = [];
	
	constructor(){
		super();
		super.setAttribute("is", "amp-section");
		this.appendChild(document.createElement("legend")).innerHTML = "Amp";
		this.params = this.appendChild(new AmpParams());
		this.env = this.appendChild(new EnvModule(EnvModule.USE_SR, EnvModule.NO_DEPTH));
		this.lfo = this.appendChild(new LfoModule(1, "", KnobInput.LINEAR));
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
}

customElements.define("amp-section", AmpSection, { extends: "fieldset" });

