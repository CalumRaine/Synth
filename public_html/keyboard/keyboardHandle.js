class QwertyRail extends HTMLDivElement {
	handle = null;
	grabbed = false;

	constructor(){
		super();
		super.setAttribute("is", "qwerty-rail");
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

class QwertyHandle extends HTMLDivElement {
	constructor(){
		super();
		super.setAttribute("is", "qwerty-handle");
		this.innerHTML = "&equiv;"
	}

	get MarginLeft(){
		return parseFloat(this.style.marginLeft.replace("px", ""));
	}

	set MarginLeft(value){
		this.style.marginLeft = `${value}px`;
	}
}

customElements.define("qwerty-rail", QwertyRail, { extends: "div" });
customElements.define("qwerty-handle", QwertyHandle, { extends: "div" });

