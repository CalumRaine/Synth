class EnvDecay extends TimeInput {
	constructor(){
		super("Decay");
		super.setAttribute("is", "env-decay");
	}
}

customElements.define("env-decay", EnvDecay, { extends: "div" });

