class PanParams extends CalumFieldset {
	pan = null;
	help = null;

	init(helpText){
		super.init("Parameters");
		this.pan = this.appendChild(new PanStereo().init());
		this.help = this.appendChild(new HelpButton().init(helpText));
		return this;
	}

	toJson(){
		let json = {};
		json.pan = this.pan.toJson();
		return json;
	}

	fromJson(json){
		this.pan.fromJson(json.pan);
		return true;
	}
}

customElements.define("pan-params", PanParams);

