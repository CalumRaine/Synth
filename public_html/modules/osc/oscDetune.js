class OscDetune extends KnobInput {
	static MIN = 0;
	static MAX = 200;
	static DEF = 0;
	static UNIT = "Cent";
	
	constructor(){
		super("Detune", OscDetune.MIN, OscDetune.MAX, OscDetune.UNIT, KnobInput.DP_INT, OscDetune.DEF, KnobInput.LINEAR, KnobInput.REFLECT);
		super.setAttribute("is", "osc-detune");
	}

	get Cents(){
		return this.Value;
	}
}

customElements.define("osc-detune", OscDetune, { extends: "div" });
