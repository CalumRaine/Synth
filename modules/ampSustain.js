class AmpSustain extends LabelledInput {
	static LOWER = 0;
	static UPPER = 1;
	static DEFAULT = 0.5;
	constructor(){
		super("Sustain");
		super.setAttribute("is", "amp-sustain");
		
		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "number");
		this.input.setAttribute("value", AmpSustain.DEFAULT);
		this.input.setAttribute("step", 0.1);
		this.input.setAttribute("min", AmpSustain.LOWER);
		this.input.setAttribute("max", AmpSustain.UPPER);
	}
}

customElements.define("amp-sustain", AmpSustain, { extends: "div" });

