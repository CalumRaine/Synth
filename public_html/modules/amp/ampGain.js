class AmpGain extends KnobInput {
	static AMP_MIN = 0;
	static AMP_MAX = 1;
	static AMP_DEF = 50;
	constructor(){
		super("Gain", AmpGain.AMP_MIN, AmpGain.AMP_MAX, "", KnobInput.DP_CENT, AmpGain.AMP_DEF, KnobInput.LINEAR, KnobInput.NO_REFLECT);
		super.setAttribute("is", "amp-gain");
	}
}

customElements.define("amp-gain", AmpGain, { extends: "div" });

