class EnvAttack extends TimeInput {
	constructor(){
		super("Attack");
		super.setAttribute("is", "env-attack");
	}
}

customElements.define("env-attack", EnvAttack, { extends: "div" });

