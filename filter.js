class Filter extends SoundModule {
	type = "lowpass";
	types = ["lowpass", "highpass", "lowshelf", "highshelf", "bandpass", "peaking", "notch", "allpass"];
	frequency = 1000;
	frequencyJack = null;
	qFactor = 1;
	qFactorJack = null;
	inputJack = null;
	outputJack = null;

	constructor(id, polyphonic, audioContext){
		super(id, Module.FILTER, polyphonic, audioContext);
		this.frequencyJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node.frequency; });
		this.qFactorJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node.Q; });
		this.inputJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node; });
		this.outputJack = new Jack(id, Jack.OUTPUT, this.nodes, function(node) { return node; });
		if (!this.polyphonic){
			this.make(Keyboard.MONOPHONIC);
		}
	}

	set Type(value){
		if (!this.types.includes(value)){
			return;
		}
		this.type = value;
		this.nodes.forEach(node => node.type = this.type);
	}

	set Frequency(value){
		if (isNaN(parseFloat(value))){
			return;
		}
		this.frequency = value;
		this.nodes.forEach(node => { node.frequency.value = this.frequency; node.frequency.calumValue = this.frequency; });
	}

	set QFactor(value){
		if (isNaN(parseFloat(value))){
			return;
		}
		this.qFactor = value;
		this.nodes.forEach(node => { node.Q.value = this.qFactor; node.Q.calumValue = this.qFactor; });
	}

	make(keyId){
		let node = new BiquadFilterNode(this.audioContext);
		node.type = this.type;
		node.frequency.value = this.frequency;
		node.frequency.calumValue = this.frequency;
		node.Q.value = this.qFactor;
		node.Q.calumValue = this.qFactor;
		return super.make(node, keyId);
	}
}
