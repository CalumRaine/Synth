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

	panParams = null;
	panEnv = null;
	panLfo = null;

	oscillators = [];
	filters = [];
	gains = [];
	pans = [];

	constructor(name){
		super();
		super.setAttribute("is", "synth-module");

		this.header = this.appendChild(document.createElement("h2"));
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
		this.ampLfo = fieldset.appendChild(new LfoModule(1, "", KnobInput.LINEAR));

		fieldset = this.appendChild(document.createElement("fieldset"));
		legend = fieldset.appendChild(document.createElement("legend"));
		legend.innerHTML = "Pan";
		this.panParams = fieldset.appendChild(new PanParams());
		this.panEnv = fieldset.appendChild(new EnvModule(EnvModule.USE_SR, EnvModule.USE_DEPTH));
		this.panLfo = fieldset.appendChild(new LfoModule(1, "", KnobInput.LINEAR));

		let buttons = this.appendChild(new ModuleButtons());
		buttons.duplicate.addEventListener("click", (event) => { this.duplicateModule(event); });
		buttons.remove.addEventListener("click", (event) => { this.removeModule(event); });

		this.addEventListener("input", (event) => { this.updateSound(); });
	
		// Default setup
		// - Triangle oscillator (sine too quiet)
		// - 13% amp release (prevent popping)
		this.oscParams.shape.select.value = "triangle";
		this.ampEnv.release.percentToParam(13);
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
		let target = this.filterEnv.Depth >= 0 ? (this.filterParams.cutoff.paramMax - this.filterParams.cutoff.Value) : (this.filterParams.cutoff.Value + this.filterParams.cutoff.paramMax);
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

		let pan = audioContext.createStereoPanner();
		pan.calumKey = key;
		pan.pan.value = this.panParams.pan.Value;
		target = this.panEnv.Depth >= 0 ? (this.panParams.pan.paramMax - this.panParams.pan.Value) : (this.panParams.pan.Value + this.panParams.pan.paramMax);
		target *= this.panEnv.Depth;
		target += this.panParams.pan.Value;
		delta = target - this.panParams.pan.Value;
		pan.pan.linearRampToValueAtTime(target, audioContext.currentTime + this.panEnv.Attack);
		pan.pan.linearRampToValueAtTime(this.panParams.pan.Value + (delta * this.panEnv.Sustain), audioContext.currentTime + this.panEnv.Decay);
		this.pans.push(pan);

		let panLfo = this.panLfo.makeSound(audioContext, key);
		panLfo.connect(pan.pan);

		osc.connect(filter);
		filter.connect(gain);
		gain.connect(pan);
		pan.connect(speakers);

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

		for (let pan of this.pans){
			pan.pan.value = this.panParams.pan.Value;
		}

		this.panLfo.updateSound();

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

		let matchingPans = this.pans.filter(p => p.calumKey == key);
		for (let pan of matchingPans){
			pan.pan.cancelScheduledValues(0.0);
			pan.pan.linearRampToValueAtTime(this.panParams.pan.Value, audioContext.currentTime + this.panEnv.Release);
			let index = this.pans.findIndex(p => p == pan);
			this.pans.splice(index, 1);
		}

		setTimeout(() => {
			this.freqLfo.stopSound(audioContext, key);
			matchingOsc.forEach(o => { o.stop(); o.disconnect(); });
			this.filterLfo.stopSound(audioContext, key);
			matchingFilters.forEach(f => { f.disconnect(); });
			this.ampLfo.stopSound(audioContext, key);
			matchingGains.forEach(g => { g.disconnect(); });
			this.panLfo.stopSound(audioContext, key);
			matchingPans.forEach(p => { p.disconnect(); });
		}, this.ampEnv.ReleaseMs);
		
		return true;
	}

	toJson(){
		let json = {};
		json.name = this.header.innerHTML;
		
		json.oscParams = this.oscParams.toJson();
		json.freqEnv = this.freqEnv.toJson();
		json.freqLfo = this.freqLfo.toJson();
		
		json.filterParams = this.filterParams.toJson();
		json.filterEnv = this.filterEnv.toJson();
		json.filterLfo = this.filterLfo.toJson();
		
		json.ampParams = this.ampParams.toJson();
		json.ampEnv = this.ampEnv.toJson();
		json.ampLfo = this.ampLfo.toJson();

		json.panParams = this.panParams.toJson();
		json.panEnv = this.panEnv.toJson();
		json.panLfo = this.panLfo.toJson();

		return json;
	}

	fromJson(json){
		this.header.innerHTML = json.name;

		this.oscParams.fromJson(json.oscParams);
		this.freqEnv.fromJson(json.freqEnv);
		this.freqLfo.fromJson(json.freqLfo);
		
		this.filterParams.fromJson(json.filterParams);
		this.filterEnv.fromJson(json.filterEnv);
		this.filterLfo.fromJson(json.filterLfo);

		this.ampParams.fromJson(json.ampParams);
		this.ampEnv.fromJson(json.ampEnv);
		this.ampLfo.fromJson(json.ampLfo);

		this.panParams.fromJson(json.panParams);
		this.panEnv.fromJson(json.panEnv);
		this.panLfo.fromJson(json.panLfo);

		return true;
	}
}

customElements.define("synth-module", SynthModule, { extends: "form" });

