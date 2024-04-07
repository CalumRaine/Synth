class FilterGain extends LabelledInput {
	static LOWER = -40;
	static UPPER = 40;
	static DEFAULT = 0;
	constructor(){
		super("Gain");
		super.setAttribute("is", "filter-gain");
		
		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "number");
		this.input.setAttribute("value", FilterGain.DEFAULT);
		this.input.setAttribute("step", 1);
		this.input.setAttribute("min", FilterGain.LOWER);
		this.input.setAttribute("max", FilterGain.UPPER);
	}
}

customElements.define("filter-gain", FilterGain, { extends: "div" });

