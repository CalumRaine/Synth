class AmpSustain extends VolumeInput {
	constructor(){
		super("Sustain");
		super.setAttribute("is", "amp-sustain");
	}
}

customElements.define("amp-sustain", AmpSustain, { extends: "div" });

