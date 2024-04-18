class ModuleButtons extends CalumDiv {
	duplicate = null;
	remove = null;
	
	init(){
		super.init();
		
		this.duplicate = this.appendChild(document.createElement("button"));
		this.duplicate.setAttribute("type", "button");
		this.duplicate.setAttribute("title", "Duplicate module");
		this.duplicate.innerHTML = "+";

		this.remove = this.appendChild(document.createElement("button"));
		this.remove.setAttribute("type", "button");
		this.remove.setAttribute("title", "Remove module");
		this.remove.innerHTML = "-";

		return this;
	}
}

customElements.define("module-buttons", ModuleButtons);

