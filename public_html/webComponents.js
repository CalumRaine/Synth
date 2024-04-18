class CalumElement extends HTMLElement {
	element = null;
	init(type){
		this.element = this.appendChild(document.createElement(type));
		super.className = "web-component";
		this.appendChild = (child) => { return this.element.appendChild(child); };
		this.setAttribute = (key, value) => { return this.element.setAttribute(key, value); };
		this.getBoundingClientRect = () => { return this.element.getBoundingClientRect(); };
		this.releasePointerCapture = () => { return this.element.releasePointerCapture(); };
		this.addEventListener = (name, func) => { return this.element.addEventListener(name, func); };
		return this;
	}

	get innerHTML(){
		return this.element.innerHTML;
	}

	set innerHTML(value){
		this.element.innerHTML = value;
	}

	get className(){
		return this.element.className;
	}

	set className(value){
		this.element.className = value;
	}

	get classList(){
		return this.element.classList;
	}

	get style(){
		return this.element.style;
	}

	set style(value){
		this.element.style = value;
	}

	get ongotpointercapture(){
		return this.element.ongotpointercapture;
	}

	set ongotpointercapture(value){
		this.element.ongotpointercapture = value;
	}
}

class CalumFieldset extends CalumElement {
	init(title){
		super.init("fieldset");
		this.appendChild(document.createElement("legend")).innerHTML = title;
		return this;
	}
}


class CalumForm extends CalumElement {
	init(){
		super.init("form");
		return this;
	}
}

class CalumDiv extends CalumElement {
	init(){
		super.init("div");
		return this;
	}
}

class CalumButton extends CalumElement {
	init(){
		super.init("button");
		this.setAttribute("type", "button");
		return this;
	}
}

customElements.define("calum-fieldset", CalumFieldset);
customElements.define("calum-form", CalumForm);
customElements.define("calum-div", CalumDiv);
customElements.define("calum-button", CalumButton);

