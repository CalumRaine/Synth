class Oscillator extends Control {
	constructor(id, synth){
		super(id, synth, "Oscillator");
		this.node = new OscillatorNode(synth.ac);
		this.node.start();
		this.generate();
	}

	set Type(value){
		console.log("Oscillator type from", this.node.type, "to", value);
		this.node.type = value;
	}

	get Type(){
		return this.node.type;
	}

	set Freq(value){
		console.log("Oscillator frequency", this.node.frequency.value);
		this.node.frequency.value = value;
	}

	get Freq(){
		return this.node.frequency.value;
	}

	set Detune(value){
		console.log("Oscillator detune", this.node.detune.value);
		this.node.detune.value = value;
	}

	get Detune(){
		return this.node.detune.value;
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

		cell = super.addLabelledRow(table, "Detune");
		let detuneFunc = function() { this.calumObject.Detune = this.value; };
		super.addInput(cell, "Detune", this.Detune, -10000, 10000, detuneFunc);

		super.addConnections(div);
	}
}
