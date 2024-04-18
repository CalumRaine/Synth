class FilterType extends DropdownInput {
	static TYPES = ["Low Pass", "High Pass", "Band Pass", "Low Shelf", "High Shelf", "Peaking", "Notch", "All Pass"];

	init(){
		super.init("Filter", FilterType.TYPES);
		return this;
	}
}

customElements.define("filter-type", FilterType);

