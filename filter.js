class Filter extends Control {
	type = "lowpass";
	frequency = 100;
	qFactor = 1;

	input = null;
	frequencyIn = null;
	qFactorIn = null;
	output = null;

	constructor(id, synth){
		super(id, synth, "Filter");
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

	set QFactor(value){
		this.qFactor = value;
		this.nodes.forEach(node => node.Q.value = this.qFactor);
	}

	get QFactor(){
		return this.qFactor;
	}

	set QFactorIn(connection){
		connection.to = this;
		this.qFactorIn = connection;
		for (let n in this.nodes){
			connection.from.nodes[n].disconnect();
			connection.from.nodes[n].connect(this.nodes[n].Q);
		}
		console.log("New Connection:", connection.from.title, connection.to.title, "Q Factor");
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

	make(){
		let node = new BiquadFilterNode(this.synth.ac);
		node.type = this.type;
		node.frequency.value = this.frequency;
		node.Q.value = this.qFactor;
		this.nodes.push(node);
		return node;
	}

	connect(){
		if (this.input != null){
			this.input.from.LastNode.connect(this.LastNode);
		}

		if (this.frequencyIn != null){
			this.frequencyIn.from.LastNode.connect(this.LastNode.frequency);
		}

		if (this.qFactorIn != null){
			this.qFactorIn.from.LastNode.connect(this.LastNode.qFactor);
		}
	}

	generate(){
		let div = super.addControl();

		let table = div.querySelector("table");

		// Input Jack
		let cell = super.addLabelledRow(table, "Input");
		let inputJackFunc = function() { this.calumObject.Input = this.calumObject.synth.wire; };
		super.addJack(cell, inputJackFunc);

		// Filter type
		cell = super.addLabelledRow(table, "Type");
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

		// Frequency Cutoff
		cell = super.addLabelledRow(table, "Frequency");
		let freqFunc = function() { this.calumObject.Frequency = this.value; };
		super.addInput(cell, "Frequency", this.Frequency, freqFunc);

		// Frequency Cutoff Jack
		let freqJackFunc = function() { this.calumObject.FrequencyIn = this.calumObject.synth.wire; };
		super.addJack(cell, freqJackFunc);
	
		// Q Factor
		cell = super.addLabelledRow(table, "Q Factor");
		let qFactorFunc = function() { this.calumObject.QFactor = this.value; };
		super.addInput(cell, "Q Factor", this.QFactor, qFactorFunc);

		// Q Factor Jack
		let qFactorJackFunc = function() { this.calumObject.QFactorIn = this.calumObject.synth.wire; };
		super.addJack(cell, qFactorJackFunc);

		// Output Jack
		cell = super.addLabelledRow(table, "Output");
		let outputJackFunc = function() { this.calumObject.synth.wire = new Connection(this.calumObject); };
		this.addJack(cell, outputJackFunc);

		// Handle
		super.addHandle(div);
	}
}
