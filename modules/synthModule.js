class SynthModule extends HTMLFormElement {
	oscShape = null;
	oscShift = null;
	oscDetune = null;

	filterType = null;
	filterCutoff = null;

	ampGain = null;
	ampAttack = null;
	ampDecay = null;
	ampSustain = null;
	ampRelease = null;

	oscillators = [];
	filters = [];
	gains = [];

	constructor(){
		super();
		super.setAttribute("is", "synth-module");

		let fieldset = this.appendChild(document.createElement("fieldset"));
		let legend = fieldset.appendChild(document.createElement("legend"));
		legend.innerHTML = "Oscillator";
		this.oscShape = fieldset.appendChild(new OscShape());
		this.oscShift = fieldset.appendChild(new OscShift());
		this.oscDetune = fieldset.appendChild(new OscDetune());

		fieldset = this.appendChild(document.createElement("fieldset"));
		legend = fieldset.appendChild(document.createElement("legend"));
		legend.innerHTML = "Filter";
		this.filterType = fieldset.appendChild(new FilterType());
		this.filterCutoff = fieldset.appendChild(new FilterCutoff());

		fieldset = this.appendChild(document.createElement("fieldset"));
		legend = fieldset.appendChild(document.createElement("legend"));
		legend.innerHTML = "Amp";
		this.ampGain = fieldset.appendChild(new AmpGain());
		this.ampAttack = fieldset.appendChild(new EnvAttack());
		this.ampDecay = fieldset.appendChild(new EnvDecay());
		this.ampSustain = fieldset.appendChild(new AmpSustain());
		this.ampRelease = fieldset.appendChild(new EnvRelease());

		let buttons = this.appendChild(new ModuleButtons());
		buttons.duplicate.onclick = (event) => { this.duplicateModule(event); };
		buttons.remove.onclick = (event) => { this.removeModule(event); }

		this.addEventListener("input", (event) => { this.updateSound(); });
	}

	duplicateModule(){
		let patch = new SynthModule();
		patch.oscShape.input.value = this.oscShape.input.value;
		patch.oscShift.input.value = this.oscShift.input.value;
		patch.oscDetune.input.value = this.oscDetune.input.value;
		
		patch.filterType.input.value = this.filterType.input.value;
		patch.filterCutoff.input.value = this.filterCutoff.input.value;

		patch.ampGain.input.value = this.ampGain.input.value;
		patch.ampAttack.input.value = this.ampAttack.input.value;
		patch.ampDecay.input.value = this.ampDecay.input.value;
		patch.ampSustain.input.value = this.ampSustain.input.value;
		patch.ampRelease.input.value = this.ampRelease.input.value;

		let e = new CustomEvent("duplicate module", { detail: patch, bubbles: true });
		this.dispatchEvent(e);

		this.after(patch);
		return patch;
	}

	removeModule(){
		// Note: Any existing sounds are not cleaned up
		let e = new CustomEvent("remove module", { detail: this, bubbles: true });
		this.dispatchEvent(e);
		return this;
	}

	makeSound(audioContext, key, speakers){
		let osc = audioContext.createOscillator();
		osc.calumKey = key;
		osc.type = this.oscShape.Value;
		osc.frequency.value = key.freq;
		osc.detune.value = this.oscShift.Cents + this.oscDetune.Cents;
		osc.start();
		this.oscillators.push(osc);

		let filter = audioContext.createBiquadFilter();
		filter.calumKey = key;
		filter.type = this.filterType.Value;
		filter.frequency.value = this.filterCutoff.Value;
		this.filters.push(filter);

		let attack = audioContext.currentTime + (this.ampAttack.Value / 1000);
		let decay = attack + (this.ampDecay.Value / 1000);
		let gain = audioContext.createGain();
		gain.calumKey = key;
		gain.gain.value = 0;
		gain.gain.linearRampToValueAtTime(this.ampGain.Value, attack);
		gain.gain.linearRampToValueAtTime(this.ampSustain.Value, decay);
		this.gains.push(gain);

		osc.connect(filter);
		filter.connect(gain);
		gain.connect(speakers);

		return true;
	}

	updateSound(){
		for (let osc of this.oscillators){
			osc.frequency.value = osc.calumKey.freq;
			osc.detune.value = this.oscShift.Cents + this.oscDetune.Cents;
			osc.type = this.oscShape.Value;
		}

		for (let filter of this.filters){
			filter.type = this.filterType.Value;
			filter.frequency.value = this.filterCutoff.Value;
		}

		for (let gain of this.gains){
			gain.gain.value = this.ampGain.Value;
		}

		return true;
	}

	stopSound(audioContext, key){
		let matchingOsc = this.oscillators.filter(o => o.calumKey == key);
		for (let oscillator of matchingOsc){
			let index = this.oscillators.findIndex(o => o == oscillator);
			this.oscillators.splice(index, 1);
		}

		let matchingFilters = this.filters.filter(f => f.calumKey == key);
		for (let filter of matchingFilters){
			let index = this.filters.findIndex(f => f == filter);
			this.filters.splice(index, 1);
		}

		let release = audioContext.currentTime + (this.ampRelease.Value / 1000);
		let matchingGains = this.gains.filter(g => g.calumKey == key);
		for (let gain of matchingGains){
			gain.gain.cancelScheduledValues(0.0);
			gain.gain.linearRampToValueAtTime(0.0, release);
			let index = this.gains.findIndex(g => g == gain);
			this.gains.splice(index, 1);
		}

		setTimeout(() => {
			matchingOsc.forEach(o => { o.stop(); o.disconnect(); });
			matchingFilters.forEach(f => { f.disconnect(); });
			matchingGains.forEach(g => { g.disconnect(); });
		}, this.ampRelease.Value);
		
		return true;
	}
}

customElements.define("synth-module", SynthModule, { extends: "form" });

