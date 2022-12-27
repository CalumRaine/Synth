class Gain extends Control {
	constructor(id, synth){
		super(id, synth, "Gain");
		this.node = new GainNode(synth.ac);
		this.generate();
	}

	set Gain(value){
		console.log("Gain", value);
		this.node.gain.value = value;
	}

	get Gain(){
		return this.node.gain.value;
	}

	generate(){
		let div = super.addControl();

		let table = div.querySelector("table");

		let cell = super.addLabelledRow(table, "Gain");

		let gainFunc = function() { this.calumObject.Gain = this.value; };
		super.addInput(cell, "Gain", this.node.gain.value, 0, 10, gainFunc);

		super.addConnections(div);
	}
}
