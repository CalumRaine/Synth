class OscDetune extends LabelledInput {
	static MIN = -2;
	static MAX = 2;
	static DEFAULT = 0;
	constructor(){
		super("Detune");
		super.setAttribute("is", "osc-detune");
		
		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "number");
		this.input.setAttribute("value", OscDetune.DEFAULT);
		this.input.setAttribute("title", `${this.input.value} cents`);
		this.input.setAttribute("step", 0.01);
		this.input.setAttribute("min", OscDetune.MIN);
		this.input.setAttribute("max", OscDetune.MAX);
		this.input.setPercent = (percent) => { this.Percent = percent; };
	}

	set Percent(percent){
		let fraction = percent / 100;
		let range = OscDetune.MAX - OscDetune.MIN;
		let value = OscDetune.MIN + (range * fraction);
		this.input.value = value.toFixed(2);
		this.input.setAttribute("value", this.input.value);
		this.input.setAttribute("title", `${this.input.value} cents`);
	}

	calculate(freq){
		return this.Value < 0 ? this.pitchDown(freq) : this.pitchUp(freq);
	}

	pitchUp(freq){
		let factor = 2 ** (1/12);
		factor **= OscDetune.MAX;

		let percent = Math.abs(this.Value) / OscDetune.MAX;
		factor **= percent;

		return freq * factor;
	}

	pitchDown(freq){
		let factor = 2 ** (-1/12);
		factor **= OscDetune.MAX;

		let percent = Math.abs(this.Value) / OscDetune.MAX;
		factor **= percent;

		return freq * factor;
	}
}

customElements.define("osc-detune", OscDetune, { extends: "div" });

