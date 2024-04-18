class KeyboardKey extends CalumButton {
	num = 0;
	note = "A";
	freq = 440.0;
	span = null;
	qwertyKey = "";

	init(num, note, freq){
		super.init();
		this.num = num;
		this.note = note;
		this.freq = freq;
		this.span = this.appendChild(document.createElement("span"));

		// Hack to make it work on touchscreen
		this.span.ongotpointercapture = function(event) { this.releasePointerCapture(event.pointerId); };

		return this;
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

customElements.define("keyboard-key", KeyboardKey);

