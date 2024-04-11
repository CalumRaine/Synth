class AmpParams extends HTMLFieldSetElement {
	gain = null;

	constructor(){
		super();
		super.setAttribute("is", "amp-params");

		let legend = this.appendChild(document.createElement("legend"));
		legend.innerHTML = "Parameters";

		this.gain = this.appendChild(new AmpGain());
	}

	duplicate(){
		let dupe = new AmpParams();

		dupe.gain.input.value = this.gain.input.value;
		dupe.gain.paramValue = this.gain.paramValue;

		return dupe;
	}
}

customElements.define("amp-params", AmpParams, { extends: "fieldset" });

