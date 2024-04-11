class AmpParams extends HTMLFieldSetElement {
	gain = null;
	constructor(){
		super();
		super.setAttribute("is", "amp-params");

		let legend = this.appendChild(document.createElement("legend"));
		legend.innerHTML = "Parameters";

		this.gain = this.appendChild(new AmpGain());
	}
}

customElements.define("amp-params", AmpParams, { extends: "fieldset" });

