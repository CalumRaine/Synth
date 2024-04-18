class OscShape extends DropdownInput {
	static SHAPES = ["Sine", "Triangle", "Square", "Sawtooth"];

	init(){
		super.init("Shape", OscShape.SHAPES);
		return this;
	}
}

customElements.define("osc-shape", OscShape);

