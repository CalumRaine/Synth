class AmpGain extends KnobInput {
	static AMP_MIN = 0;
	static AMP_MAX = 1;
	static AMP_DEF = 50;

	init(){
		super.init("Gain", AmpGain.AMP_MIN, AmpGain.AMP_MAX, "", KnobInput.DP_CENT, AmpGain.AMP_DEF, KnobInput.LINEAR, KnobInput.NO_REFLECT);
		return this;
	}
}

customElements.define("amp-gain", AmpGain);

