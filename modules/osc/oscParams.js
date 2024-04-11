class OscParams extends HTMLFieldSetElement {
	shape = null;
	shift = null;
	detune = null;
	constructor(){
		super();
		super.setAttribute("is", "osc-params");

		let legend = this.appendChild(document.createElement("legend"));
		legend.innerHTML = "Parameters";

		this.shape = this.appendChild(new OscShape());
		this.shift = this.appendChild(new OscShift());
		this.detune = this.appendChild(new OscDetune());
	}
}

customElements.define("osc-params", OscParams, { extends: "fieldset" });

