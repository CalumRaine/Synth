class EnvDecay extends LabelledInput {
	static LOWER = 0;
	static UPPER = 10000;
	static DEFAULT = 0;
	constructor(){
		super("Decay");
		super.setAttribute("is", "env-decay");
		
		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "number");
		this.input.setAttribute("value", EnvDecay.DEFAULT);
		this.input.setAttribute("step", 1);
		this.input.setAttribute("min", EnvDecay.LOWER);
		this.input.setAttribute("max", EnvDecay.UPPER);
	}
}

customElements.define("env-decay", EnvDecay, { extends: "div" });

