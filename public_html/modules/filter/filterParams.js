class FilterParams extends CalumFieldset {
	type = null;
	cutoff = null;
	help = null;

	init(helpText){
		super.init("Parameters");
		this.type = this.appendChild(new FilterType().init());
		this.cutoff = this.appendChild(new FilterCutoff().init());
		this.help = this.appendChild(new HelpButton().init(helpText));
		return this;
	}

	toJson(){
		let json = {};
		json.type = this.type.toJson();
		json.cutoff = this.cutoff.toJson();
		return json;
	}

	fromJson(json){
		this.type.fromJson(json.type);
		this.cutoff.fromJson(json.cutoff);
		return true;
	}
}

customElements.define("filter-params", FilterParams);

