class EnvRelease extends TimeInput {
	constructor(){
		super("Release");
		super.setAttribute("is", "env-release");
	}
}

customElements.define("env-release", EnvRelease, { extends: "div" });

