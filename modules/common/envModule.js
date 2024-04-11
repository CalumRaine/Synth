class EnvModule extends HTMLFieldSetElement {
	static TIME_MIN = 0;
	static TIME_MAX = 10000;
	static TIME_UNIT = "ms";
	
	static SUS_MIN = 0;
	static SUS_MAX = 100;
	static SUS_UNIT = "%";
	
	attack = null;
	decay = null;
	sustain = null;
	release = null;

	constructor(units){
		super();
		let legend = this.appendChild(document.createElement("legend"));
		legend.innerHTML = "Envelope";
		this.attack = this.appendChild(new KnobInput("Attack", EnvModule.TIME_MIN, EnvModule.TIME_MAX, EnvModule.TIME_UNIT, 0, KnobInput.CURVED, KnobInput.NO_REFLECT));
		this.decay = this.appendChild(new KnobInput("Decay", EnvModule.TIME_MIN, EnvModule.TIME_MAX, EnvModule.TIME_UNIT, 0, KnobInput.CURVED, KnobInput.NO_REFLECT));
		this.sustain = this.appendChild(new KnobInput("Sustain", EnvModule.SUS_MIN, EnvModule.SUS_MAX, EnvModule.SUS_UNIT, 100, KnobInput.LINEAR, KnobInput.NO_REFLECT));
		this.release = this.appendChild(new KnobInput("Release", EnvModule.TIME_MIN, EnvModule.TIME_MAX, EnvModule.TIME_UNIT, 0, KnobInput.CURVED, KnobInput.NO_REFLECT));
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
}

customElements.define("env-module", EnvModule, { extends: "fieldset" });

