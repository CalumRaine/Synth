class FilterType extends LabelledInput {
	static TYPES = ["Low Pass", "High Pass", "Band Pass", "Low Shelf", "High Shelf", "Peaking", "Notch", "All Pass"];
	select = null;

	constructor(){
		super("Filter");
		super.setAttribute("is", "filter-type");

		this.select = this.input = this.appendChild(document.createElement("select"));
		for (let type of FilterType.TYPES){
			let option = document.createElement("option");
			option.innerHTML = type;
			option.setAttribute("value", type.toLowerCase().replace(" ", ""));
			this.select.options.add(option);
		}
	}
}

customElements.define("filter-type", FilterType, { extends: "div" });

