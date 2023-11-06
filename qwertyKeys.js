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
	}

	set Width(value){
		this.style.width = `${value}px`;
	}

	set LeftPos(value){
		this.style.marginLeft = `${value}px`;
	}
}

customElements.define("qwerty-rail", QwertyRail, { extends: "div" });
customElements.define("qwerty-handle", QwertyHandle, { extends: "div" });

