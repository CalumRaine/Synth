class FilterCutoff extends KnobInput { 
	static MIN = 20;
	static MAX = 24000;
	static DEF = 100;
	static UNIT = "Hz";
	
	init(){
		super.init("Cutoff", FilterCutoff.MIN, FilterCutoff.MAX, FilterCutoff.UNIT, KnobInput.DP_FREQ, FilterCutoff.DEF, KnobInput.CURVED, KnobInput.NO_REFLECT);
		return this;
	}
}

customElements.define("filter-cutoff", FilterCutoff);

