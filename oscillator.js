class Oscillator extends Control {
	constructor(id, synth){
		super(id, synth, "Oscillator");
		this.node = new OscillatorNode(synth.ac);
		this.node.start();
		this.generate();
	}

	set Type(value){
		this.node.type = value;
	}

	get Type(){
		return this.node.type;
	}

	set Freq(value){
		this.node.frequency.value = value;
	}

	get Freq(){
		return this.node.frequency.value;
	}

	set Detune(value){
		this.node.detune.value = value;
	}

	get Detune(){
		return this.node.detune.value;
	}

	connectFreqIn(){
		this.synth.wire.connect(this.node.frequency);
	}

	connectOut(){
		this.node.disconnect();
		this.synth.wire = this.node;
	}

	generate(){
		let div = super.addControl();

		let table = div.querySelector("table");

		let cell = super.addLabelledRow(table, "Type");
		let typeFunc = function() { this.calumObject.Type = this.value; };
		let select = super.addSelect(cell, typeFunc);
		super.addOption(select, "Sine", "sine");
		super.addOption(select, "Square", "square");
		super.addOption(select, "Sawtooth", "sawtooth");
		super.addOption(select, "Triangle", "triangle");

		cell = super.addLabelledRow(table, "Frequency");
		let freqFunc = function() { this.calumObject.Freq = this.value; };
		super.addInput(cell, "Frequency", this.Freq, 0, 10000, freqFunc);
		super.addJack(cell, function() { this.calumObject.connectFreqIn(); } );

		cell = super.addLabelledRow(table, "Detune");
		let detuneFunc = function() { this.calumObject.Detune = this.value; };
		super.addInput(cell, "Detune", this.Detune, -10000, 10000, detuneFunc);

		cell = super.addLabelledRow(table, "Output");
		super.addJack(cell, function() { this.calumObject.connectOut(); } );

		super.addHandle(div);
	}
}
