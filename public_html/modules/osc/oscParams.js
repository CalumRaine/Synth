class OscParams extends CalumFieldset {
	shape = null;
	shift = null;
	detune = null;
	help = null;

	init(helpText){
		super.init("Parameters");

		this.shape = this.appendChild(new OscShape().init());
		this.shift = this.appendChild(new OscShift().init());
		this.detune = this.appendChild(new OscDetune().init());

		this.help = this.appendChild(new HelpButton().init(helpText));
		return this;
	}

	toJson(){
		let json = {};
		json.shape = this.shape.toJson();
		json.shift = this.shift.toJson();
		json.detune = this.detune.toJson();
		return json;
	}

	fromJson(json){
		this.shape.fromJson(json.shape);
		this.shift.fromJson(json.shift);
		this.detune.fromJson(json.detune);
		return true;
	}
}

customElements.define("osc-params", OscParams);

