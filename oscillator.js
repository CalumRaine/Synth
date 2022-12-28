class Oscillator extends Control {
	frequency = 0;
	detune = 0;
	type = "sine";

	frequencyIn = null;
	detuneIn = null;
	output = null;

	constructor(id, synth){
		super(id, synth, "Oscillator");
		this.generate();
	}

	set Type(value){
		this.type = value;
		this.nodes.forEach(node => node.type = this.type);
	}

	get Type(){
		return this.type;
	}

	set Frequency(value){
		this.frequency = value;
		this.nodes.forEach(node => node.frequency.value = this.frequency);
	}

	get Frequency(){
		return this.frequency;
	}

	set FrequencyIn(connection){
		connection.to = this;
		this.frequencyIn = connection;
		for (let n in this.nodes){
			connection.from.nodes[n].disconnect();
			connection.from.nodes[n].connect(this.nodes[n].frequency);
		}
		console.log("New Connection:", connection.from.title, connection.to.title, "Frequency");
	}

	set Detune(value){
		this.detune = value;
		this.nodes.forEach(node => node.detune.value = this.detune);
	}

	get Detune(){
		return this.detune;
	}

	set DetuneIn(connection){
		connection.to = this;
		this.detuneIn = connection;
		for (let n in this.nodes){
			connection.from.nodes[n].disconnect();
			connection.from.nodes[n].connect(this.nodes[n].detune);
		}
		console.log("New Connection:", connection.from.title, connection.to.title, "Detune");
	}

	set Output(connection){
		connection.from = this;
		this.output = connection;
	}

	make(frequency){
		let node = new OscillatorNode(this.synth.ac);
		node.type = this.type;
		node.frequency.value = frequency;
		node.start();

		this.nodes.push(node);
		return node;
	}

	connect(){
		if (this.frequencyIn != null){
			this.frequencyIn.from.LastNode.connect(this.LastNode.frequency);
		}
		
		if (this.detuneIn != null){
			this.detuneIn.from.LastNode.connect(this.LastNode.detune);
		}
	}

	generate(){
		let div = super.addControl();

		let table = div.querySelector("table");

		// Wave type dropdown
		let cell = super.addLabelledRow(table, "Type");
		let typeFunc = function() { this.calumObject.Type = this.value; };
		let select = super.addSelect(cell, typeFunc);
		super.addOption(select, "Sine", "sine");
		super.addOption(select, "Square", "square");
		super.addOption(select, "Sawtooth", "sawtooth");
		super.addOption(select, "Triangle", "triangle");

		// Frequency Input
		cell = super.addLabelledRow(table, "Frequency");
		let freqFunc = function() { this.calumObject.Freq = this.value; };
		super.addInput(cell, "Frequency", this.Freq, freqFunc);

		// Frequency Jack
		let freqJackFunc = function() { this.calumObject.FrequencyIn = this.calumObject.synth.wire; };
		super.addJack(cell, freqJackFunc);

		// Detune
		cell = super.addLabelledRow(table, "Detune");
		let detuneFunc = function() { this.calumObject.Detune = this.value; };
		super.addInput(cell, "Detune", this.Detune, detuneFunc);

		// Detune Jack
		let detuneJackFunc = function() { this.calumObject.DetuneIn = this.calumObject.synth.wire; };
		super.addJack(cell, detuneJackFunc);

		// Output Jack
		cell = super.addLabelledRow(table, "Output");
		let outputJackFunc = function() { this.calumObject.synth.wire = new Connection(this.calumObject); };
		super.addJack(cell, outputJackFunc);

		// Handle
		super.addHandle(div);
	}
}
