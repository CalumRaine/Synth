class KeyboardKey extends HTMLButtonElement {
	num = 0;
	note = "A";
	freq = 440.0;
	span = null;
	qwertyKey = "";

	constructor(num, note, freq){
		super();
		super.setAttribute("is", "keyboard-key");
		this.num = num;
		this.note = note;
		this.freq = freq;
		this.span = this.appendChild(document.createElement("span"));
	}

	set QwertyKey(value){
		this.qwertyKey = value;
		this.span.innerHTML = value;
	}

	get MarginLeft(){
		return parseFloat(this.style.marginLeft.replace("px", ""));
	}

	set MarginLeft(value){
		this.style.marginLeft = `${value}px`;
	}

	play(){
		this.classList.add("key-pressed");
	}

	release(){
		this.classList.remove("key-pressed");
	}
}

customElements.define("keyboard-key", KeyboardKey, { extends: "button" });

