class PanParams extends HTMLFieldSetElement {
	pan = null;
	help = null;

	constructor(helpText){
		super();
		super.setAttribute("is", "pan-params");

		let legend = this.appendChild(document.createElement("legend"));
		legend.innerHTML = "Parameters";

		this.pan = this.appendChild(new PanStereo());
		this.help = this.appendChild(new HelpButton(helpText));
	}

	duplicate(){
		let dupe = new PanParams();

		dupe.pan.input.value = this.pan.input.value;
		dupe.pan.knobToParam();

		return dupe;
	}

	toJson(){
		let json = {};
		json.pan = this.pan.toJson();
		return json;
	}

	fromJson(json){
		this.pan.fromJson(json.pan);
		return true;
	}
}

customElements.define("pan-params", PanParams, { extends: "fieldset" });

