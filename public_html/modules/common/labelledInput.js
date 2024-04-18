class LabelledInput extends CalumDiv {
	// Div containing a labelled input
	// Can also be used with select element
	// (Just make sure this.input is the <select>)
	label = null;
	input = null;

	init(label){
		super.init();
		this.label = this.appendChild(document.createElement("label"));
		this.label.innerHTML = label;
		return this;
	}

	get Value(){
		return this.input.value;
	}
}

