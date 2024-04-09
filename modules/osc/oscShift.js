class OscShift extends LabelledInput {
	static MAX = 24;
	static MIN = -24;
	static DEFAULT = 0;
	constructor(){
		super("Shift");
		super.setAttribute("is", "osc-shift");
		
		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "number");
		this.input.setAttribute("value", OscShift.DEFAULT);
		this.input.setAttribute("title", `${this.input.value} ${Math.abs(this.input.value) == 1 ? "note" : "notes"}`);
		this.input.setAttribute("step", 1);
		this.input.setAttribute("min", OscShift.MIN);
		this.input.setAttribute("max", OscShift.MAX);
		this.input.setPercent = (percent) => { this.Percent = percent; };
	}

	set Percent(percent){
		let fraction = percent / 100;
		let range = OscShift.MAX - OscShift.MIN;
		let value = OscShift.MIN + (range * fraction);
		this.input.value = Math.round(value);
		this.input.setAttribute("value", this.input.value);
		this.input.setAttribute("title", `${this.input.value} ${Math.abs(this.input.value) == 1 ? "note" : "notes"}`);
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

