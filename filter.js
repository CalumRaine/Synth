class Filter extends Control {
	constructor(id, synth){
		super(id, synth, "Filter");
		this.node = new BiquadFilterNode(synth.ac);
		this.generate();
	}

	set Type(value){
		console.log("Filter type from", this.node.type, "to", value);
		this.node.type = value;
	}

	get Type(){
		return this.node.type;
	}

	set Freq(value){
		console.log("Filter frequency", value);
		this.node.frequency.value = value;
	}

	get Freq(){
		return this.node.frequency.value;
	}

	set Q(value){
		console.log("Filter Q", value);
		this.node.Q.value = value;
	}

	get Q(){
		return this.node.Q.value;
	}

	generate(){
		let div = super.addControl();

		let table = div.querySelector("table");

		let cell = super.addLabelledRow(table, "Type");
		let typeFunc = function() { this.calumObject.Type = this.value; };
		let select = super.addSelect(cell, typeFunc);
		super.addOption(select, "Low Pass", "lowpass");
		super.addOption(select, "High Pass", "highpass");
		super.addOption(select, "Band Pass", "bandpass");
		super.addOption(select, "Low Shelf", "lowshelf");
		super.addOption(select, "High Shelf", "highshelf");
		super.addOption(select, "Peaking", "peaking");
		super.addOption(select, "Notch", "notch");
		super.addOption(select, "All Pass", "allpass");

		cell = super.addLabelledRow(table, "Frequency");
		let freqFunc = function() { this.calumObject.Freq = this.value; };
		super.addInput(cell, "Frequency", this.Freq, this.node.frequency.minValue, this.node.frequency.maxValue, freqFunc);

		cell = super.addLabelledRow(table, "Q Factor");
		let qFunc = function() { this.calumObject.Q = this.value; };
		super.addInput(cell, "Q Factor", this.Q, this.node.Q.minValue, this.node.Q.maxValue, qFunc);

		super.addConnections(div);
	}
}
