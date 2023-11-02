class DropdownParameter extends HTMLDivElement {
	constructor(text, options){
		super();
		super.setAttribute("is", "dropdown-parameter");
		
		this.label = document.createElement("label");
		this.label.innerHTML = text;
		this.label.for = text.replaceAll(" ", "-");
		this.appendChild(this.label);

		this.input = document.createElement("select");
		this.input.name = this.label.for;
		this.appendChild(this.input);

		for (let option of options){
			let opt = document.createElement("option");
			opt.innerHTML = option;
			opt.value = option.toLowerCase().replaceAll(" ", "-");
			this.input.add(opt);
		}
	}
}

class WaveformSelector extends DropdownParameter {
        shapes = ["Sine", "Square", "Sawtooth", "Triangle"];

        constructor(){
                super("Waveform", ["Sine", "Square", "Sawtooth", "Triangle"]);
        }
}

class LfoModule extends HTMLFieldSetElement {
	legend = null;
	waveformSelector = null;
	lfo = null;

	constructor(text){
		super();
		this.legend = document.createElement("legend");
		this.legend.innerHTML = text;
		this.appendChild(this.legend);
		
		this.waveformSelector = new WaveformSelector();
		this.appendChild(this.waveformSelector);

		this.freq = new NumericalParameter("freq");
		this.appendChild(this.freq);

		this.amp = new NumericalParameter("amp");
		this.appendChild(this.amp);
	}
}

class NumericalParameter extends HTMLDivElement {
	label = null;
	input = null;
	constructor(text){
		super();
		super.setAttribute("is", "numerical-parameter");

		this.label = document.createElement("label");
		this.label.innerHTML = text;
		this.label.for = text.replaceAll(" ", "-");
		this.appendChild(this.label);

		this.input = document.createElement("input");
		this.input.name = this.label.for;
		this.input.type = "number";
		this.input.min = 0;
		this.input.size = 6;
		this.input.value = 0;
		this.appendChild(this.input);
	}
}

customElements.define("dropdown-parameter", DropdownParameter, { extends: "div" });
customElements.define("waveform-selector", WaveformSelector, { extends: "div" });
customElements.define("lfo-module", LfoModule, { extends: "fieldset" });
customElements.define("numerical-parameter", NumericalParameter, { extends: "div" });

