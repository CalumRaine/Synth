class EnvModule extends HTMLFieldSetElement {
	static TIME_MIN = 0;
	static TIME_MAX = 10000;
	static TIME_UNIT = "ms";
	
	static SUS_MIN = 0;
	static SUS_MAX = 100;
	static SUS_UNIT = "%";

	// Not all envelopes need sustain + release
	// i.e. frequency glide
	static USE_SR = true;
	static NO_SR = false;

	// Not all envelopes need depth
	// i.e. amplifier because goes from/to 0 db
	static USE_DEPTH = true;
	static NO_DEPTH = false;

	static DEPTH_MIN = 0;
	static DEPTH_MAX = 100;
	static DEPTH_UNIT = "%";
	
	attack = null;
	decay = null;
	sustain = null;
	release = null;
	depth = null;

	constructor(useSustainRelease, useDepth){
		super();
		let legend = this.appendChild(document.createElement("legend"));
		legend.innerHTML = "Envelope";
		this.attack = this.appendChild(new KnobInput("Attack", EnvModule.TIME_MIN, EnvModule.TIME_MAX, EnvModule.TIME_UNIT, KnobInput.DP_INT, 0, KnobInput.CURVED, KnobInput.NO_REFLECT));
		this.decay = this.appendChild(new KnobInput("Decay", EnvModule.TIME_MIN, EnvModule.TIME_MAX, EnvModule.TIME_UNIT, KnobInput.DP_INT, 0, KnobInput.CURVED, KnobInput.NO_REFLECT));
		
		if (useSustainRelease){
			this.sustain = this.appendChild(new KnobInput("Sustain", EnvModule.SUS_MIN, EnvModule.SUS_MAX, EnvModule.SUS_UNIT, KnobInput.DP_CENT, 100, KnobInput.LINEAR, KnobInput.NO_REFLECT));
			this.release = this.appendChild(new KnobInput("Release", EnvModule.TIME_MIN, EnvModule.TIME_MAX, EnvModule.TIME_UNIT, KnobInput.DP_INT, 0, KnobInput.CURVED, KnobInput.NO_REFLECT));
		}
		
		if (useDepth){
			this.depth = this.appendChild(new KnobInput("Depth", EnvModule.DEPTH_MIN, EnvModule.DEPTH_MAX, EnvModule.DEPTH_UNIT, KnobInput.DP_CENT, 0, KnobInput.LINEAR, KnobInput.REFLECT));
		}
	}

	duplicate(){
		let dupe = new EnvModule(this.sustain != null && this.release != null, this.depth != null);

		dupe.attack.input.value = this.attack.input.value;
		dupe.attack.knobToParam();

		dupe.decay.input.value = this.decay.input.value;
		dupe.decay.knobToParam();

		if (this.sustain != null){
			dupe.sustain.input.value = this.sustain.input.value;
			dupe.sustain.knobToParam();
		}
		
		if (this.release != null){
			dupe.release.input.value = this.release.input.value;
			dupe.release.knobToParam();
		}

		if (this.depth != null){
			dupe.depth.input.value = this.depth.input.value;
			dupe.depth.knobToParam();
		}

		return dupe;
	}

	get Attack(){
		// As seconds
		return this.attack.Value / 1000;
	}

	get Decay(){
		// As seconds
		return (this.attack.Value + this.decay.Value) / 1000;
	}

	get Sustain(){
		// As fraction
		return this.sustain.Value / 100;
	}

	get Release(){
		// As seconds
		return this.release.Value / 1000;
	}

	get ReleaseMs(){
		// As milliseconds
		return this.release.Value;
	}
	
	get Depth(){
		// As fraction
		return this.depth.Value / 100;
	}
}

customElements.define("env-module", EnvModule, { extends: "fieldset" });

