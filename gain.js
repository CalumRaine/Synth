class Gain extends Control {
	constructor(id, synth){
		super(id, synth, "Gain");
		this.node = new GainNode(synth.ac);
		this.generate();
	}

	set Gain(value){
		this.node.gain.value = value;
	}

	get Gain(){
		return this.node.gain.value;
	}

	connectGainIn(){
		this.synth.wire.connect(this.node.gain);
	}

	connectIn(){
		this.synth.wire.connect(this.node);
	}

	connectOut(){
		this.node.disconnect();
		this.synth.wire = this.node;
	}

	generate(){
		let div = super.addControl();

		let table = div.querySelector("table");

		let cell = super.addLabelledRow(table, "Input");
		super.addJack(cell, function() { this.calumObject.connectIn(); } );

		cell = super.addLabelledRow(table, "Gain");
		let gainFunc = function() { this.calumObject.Gain = this.value; };
		super.addInput(cell, "Gain", this.node.gain.value, 0, 10, gainFunc);
		super.addJack(cell, function() { this.calumObject.connectGainIn(); } );

		cell = super.addLabelledRow(table, "Output");
		super.addJack(cell, function() { this.calumObject.connectOut(); } );

		super.addHandle(div);
	}
}
