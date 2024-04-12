class SynthModule extends HTMLFormElement {
	header = null;

	oscParams = null;
	freqEnv = null;
	freqLfo = null;

	filterParams = null;
	filterEnv = null;
	filterLfo = null;

	ampParams = null;
	ampEnv = null;
	ampLfo = null;

	oscillators = [];
	filters = [];
	gains = [];

	constructor(name){
		super();
		super.setAttribute("is", "synth-module");

		this.header = this.appendChild(document.createElement("h1"));
		this.header.innerHTML = name;
		this.header.setAttribute("contenteditable", "true");

		let fieldset = this.appendChild(document.createElement("fieldset"));
		let legend = fieldset.appendChild(document.createElement("legend"));
		legend.innerHTML = "Oscillator";
		this.oscParams = fieldset.appendChild(new OscParams());
		this.freqEnv = fieldset.appendChild(new EnvModule(EnvModule.NO_SR, EnvModule.USE_DEPTH));
		this.freqLfo = fieldset.appendChild(new LfoModule(1200, "Cents", KnobInput.CURVED));

		fieldset = this.appendChild(document.createElement("fieldset"));
		legend = fieldset.appendChild(document.createElement("legend"));
		legend.innerHTML = "Filter";
		this.filterParams = fieldset.appendChild(new FilterParams());
		this.filterEnv = fieldset.appendChild(new EnvModule(EnvModule.USE_SR, EnvModule.USE_DEPTH));
		this.filterLfo = fieldset.appendChild(new LfoModule(24000, "Hz", KnobInput.CURVED));

		fieldset = this.appendChild(document.createElement("fieldset"));
		legend = fieldset.appendChild(document.createElement("legend"));
		legend.innerHTML = "Amp";
		this.ampParams = fieldset.appendChild(new AmpParams());
		this.ampEnv = fieldset.appendChild(new EnvModule(EnvModule.USE_SR, EnvModule.NO_DEPTH));
		this.ampLfo = fieldset.appendChild(new LfoModule(1, "", true));

		let buttons = this.appendChild(new ModuleButtons());
		buttons.duplicate.addEventListener("click", (event) => { this.duplicateModule(event); });
		buttons.remove.addEventListener("click", (event) => { this.removeModule(event); });

		this.addEventListener("input", (event) => { this.updateSound(); });
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
		let dupe = new SynthModule(`${this.header.innerHTML} (duplicate)`);
		
		let osc = this.oscParams.duplicate();
		dupe.oscParams.replaceWith(osc);
		dupe.oscParams = osc;

		let freqEnv = this.freqEnv.duplicate();
		dupe.freqEnv.replaceWith(freqEnv);
		dupe.freqEnv = freqEnv;

		let freqLfo = this.freqLfo.duplicate();
		dupe.freqLfo.replaceWith(freqLfo);
		dupe.freqLfo = freqLfo;

		let filter = this.filterParams.duplicate();
		dupe.filterParams.replaceWith(filter);
		dupe.filterParams = filter;

		let filterEnv = this.filterEnv.duplicate();
		dupe.filterEnv.replaceWith(filterEnv);
		dupe.filterEnv = filterEnv;

		let filterLfo = this.filterLfo.duplicate();
		dupe.filterLfo.replaceWith(filterLfo);
		dupe.filterLfo = filterLfo;

		let amp = this.ampParams.duplicate();
		dupe.ampParams.replaceWith(amp);
		dupe.ampParams = amp;

		let ampEnv = this.ampEnv.duplicate();
		dupe.ampEnv.replaceWith(ampEnv);
		dupe.ampEnv = ampEnv;

		let ampLfo = this.ampLfo.duplicate();
		dupe.ampLfo.replaceWith(ampLfo);
		dupe.ampLfo = ampLfo;

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
		let osc = audioContext.createOscillator();
		osc.calumKey = key;
		osc.type = this.oscParams.shape.Value;
		osc.frequency.value = key.freq;
		// Freq env depth adds/subtracts 0-100%
		// i.e. from 0Hz to one octave above current note
		osc.frequency.linearRampToValueAtTime(key.freq + (key.freq * this.freqEnv.Depth), audioContext.currentTime + this.freqEnv.Attack);
		osc.frequency.linearRampToValueAtTime(key.freq, audioContext.currentTime + this.freqEnv.Decay);
		osc.detune.value = this.oscParams.shift.Cents + this.oscParams.detune.Cents;
		osc.start();
		this.oscillators.push(osc);

		let freqLfo = this.freqLfo.makeSound(audioContext, key);
		freqLfo.connect(osc.detune);

		let filter = audioContext.createBiquadFilter();
		filter.calumKey = key;
		filter.type = this.filterParams.type.Value;
		filter.frequency.value = this.filterParams.cutoff.Value;
		// Filter env depth adds/subtracts 0-100% of the remainder above/below the cutoff
		// i.e. from 0Hz to 20kHz
		let target = this.filterEnv.Depth >= 0 ? (this.filterParams.cutoff.paramMax - this.filterParams.cutoff.Value) : this.filterParams.cutoff.Value;
		target *= this.filterEnv.Depth;
		target += this.filterParams.cutoff.Value;
		let delta = target - this.filterParams.cutoff.Value;
		filter.frequency.linearRampToValueAtTime(target, audioContext.currentTime + this.filterEnv.Attack);
		filter.frequency.linearRampToValueAtTime(this.filterParams.cutoff.Value + (delta * this.filterEnv.Sustain), audioContext.currentTime + this.filterEnv.Decay);
		this.filters.push(filter);

		let filterLfo = this.filterLfo.makeSound(audioContext, key);
		filterLfo.connect(filter.detune);

		let gain = audioContext.createGain();
		gain.calumKey = key;
		gain.gain.value = 0.0;
		gain.gain.linearRampToValueAtTime(this.ampParams.gain.Value, audioContext.currentTime + this.ampEnv.Attack);
		gain.gain.linearRampToValueAtTime(this.ampParams.gain.Value * this.ampEnv.Sustain, audioContext.currentTime + this.ampEnv.Decay);
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
			osc.detune.value = this.oscParams.shift.Cents + this.oscParams.detune.Cents;
			osc.type = this.oscParams.shape.Value;
		}
		
		this.freqLfo.updateSound();

		for (let filter of this.filters){
			filter.type = this.filterParams.type.Value;
			filter.frequency.value = this.filterParams.cutoff.Value;
		}

		this.filterLfo.updateSound();

		for (let gain of this.gains){
			gain.gain.value = this.ampParams.gain.Value;
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
			filter.frequency.linearRampToValueAtTime(this.filterParams.cutoff.Value, audioContext.currentTime + this.filterEnv.Release);
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

