class AmpGain extends VolumeInput {
	constructor(){
		super("Gain");
		super.setAttribute("is", "amp-gain");
	}
}

customElements.define("amp-gain", AmpGain, { extends: "div" });

