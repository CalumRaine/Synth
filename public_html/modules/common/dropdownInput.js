class DropdownInput extends LabelledInput {
	select = null;

	init(label, entries){
		super.init(label);
		this.select = this.input = this.appendChild(document.createElement("select"));
		for (let entry of entries){
			let option = document.createElement("option");
			option.innerHTML = entry;
			option.setAttribute("value", entry.toLowerCase().replaceAll(" ", ""));
			this.select.options.add(option);
		}

		this.input.percentToParam = (percent) => { this.percentToParam(percent); };
		return this;
	}

	percentToParam(percent){
		// Convert percentage to index position and select relevant option
		// Called when MIDI knob is moved while dropdown has focus
		let fraction = percent / 100;
		let count = this.select.options.length - 1;
		let index = Math.round(count * fraction);
		this.select.options[index].selected = true;

		// Prompt parent to update sounds on the fly
		this.dispatchEvent(new Event("input", { bubbles: true }));
	}

	toJson(){
		let json = {};
		json.value = this.select.selectedIndex;
		return json;
	}

	fromJson(json){
		this.select.selectedIndex = json.value;
		return true;
	}
}

customElements.define("dropdown-input", DropdownInput);

