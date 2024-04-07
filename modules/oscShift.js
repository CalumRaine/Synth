class OscShift extends LabelledInput {
	constructor(){
		super("Shift");
		super.setAttribute("is", "osc-shift");
		
		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "number");
		this.input.setAttribute("value", 0);
		this.input.setAttribute("step", 1);
		this.input.setAttribute("min", -24);
		this.input.setAttribute("max", 24);
	}

	calculate(freq){
		return this.Value < 0 ? this.pitchDown(freq) : this.pitchUp(freq);
	}

	pitchUp(freq){
		let factor = 2 ** (1/12);
		factor **= this.Value;
		return freq * factor;
	}

	pitchDown(freq){
		let factor = 2 ** (-1/12);
		factor **= Math.abs(this.Value);
		return freq * factor;
	}
}

customElements.define("osc-shift", OscShift, { extends: "div" });

