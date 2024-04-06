class PitchDetune extends LabelledInput {
	static LIMIT = 2;
	constructor(){
		super("Detune");
		
		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "number");
		this.input.setAttribute("value", 0);
		this.input.setAttribute("step", 0.01);
		this.input.setAttribute("min", -PitchDetune.LIMIT);
		this.input.setAttribute("max", PitchDetune.LIMIT);
	}

	calculate(freq){
		return this.Value < 0 ? this.pitchDown(freq) : this.pitchUp(freq);
		let percent = Math.abs(this.Value) / PitchDetune.LIMIT;
	}

	pitchUp(freq){
		let factor = 2 ** (1/12);
		factor **= PitchDetune.LIMIT;

		let percent = Math.abs(this.Value) / PitchDetune.LIMIT;
		factor **= percent;

		return freq * factor;
	}

	pitchDown(freq){
		let factor = 2 ** (-1/12);
		factor **= PitchDetune.LIMIT;

		let percent = Math.abs(this.Value) / PitchDetune.LIMIT;
		factor **= percent;

		return freq * factor;
	}
}

customElements.define("pitch-detune", PitchDetune, { extends: "div" });

