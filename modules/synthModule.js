class SynthModule extends HTMLFormElement {
	oscShape = null;
	oscShift = null;
	oscDetune = null;
	freqEnv = null;
	freqLfo = null;

	filterType = null;
	filterCutoff = null;
	filterEnv = null;
	filterLfo = null;

	ampGain = null;
	ampEnv = null;
	ampLfo = null;

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
		this.freqEnv = fieldset.appendChild(new EnvModule(EnvModule.NO_SR, EnvModule.USE_DEPTH));
		this.freqLfo = fieldset.appendChild(new LfoModule(1200, "Cents", KnobInput.CURVED));

		fieldset = this.appendChild(document.createElement("fieldset"));
		legend = fieldset.appendChild(document.createElement("legend"));
		legend.innerHTML = "Filter";
		this.filterType = fieldset.appendChild(new FilterType());
		this.filterCutoff = fieldset.appendChild(new FilterCutoff());
		this.filterEnv = fieldset.appendChild(new EnvModule(EnvModule.USE_SR, EnvModule.USE_DEPTH));
		this.filterLfo = fieldset.appendChild(new LfoModule(24000, "Hz", KnobInput.CURVED));

		fieldset = this.appendChild(document.createElement("fieldset"));
		legend = fieldset.appendChild(document.createElement("legend"));
		legend.innerHTML = "Amp";
		this.ampGain = fieldset.appendChild(new AmpGain());
		this.ampEnv = fieldset.appendChild(new EnvModule(EnvModule.USE_SR, EnvModule.NO_DEPTH));
		this.ampLfo = fieldset.appendChild(new LfoModule(1, "", true));

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
		
		patch.freqLfo.shape.input.value = this.freqLfo.shape.input.value;
		patch.freqLfo.freq.input.value = this.freqLfo.freq.input.value;
		patch.freqLfo.depth.input.value = this.freqLfo.depth.input.value;
		
		patch.filterType.input.value = this.filterType.input.value;
		patch.filterCutoff.input.value = this.filterCutoff.input.value;

		patch.filterEnv.attack.input.value = this.filterEnv.attack.input.value;
		patch.filterEnv.decay.input.value = this.filterEnv.decay.input.value;
		patch.filterEnv.sustain.input.value = this.filterEnv.sustain.input.value;
		patch.filterEnv.release.input.value = this.filterEnv.release.input.value;

		patch.filterLfo.shape.input.value = this.filterLfo.shape.input.value;
		patch.filterLfo.freq.input.value = this.filterLfo.freq.input.value;
		patch.filterLfo.depth.input.value = this.filterLfo.depth.input.value;
		
		patch.ampGain.input.value = this.ampGain.input.value;
		patch.ampEnv.attack.input.value = this.ampEnv.attack.input.value;
		patch.ampEnv.decay.input.value = this.ampEnv.decay.input.value;
		patch.ampEnv.sustain.input.value = this.ampEnv.sustain.input.value;
		patch.ampEnv.release.input.value = this.ampEnv.release.input.value;

		patch.ampLfo.shape.input.value = this.ampLfo.shape.input.value;
		patch.ampLfo.freq.input.value = this.ampLfo.freq.input.value;
		patch.ampLfo.depth.input.value = this.ampLfo.depth.input.value;
		
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
		osc.frequency.linearRampToValueAtTime(key.freq + (key.freq * this.freqEnv.Depth), audioContext.currentTime + this.freqEnv.Attack);
		osc.frequency.linearRampToValueAtTime(key.freq, audioContext.currentTime + this.freqEnv.Decay);
		osc.detune.value = this.oscShift.Cents + this.oscDetune.Cents;
		osc.start();
		this.oscillators.push(osc);

		let freqLfo = this.freqLfo.makeSound(audioContext, key);
		freqLfo.connect(osc.detune);

		let filter = audioContext.createBiquadFilter();
		filter.calumKey = key;
		filter.type = this.filterType.Value;
		filter.frequency.value = this.filterCutoff.Value;
		let target = this.filterCutoff.Value + (this.filterCutoff.Value * this.filterEnv.Depth);
		let delta = target - this.filterCutoff.Value;
		filter.frequency.linearRampToValueAtTime(target, audioContext.currentTime + this.filterEnv.Attack);
		filter.frequency.linearRampToValueAtTime(this.filterCutoff.Value + (delta * this.filterEnv.Sustain), audioContext.currentTime + this.filterEnv.Decay);
		this.filters.push(filter);

		let filterLfo = this.filterLfo.makeSound(audioContext, key);
		filterLfo.connect(filter.detune);

		let gain = audioContext.createGain();
		gain.calumKey = key;
		gain.gain.value = 0.0;
		gain.gain.linearRampToValueAtTime(this.ampGain.Value, audioContext.currentTime + this.ampEnv.Attack);
		gain.gain.linearRampToValueAtTime(this.ampGain.Value * this.ampEnv.Sustain, audioContext.currentTime + this.ampEnv.Decay);
		this.gains.push(gain);

		let ampLfo = this.ampLfo.makeSound(audioContext, key);
		ampLfo.connect(gain.gain);

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
		
		this.freqLfo.updateSound();

		for (let filter of this.filters){
			filter.type = this.filterType.Value;
			filter.frequency.value = this.filterCutoff.Value;
		}

		this.filterLfo.updateSound();

		for (let gain of this.gains){
			gain.gain.value = this.ampGain.Value;
		}

		this.ampLfo.updateSound();

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
			filter.frequency.cancelScheduledValues(0.0);
			filter.frequency.linearRampToValueAtTime(this.filterCutoff.Value, audioContext.currentTime + this.filterEnv.Release);
			let index = this.filters.findIndex(f => f == filter);
			this.filters.splice(index, 1);
		}

		let matchingGains = this.gains.filter(g => g.calumKey == key);
		for (let gain of matchingGains){
			gain.gain.cancelScheduledValues(0.0);
			gain.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + this.ampEnv.Release);
			let index = this.gains.findIndex(g => g == gain);
			this.gains.splice(index, 1);
		}

		setTimeout(() => {
			this.freqLfo.stopSound(audioContext, key);
			matchingOsc.forEach(o => { o.stop(); o.disconnect(); });
			this.filterLfo.stopSound(audioContext, key);
			matchingFilters.forEach(f => { f.disconnect(); });
			this.ampLfo.stopSound(audioContext, key);
			matchingGains.forEach(g => { g.disconnect(); });
		}, this.ampEnv.ReleaseMs);
		
		return true;
	}
}

customElements.define("synth-module", SynthModule, { extends: "form" });

