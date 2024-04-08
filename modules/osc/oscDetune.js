class OscDetune extends LabelledInput {
	static LIMIT = 2;
	constructor(){
		super("Detune");
		super.setAttribute("is", "osc-detune");
		
		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "number");
		this.input.setAttribute("value", 0);
		this.input.setAttribute("step", 0.01);
		this.input.setAttribute("min", -OscDetune.LIMIT);
		this.input.setAttribute("max", OscDetune.LIMIT);
	}

	calculate(freq){
		return this.Value < 0 ? this.pitchDown(freq) : this.pitchUp(freq);
		let percent = Math.abs(this.Value) / OscDetune.LIMIT;
	}

	pitchUp(freq){
		let factor = 2 ** (1/12);
		factor **= OscDetune.LIMIT;

		let percent = Math.abs(this.Value) / OscDetune.LIMIT;
		factor **= percent;

		return freq * factor;
	}

	pitchDown(freq){
		let factor = 2 ** (-1/12);
		factor **= OscDetune.LIMIT;

		let percent = Math.abs(this.Value) / OscDetune.LIMIT;
		factor **= percent;

		return freq * factor;
	}
}

customElements.define("osc-detune", OscDetune, { extends: "div" });

