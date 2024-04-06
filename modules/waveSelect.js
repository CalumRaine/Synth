class WaveSelect extends LabelledInput {
	static WAVES = ["Sine", "Triangle", "Square", "Sawtooth"];
	select = null;

	constructor(){
		super("Shape");
		super.setAttribute("is", "wave-select");

		this.select = this.input = this.appendChild(document.createElement("select"));
		for (let wave of WaveSelect.WAVES){
			let option = document.createElement("option");
			option.value = wave.toLowerCase();
			option.innerHTML = wave;
			this.select.options.add(option);
		}
	}
}

customElements.define("wave-select", WaveSelect, { extends: "div" });

