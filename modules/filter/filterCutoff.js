class FilterCutoff extends NumericalInput {
	static MIN = 20;
	static MAX = 24000;
	static DEFAULT = 24000;
	constructor(){
		super("Cutoff", FilterCutoff.DEFAULT, FilterCutoff.MIN, FilterCutoff.MAX, true, "Hz");
		super.setAttribute("is", "filter-cutoff");
	}
}

customElements.define("filter-cutoff", FilterCutoff, { extends: "div" });

