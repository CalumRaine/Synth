class LabelledInput extends HTMLDivElement {
	// Div containing a labelled input
	// Can also be used with select element
	// (Just make sure this.input is the <select>)
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

