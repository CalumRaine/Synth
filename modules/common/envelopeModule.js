class EnvelopeModule extends HTMLFieldSetElement {
	attack = null;
	decay = null;
	sustain = null;
	release = null;

	constructor(units){
		super();
		let legend = this.appendChild(document.createElement("legend"));
		legend.innerHTML = "Envelope";
		this.attack = this.appendChild(new NumericalInput("Attack", 0, 0, 10000, true, "ms"));
		this.decay = this.appendChild(new NumericalInput("Decay", 0, 0, 10000, true, "ms"));
		this.sustain = this.appendChild(new NumericalInput("Sustain", 100, 0, 100, false, "%"));
		this.release = this.appendChild(new NumericalInput("Release", 0, 0, 10000, true, "ms"));
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

customElements.define("envelope-module", EnvelopeModule, { extends: "fieldset" });

