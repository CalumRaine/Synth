class HelpButton extends CalumButton {
	modal = null;

	init(helpText){
		super.init();
		this.innerHTML = "?"
		this.modal = this.appendChild(document.createElement("dialog"));
		this.modal.appendChild(document.createElement("ul")).innerHTML = helpText;
		this.modal.appendChild(document.createElement("p")).innerHTML = "(click to close)";
		
		this.addEventListener("click", (event) => { this.modal.showModal(); });
		this.modal.addEventListener("click", (event) => { event.stopPropagation(); this.modal.close(); });
		return this;
	}
}

customElements.define("help-button", HelpButton);

