class EnvModule extends CalumFieldset {
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
	help = null;

	init(useSustainRelease, useDepth, helpText){
		super.init("Envelope");
		this.attack = this.appendChild(new KnobInput().init("Attack", EnvModule.TIME_MIN, EnvModule.TIME_MAX, EnvModule.TIME_UNIT, KnobInput.DP_INT, 0, KnobInput.CURVED, KnobInput.NO_REFLECT));
		this.decay = this.appendChild(new KnobInput().init("Decay", EnvModule.TIME_MIN, EnvModule.TIME_MAX, EnvModule.TIME_UNIT, KnobInput.DP_INT, 0, KnobInput.CURVED, KnobInput.NO_REFLECT));
		
		if (useSustainRelease){
			this.sustain = this.appendChild(new KnobInput().init("Sustain", EnvModule.SUS_MIN, EnvModule.SUS_MAX, EnvModule.SUS_UNIT, KnobInput.DP_CENT, 100, KnobInput.LINEAR, KnobInput.NO_REFLECT));
			this.release = this.appendChild(new KnobInput().init("Release", EnvModule.TIME_MIN, EnvModule.TIME_MAX, EnvModule.TIME_UNIT, KnobInput.DP_INT, 0, KnobInput.CURVED, KnobInput.NO_REFLECT));
		}
		
		if (useDepth){
			this.depth = this.appendChild(new KnobInput().init("Depth", EnvModule.DEPTH_MIN, EnvModule.DEPTH_MAX, EnvModule.DEPTH_UNIT, KnobInput.DP_CENT, 0, KnobInput.CURVED, KnobInput.REFLECT));
		}

		this.help = this.appendChild(new HelpButton().init(helpText));
		return this;
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

	toJson(){
		let json = {};
		json.attack = this.attack.toJson();
		json.decay = this.decay.toJson();
		json.sustain = this.sustain?.toJson();
		json.release = this.release?.toJson();
		json.depth = this.depth?.toJson();
		return json;
	}

	fromJson(json){
		this.attack.fromJson(json.attack);
		this.decay.fromJson(json.decay);

		if (this.sustain != null){
			this.sustain.fromJson(json.sustain);
		}

		if (this.release != null){
			this.release.fromJson(json.release);
		}

		if (this.depth != null){
			this.depth.fromJson(json.depth);
		}

		return true;
	}
}

customElements.define("env-module", EnvModule);

