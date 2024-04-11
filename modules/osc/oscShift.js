class OscShift extends KnobInput {
	static MAX = 24;
	static MIN = 0;
	static DEF = 0;
	static UNIT = "Notes";
	constructor(){
		super("Shift", OscShift.MIN, OscShift.MAX, OscShift.UNIT, OscShift.DEF, KnobInput.LINEAR, KnobInput.REFLECT);
		super.setAttribute("is", "osc-shift");
	}

	get Cents(){
		return parseInt(this.Value * 100);
	}
}

customElements.define("osc-shift", OscShift, { extends: "div" });

