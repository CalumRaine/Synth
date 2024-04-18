class QwertyRail extends CalumDiv {
	handle = null;
	grabbed = false;

	init(){
		super.init();
		return this;
	}

	set Grabbed(value){
		this.grabbed = value;
		if (this.grabbed){
			this.classList.add("grabbed");
		}
		else {
			this.classList.remove("grabbed");
		}
	}

	get Grabbed(){
		return this.grabbed;
	}
}

class QwertyHandle extends CalumDiv {
	init(){
		super.init();
		this.innerHTML = "&equiv;"

		// Hack to make it work on touchscreen
		this.ongotpointercapture = function(event) { this.releasePointerCapture(event.pointerId); };
		
		return this;
	}

	get MarginLeft(){
		return parseFloat(this.style.marginLeft.replace("px", ""));
	}

	set MarginLeft(value){
		this.style.marginLeft = `${value}px`;
	}
}

customElements.define("qwerty-rail", QwertyRail);
customElements.define("qwerty-handle", QwertyHandle);

