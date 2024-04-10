class AmpGain extends NumericalInput {
	static AMP_MIN = 0;
	static AMP_MAX = 1;
	static AMP_DEFAULT = 0.5;
	constructor(){
		super("Gain", AmpGain.AMP_DEFAULT, AmpGain.AMP_MIN, AmpGain.AMP_MAX, false, "");
		super.setAttribute("is", "amp-gain");
	}
}

customElements.define("amp-gain", AmpGain, { extends: "div" });

