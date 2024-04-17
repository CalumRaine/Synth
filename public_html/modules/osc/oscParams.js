class OscParams extends HTMLFieldSetElement {
	shape = null;
	shift = null;
	detune = null;
	help = null;

	constructor(helpText){
		super();
		super.setAttribute("is", "osc-params");

		let legend = this.appendChild(document.createElement("legend"));
		legend.innerHTML = "Parameters";

		this.shape = this.appendChild(new OscShape());
		this.shift = this.appendChild(new OscShift());
		this.detune = this.appendChild(new OscDetune());

		this.help = this.appendChild(new HelpButton(helpText));
	}

	toJson(){
		let json = {};
		json.shape = this.shape.toJson();
		json.shift = this.shift.toJson();
		json.detune = this.detune.toJson();
		return json;
	}

	fromJson(json){
		this.shape.fromJson(json.shape);
		this.shift.fromJson(json.shift);
		this.detune.fromJson(json.detune);
		return true;
	}
}

customElements.define("osc-params", OscParams, { extends: "fieldset" });
