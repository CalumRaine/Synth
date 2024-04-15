class FilterSection extends HTMLFieldSetElement {
	params = null;
	env = null;
	lfo = null;
	filters = [];

	constructor(){
		super();
		super.setAttribute("is", "filter-section");
		this.appendChild(document.createElement("legend")).innerHTML = "Filter";
		this.params = this.appendChild(new FilterParams());
		this.env = this.appendChild(new EnvModule(EnvModule.USE_SR, EnvModule.USE_DEPTH));
		this.lfo = this.appendChild(new LfoModule(24000, "Hz", KnobInput.CURVED));
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
}

customElements.define("filter-section", FilterSection, { extends: "fieldset" });

