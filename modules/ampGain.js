class AmpGain extends LabelledInput {
	static LOWER = 0;
	static UPPER = 1;
	static DEFAULT = 0.5;
	constructor(){
		super("Gain");
		super.setAttribute("is", "amp-gain");
		
		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "number");
		this.input.setAttribute("value", AmpGain.DEFAULT);
		this.input.setAttribute("step", 0.1);
		this.input.setAttribute("min", AmpGain.LOWER);
		this.input.setAttribute("max", AmpGain.UPPER);
	}
}

customElements.define("amp-gain", AmpGain, { extends: "div" });

