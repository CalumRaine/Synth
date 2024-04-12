class ToggleInput extends LabelledInput {
	light = null;
	constructor(label, checked){
		super(label);
		super.setAttribute("is", "toggle-input");

		this.light = this.appendChild(document.createElement("button"));
		this.light.onclick = (event) => { return this.toggle(); };
		this.light.setAttribute("type", "button");
		
		this.input = this.light.appendChild(document.createElement("input"));
		this.input.setAttribute("type", "checkbox");
		this.input.checked = checked;
		this.input.hidden = true;
	}

	get Value(){
		return this.input.checked;
	}

	toggle(){
		this.input.checked = !this.input.checked;
		return this.input.checked ? this.input.setAttribute("checked", "") : this.input.removeAttribute("checked");
	}
}

customElements.define("toggle-input", ToggleInput, { extends: "div" });

