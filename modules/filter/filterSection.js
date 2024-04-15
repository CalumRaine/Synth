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

	stopSound(audioContext, key, delay){
		let matchingFilters = this.filters.filter(f => f.calumKey == key);
		for (let filter of matchingFilters){
			filter.frequency.cancelScheduledValues(0.0);
			filter.frequency.linearRampToValueAtTime(this.params.cutoff.Value, audioContext.currentTime + this.env.Release);
			this.filters.splice(this.filters.findIndex(f => f == filter), 1);
		}

		setTimeout(() => {
			this.lfo.stopSound(audioContext, key);
			matchingFilters.forEach(f => f.disconnect());
		}, delay);

		return true;
	}

	paramsHelpText(){
		return `
			<li>Remove or enhance frequencies around the cutoff value</li>
		`;
	}

	envHelpText(){
		return `
			<li>Positive depth: target position between cutoff frequency and upper limit (24kHz)</li>
			<li>Negative depth: target position between cutoff frequency and lower limit (0Hz)</li>
			<li>Attack: time taken to glide from cutoff frequency to target frequency</li>
			<li>Decay: time taken to glide from target frequency to sustain frequency</li>
			<li>Sustain: position between cutoff frequency and target frequency to hold until release</li>
			<li>Release: time taken to glide from sustain frequency back to cutoff frequency</li>
		`;
	}

	lfoHelpText(){
		return `
			<li>Depth: modulate filter by specified Hz either side of cutoff frequency</li>
			<li>Freq: modulate filter at specified speed</li>
			<li>Sync on: all pressed keys modulate together</li>
			<li>Sync off: each pressed key spawns its own modulation wave</li>
		`;
	}
}

customElements.define("filter-section", FilterSection, { extends: "fieldset" });

