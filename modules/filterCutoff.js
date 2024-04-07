class FilterCutoff extends LabelledInput {
	static LOWER = 0;
	static UPPER = 24000;
	constructor(){
		super("Cutoff");
		super.setAttribute("is", "filter-cutoff");
		
		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "number");
		this.input.setAttribute("value", FilterCutoff.UPPER);
		this.input.setAttribute("step", 1);
		this.input.setAttribute("min", FilterCutoff.LOWER);
		this.input.setAttribute("max", FilterCutoff.UPPER);
	}
}

customElements.define("filter-cutoff", FilterCutoff, { extends: "div" });

