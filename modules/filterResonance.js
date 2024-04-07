class FilterResonance extends LabelledInput {
	static LOWER = 0.0001;
	static UPPER = 1000;
	static DEFAULT = 1;
	constructor(){
		super("Resonance");
		super.setAttribute("is", "filter-resonance");
		
		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "number");
		this.input.setAttribute("value", FilterResonance.DEFAULT);
		this.input.setAttribute("step", 1);
		this.input.setAttribute("min", FilterCutoff.LOWER);
		this.input.setAttribute("max", FilterCutoff.UPPER);
	}
}

customElements.define("filter-resonance", FilterResonance, { extends: "div" });

