class HelpButton extends HTMLButtonElement {
	modal = null;
	constructor(helpText){
		super();
		super.setAttribute("is", "help-button");
		super.setAttribute("type", "button");
		this.innerHTML = "?"
		this.modal = this.appendChild(document.createElement("dialog"));
		this.modal.appendChild(document.createElement("ul")).innerHTML = helpText;
		this.modal.appendChild(document.createElement("p")).innerHTML = "(click to close)";

		this.addEventListener("click", (event) => { this.modal.showModal(); });
		this.modal.addEventListener("click", (event) => { event.stopPropagation(); this.modal.close(); });
	}
}

customElements.define("help-button", HelpButton, { extends: "button" });

