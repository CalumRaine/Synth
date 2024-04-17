class FilterSection extends HTMLFieldSetElement {
	params = null;
	env = null;
	lfo = null;
	filters = [];

	constructor(){
		super();
		super.setAttribute("is", "filter-section");
		this.appendChild(document.createElement("legend")).innerHTML = "Filter";
		this.params = this.appendChild(new FilterParams(this.paramsHelpText()));
		this.env = this.appendChild(new EnvModule(EnvModule.USE_SR, EnvModule.USE_DEPTH, this.envHelpText()));
		this.lfo = this.appendChild(new LfoModule(24000, "Hz", KnobInput.CURVED, this.lfoHelpText()));
		this.addEventListener("input", (event) => { this.updateSound(); });
	}

	makeSound(audioContext, key){
		let filter = audioContext.createBiquadFilter();
		filter.calumKey = key;
		filter.type = this.params.type.Value;
		filter.frequency.value = this.params.cutoff.Value;

		// Filter env depth adds/subtracts 0-100% of the remainder above/below the cutoff
		// i.e. from 0Hz to 20Khz
		let target = this.env.Depth >= 0 ? (this.params.cutoff.paramMax - this.params.cutoff.Value) : (this.params.cutoff.Value + this.params.cutoff.paramMax);
		target *= this.env.Depth;
		target += this.params.cutoff.Value;

		let delta = target - this.params.cutoff.Value;

		filter.frequency.linearRampToValueAtTime(target, audioContext.currentTime + this.env.Attack);
		filter.frequency.linearRampToValueAtTime(this.params.cutoff.Value + (delta * this.env.Sustain), audioContext.currentTime + this.env.Decay);

		this.lfo.makeSound(audioContext, key).connect(filter.detune);

		this.filters.push(filter);
		return filter;
	}

	updateSound(){
		for (let filter of this.filters){
			filter.type = this.params.type.Value;
			filter.frequency.value = this.params.cutoff.Value;
		}

		return true;
	}

	stopSound(audioContext, key, delayMs){
		this.lfo.stopSound(audioContext, key, delayMs);

		let matchingFilters = this.filters.filter(f => f.calumKey == key);
		for (let filter of matchingFilters){
			filter.frequency.cancelScheduledValues(0.0);
			filter.frequency.linearRampToValueAtTime(this.params.cutoff.Value, audioContext.currentTime + this.env.Release);
			let index = this.filters.findIndex(f => f == filter);
			this.filters.splice(index, 1);
		}

		setTimeout(() => {
			matchingFilters.forEach(f => f.disconnect());
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
			<li>Remove or enhance frequencies around the cutoff value.</li>
		`;
	}

	envHelpText(){
		return `
			<li>Positive depth = target this position between the cutoff frequency and upper frequency limit (24kHz).</li>
			<li>Negative depth = target this position between the cutoff frequency and lower frequency limit (0Hz).</li>
			<li>Attack = time taken to glide from the cutoff frequency to the target frequency.</li>
			<li>Decay = time taken to glide from the target frequency to the sustain frequency.</li>
			<li>Sustain = hold this position between the cutoff frequency and target frequency until the key is released.</li>
			<li>Release = time taken to glide from the sustain frequency back to the cutoff frequency when the key is released.</li>
		`;
	}

	lfoHelpText(){
		return `
			<li>Depth = modulate filter by the specified Hz either side of the cutoff frequency.</li>
			<li>Freq = modulate filter at this specified speed.</li>
			<li>Attack = time until modulation fades in.</li>
			<li>Sync on = all pressed keys modulate together.</li>
			<li>Sync off = each pressed key spawns its own modulation wave.</li>
		`;
	}
}

customElements.define("filter-section", FilterSection, { extends: "fieldset" });

