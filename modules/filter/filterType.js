class FilterType extends DropdownInput {
	static TYPES = ["Low Pass", "High Pass", "Band Pass", "Low Shelf", "High Shelf", "Peaking", "Notch", "All Pass"];
	constructor(){
		super("Filter", FilterType.TYPES);
		super.setAttribute("is", "filter-type");
	}
}

customElements.define("filter-type", FilterType, { extends: "div" });

