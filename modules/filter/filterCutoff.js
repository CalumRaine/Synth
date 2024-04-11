class FilterCutoff extends KnobInput { 
	static MIN = 20;
	static MAX = 24000;
	static DEF = 100;
	static UNIT = "Hz";
	constructor(){
		super("Cutoff", FilterCutoff.MIN, FilterCutoff.MAX, FilterCutoff.UNIT, FilterCutoff.DEF, KnobInput.CURVED, KnobInput.NO_REFLECT);
		super.setAttribute("is", "filter-cutoff");
	}
}

customElements.define("filter-cutoff", FilterCutoff, { extends: "div" });

