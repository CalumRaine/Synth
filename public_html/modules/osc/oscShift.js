class OscShift extends KnobInput {
	static MAX = 24;
	static MIN = 0;
	static DEF = 0;
	static UNIT = "Note";

	constructor(){
		super("Shift", OscShift.MIN, OscShift.MAX, OscShift.UNIT, KnobInput.DP_INT, OscShift.DEF, KnobInput.LINEAR, KnobInput.REFLECT);
		super.setAttribute("is", "osc-shift");
	}

	get Cents(){
		return parseInt(this.Value * 100);
	}
}

customElements.define("osc-shift", OscShift, { extends: "div" });

