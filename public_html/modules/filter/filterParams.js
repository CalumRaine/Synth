class FilterParams extends HTMLFieldSetElement {
	type = null;
	cutoff = null;
	help = null;

	constructor(helpText){
		super();
		super.setAttribute("is", "filter-params");

		let legend = this.appendChild(document.createElement("legend"));
		legend.innerHTML = "Parameters";

		this.type = this.appendChild(new FilterType());
		this.cutoff = this.appendChild(new FilterCutoff());
		this.help = this.appendChild(new HelpButton(helpText));
	}

	toJson(){
		let json = {};
		json.type = this.type.toJson();
		json.cutoff = this.cutoff.toJson();
		return json;
	}

	fromJson(json){
		this.type.fromJson(json.type);
		this.cutoff.fromJson(json.cutoff);
		return true;
	}
}

customElements.define("filter-params", FilterParams, { extends: "fieldset" });

