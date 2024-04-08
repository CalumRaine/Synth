class EnvRelease extends LabelledInput {
	static LOWER = 0;
	static UPPER = 10000;
	static DEFAULT = 0;
	constructor(){
		super("Release");
		super.setAttribute("is", "env-release");
		
		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "number");
		this.input.setAttribute("value", EnvRelease.DEFAULT);
		this.input.setAttribute("step", 1);
		this.input.setAttribute("min", EnvRelease.LOWER);
		this.input.setAttribute("max", EnvRelease.UPPER);
	}
}

customElements.define("env-release", EnvRelease, { extends: "div" });

