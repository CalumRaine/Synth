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
		// Convert percentage to value between min-max
		// Called when MIDI knob turned
		let fraction = percent / 100;
		let range = OscDetune.MAX - OscDetune.MIN;
		let value = OscDetune.MIN + (range * fraction);
		this.input.value = value.toFixed(2);
		this.input.setAttribute("value", this.input.value);
		this.input.setAttribute("title", `${this.input.value} cents`);

		// Prompt parent to update sound on the fly
		this.dispatchEvent(new Event("input", { bubbles: true }));
	}
	
	get Cents(){
		return parseInt(this.Value * 100);
	}
}

customElements.define("osc-detune", OscDetune, { extends: "div" });

