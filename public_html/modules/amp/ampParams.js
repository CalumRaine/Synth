class AmpParams extends HTMLFieldSetElement {
	gain = null;
	help = null;

	constructor(helpText){
		super();
		super.setAttribute("is", "amp-params");

		let legend = this.appendChild(document.createElement("legend"));
		legend.innerHTML = "Parameters";

		this.gain = this.appendChild(new AmpGain());
		this.help = this.appendChild(new HelpButton(helpText));
	}

	toJson(){
		let json = {};
		json.gain = this.gain.toJson();
		return json;
	}

	fromJson(json){
		this.gain.fromJson(json.gain);
		return true;
	}
}

customElements.define("amp-params", AmpParams, { extends: "fieldset" });

