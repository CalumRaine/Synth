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
}

customElements.define("filter-params", FilterParams, { extends: "fieldset" });

