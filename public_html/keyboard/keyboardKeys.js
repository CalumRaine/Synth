class KeyboardKeys extends HTMLDivElement {
	constructor(){
		super();
		super.setAttribute("is", "keyboard-keys");
	}

	get MarginLeft(){
		return parseFloat(this.style.marginLeft.replace("px", ""));
	}

	set MarginLeft(value){
		this.style.marginLeft = `${value}px`;
	}
}

customElements.define("keyboard-keys", KeyboardKeys, { extends: "div" });

