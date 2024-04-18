class KeyboardKeys extends CalumDiv {
	init(){
		super.init();
		return this;
	}

	get MarginLeft(){
		return parseFloat(this.style.marginLeft.replace("px", ""));
	}

	set MarginLeft(value){
		this.style.marginLeft = `${value}px`;
	}
}

customElements.define("keyboard-keys", KeyboardKeys);

