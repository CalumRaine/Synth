class OscShape extends LabelledInput {
	static SHAPES = ["Sine", "Triangle", "Square", "Sawtooth"];
	select = null;

	constructor(){
		super("Shape");
		super.setAttribute("is", "osc-shape");

		this.select = this.input = this.appendChild(document.createElement("select"));
		for (let shape of OscShape.SHAPES){
			let option = document.createElement("option");
			option.setAttribute("value", shape.toLowerCase());
			option.innerHTML = shape;
			this.select.options.add(option);
		}
	}
}

customElements.define("osc-shape", OscShape, { extends: "div" });

