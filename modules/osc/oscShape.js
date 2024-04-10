class OscShape extends DropdownInput {
	static SHAPES = ["Sine", "Triangle", "Square", "Sawtooth"];

	constructor(){
		super("Shape", OscShape.SHAPES);
		super.setAttribute("is", "osc-shape");
	}
}

customElements.define("osc-shape", OscShape, { extends: "div" });

