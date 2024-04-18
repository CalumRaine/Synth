class AmpParams extends CalumFieldset {
	gain = null;
	help = null;

	init(helpText){
		super.init("Parameters");
		this.gain = this.appendChild(new AmpGain().init());
		this.help = this.appendChild(new HelpButton().init(helpText));
		return this;
	}

	toJson(){
		let json = {};
		json.gain = this.gain.toJson();
		return json;
	}

	fromJson(json){
		this.gain.fromJson(json.gain);
		return true;
	}
}

customElements.define("amp-params", AmpParams);

