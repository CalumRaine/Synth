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

	duplicate(){
		let dupe = new OscParams();

		dupe.shape.select.value = this.shape.select.value;
		
		dupe.shift.input.value = this.shift.input.value;
		dupe.shift.knobToParam();

		dupe.detune.input.value = this.detune.input.value;
		dupe.detune.knobToParam();

		return dupe;
	}
}

customElements.define("osc-params", OscParams, { extends: "fieldset" });

