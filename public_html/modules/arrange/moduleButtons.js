class ModuleButtons extends HTMLDivElement {
	duplicate = null;
	remove = null;
	constructor(){
		super();
		super.setAttribute("is", "module-buttons");

		this.duplicate = this.appendChild(document.createElement("button"));
		this.duplicate.setAttribute("type", "button");
		this.duplicate.setAttribute("title", "Duplicate module");
		this.duplicate.innerHTML = "+";

		this.remove = this.appendChild(document.createElement("button"));
		this.remove.setAttribute("type", "button");
		this.remove.setAttribute("title", "Remove module");
		this.remove.innerHTML = "-";
	}
}

customElements.define("module-buttons", ModuleButtons, { extends: "div" });

