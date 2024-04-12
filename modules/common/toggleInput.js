class ToggleInput extends LabelledInput {
	light = null;
	constructor(label, checked){
		super(label);
		super.setAttribute("is", "toggle-input");

		this.light = this.appendChild(document.createElement("button"));
		this.light.addEventListener("click", (event) => { this.Checked = !this.Checked; });
		this.light.setAttribute("type", "button");
		
		this.input = this.light.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "checkbox");
		this.input.checked = checked;
		this.input.hidden = true;
	}

	get Value(){
		return this.input.checked;
	}

	set Checked(value){
		this.input.checked = value;
		if (this.input.checked){
			this.input.setAttribute("checked", "");
		}
		else {
			this.input.removeAttribute("checked");
		}
	}

	get Checked(){
		return this.input.checked;
	}

	toJson(){
		let json = {};
		json.value = this.Checked;
		return json;
	}

	fromJson(json){
		this.Checked = json.value;
		return true;
	}
}

customElements.define("toggle-input", ToggleInput, { extends: "div" });

