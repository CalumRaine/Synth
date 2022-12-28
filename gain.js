class Gain extends Control {
	gain = 1;

	input = null;
	gainIn = null;
	output = null;

	constructor(id, synth){
		super(id, synth, "Gain");
		this.generate();
	}

	set Gain(value){
		this.gain = value;
		this.nodes.forEach(node => node.gain.value = this.gain);
	}

	get Gain(){
		return this.gain;
	}

	set GainIn(connection){
		connection.to = this;
		this.gainIn = connection;
		for (let n in this.nodes){
			connection.from.nodes[n].disconnect();
			connection.from.nodes[n].connect(this.nodes[n].gain);
		}
		console.log("New Connection:", connection.from.title, connection.to.title, "Gain");
	}

	set Input(connection){
		connection.to = this;
		this.input = connection;
		for (let n in this.nodes){
			connection.from.nodes[n].disconnect();
			connection.from.nodes[n].connect(this.nodes[n]);
		}
		console.log("New Connection:", connection.from.title, connection.to.title, "Input");
	}

	set Output(connection){
		connection.from = this;
		this.out = connection;
	}

	make(){
		let node = new GainNode(this.synth.ac);
		node.gain.value = this.gain;

		this.nodes.push(node);
		return node;
	}

	connect(){
		if (this.input != null){
			this.input.from.LastNode.connect(this.LastNode);
		}

		if (this.gainIn != null){
			this.gainIn.from.LastNode.connect(this.LastNode.gain);
		}
	}

	generate(){
		let div = super.addControl();

		let table = div.querySelector("table");

		// Input Jack
		let cell = super.addLabelledRow(table, "Input");
		let inputJackFunc = function() { this.calumObject.Input = this.calumObject.synth.wire; };
		super.addJack(cell, inputJackFunc);

		// Gain
		cell = super.addLabelledRow(table, "Gain");
		let gainFunc = function() { this.calumObject.Gain = this.value; };
		super.addInput(cell, "Gain", this.Gain, gainFunc);

		// Gain Jack
		let gainJackFunc = function() { this.calumObject.GainIn = this.calumObject.synth.wire; };
		super.addJack(cell, gainJackFunc);

		// Output Jack
		cell = super.addLabelledRow(table, "Output");
		let outputJackFunc = function() { this.calumObject.synth.wire = new Connection(this.calumObject); };
		super.addJack(cell, outputJackFunc);

		// Handle
		super.addHandle(div);
	}
}
