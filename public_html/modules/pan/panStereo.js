class PanStereo extends KnobInput {
	static PAN_MIN = 0;
	static PAN_MAX = 1;
	static PAN_DEF = 0;

	constructor(){
		super("Pan", PanStereo.PAN_MIN, PanStereo.PAN_MAX, "", KnobInput.DP_CENT, PanStereo.PAN_DEF, KnobInput.LINEAR, KnobInput.REFLECT);
		super.setAttribute("is", "pan-stereo");
	}

	setTitle(){
		// Override display of units
		let title = "";
		let value = this.input.value;
		if (value == 0){
			title = "Centre";
		}
		else if (value < 0){
			title = `${this.input.value}% Left`;
		}
		else {
			title = `${this.input.value}% Right`;
		}

		this.input.setAttribute("title", title);
		this.span.innerHTML = title;
	}
}

customElements.define("pan-stereo", PanStereo, { extends: "div" });

