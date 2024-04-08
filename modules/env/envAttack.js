class EnvAttack extends LabelledInput {
	static LOWER = 0;
	static UPPER = 10000;
	static DEFAULT = 0;
	constructor(){
		super("Attack");
		super.setAttribute("is", "env-attack");
		
		this.input = this.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "number");
		this.input.setAttribute("value", EnvAttack.DEFAULT);
		this.input.setAttribute("step", 1);
		this.input.setAttribute("min", EnvAttack.LOWER);
		this.input.setAttribute("max", EnvAttack.UPPER);
	}
}

customElements.define("env-attack", EnvAttack, { extends: "div" });

