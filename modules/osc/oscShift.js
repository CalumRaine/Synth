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
		// Convert percentage to value between min-max
		// Called when MIDI knob turned and input has focus
		let fraction = percent / 100;
		let range = OscShift.MAX - OscShift.MIN;
		let value = OscShift.MIN + (range * fraction);
		this.input.value = Math.round(value);
		this.input.setAttribute("value", this.input.value);
		this.input.setAttribute("title", `${this.input.value} ${Math.abs(this.input.value) == 1 ? "note" : "notes"}`);

		// Prompt parent to update sound on the fly
		this.dispatchEvent(new Event("input", { bubbles: true }));
	}

	get Cents(){
		return parseInt(this.Value * 100);
	}
}

customElements.define("osc-shift", OscShift, { extends: "div" });

