class QwertyRail extends HTMLDivElement {
	constructor(){
		super();
		super.setAttribute("is", "qwerty-rail");
	}

	connectedCallback(){
		this.handle = new QwertyHandle();
		this.appendChild(this.handle);
	}

	set HandleWidth(value){
		this.handle.Width = value;
	}

	set HandleLeftPos(value){
		this.handle.LeftPos = value;
	}
}

class QwertyHandle extends HTMLDivElement {
	constructor(){
		super();
		super.setAttribute("is", "qwerty-handle");
		this.addEventListener("pointerdown", this.click);
	}

	click(event){
		this.addEventListener("pointermove", this.slide);
		this.addEventListener("pointerup", this.release);
	}

	slide(event){
		this.LeftPos += event.movementX;
		this.announce("qwerty moved", this.LeftPos);
	}

	release(event){
		this.removeEventListener("pointermove", this.slide);
		this.removeEventListener("pointerup", this.release);
		this.announce("qwerty released", this.LeftPos);
	}

	set Width(value){
		this.style.width = `${value}px`;
	}

	get LeftPos(){
		return parseFloat(this.style.marginLeft.replace("px",""));
	}

	set LeftPos(value){
		this.style.marginLeft = `${value}px`;
	}

	announce(msg, attachment){
                let e = new CustomEvent("QwertyHandle", { detail: { msg: msg, attachment: attachment }, bubbles: true });
                this.dispatchEvent(e);
        }
}

customElements.define("qwerty-rail", QwertyRail, { extends: "div" });
customElements.define("qwerty-handle", QwertyHandle, { extends: "div" });

