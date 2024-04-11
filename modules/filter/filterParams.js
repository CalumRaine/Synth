class FilterParams extends HTMLFieldSetElement {
	type = null;
	cutoff = null;

	constructor(){
		super();
		super.setAttribute("is", "filter-params");

		let legend = this.appendChild(document.createElement("legend"));
		legend.innerHTML = "Parameters";

		this.type = this.appendChild(new FilterType());
		this.cutoff = this.appendChild(new FilterCutoff());
	}

	duplicate(){
		let dupe = new FilterParams();

		dupe.type.input.value = this.type.input.value;

		dupe.cutoff.input.value = this.cutoff.input.value;
		dupe.cutoff.paramValue = this.cutoff.paramValue;

		return dupe;
	}
}

customElements.define("filter-params", FilterParams, { extends: "fieldset" });

