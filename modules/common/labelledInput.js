class LabelledInput extends HTMLDivElement {
	label = null;
	input = null;

	constructor(label){
		super();
		this.label = this.appendChild(document.createElement("label"));
		this.label.innerHTML = label;
	}

	get Value(){
		return this.input.value;
	}
}

