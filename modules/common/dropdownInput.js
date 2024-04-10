class DropdownInput extends LabelledInput {
	select = null;
	constructor(label, entries){
		super(label);
		this.select = this.input = this.appendChild(document.createElement("select"));
		for (let entry of entries){
			let option = document.createElement("option");
			option.innerHTML = entry;
			option.setAttribute("value", entry.toLowerCase().replaceAll(" ", ""));
			this.select.options.add(option);
		}

		this.input.setPercent = (percent) => { this.Percent = percent; };
	}

	set Percent(percent){
		// Convert percentage to index position and select relevant option
		// Called when MIDI knob is moved while dropdown has focus
		let fraction = percent / 100;
		let count = this.select.options.length - 1;
		let index = Math.round(count * fraction);
		this.select.options[index].selected = true;

		// Prompt parent to update sounds on the fly
		this.dispatchEvent(new Event("input", { bubbles: true }));
	}
}

