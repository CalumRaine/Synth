class Oscillator extends SoundModule {
	type = "sine";
	types = ["sine", "square", "sawtooth", "triangle"];
	frequencyJack = null;
	outputJack = null;

	constructor(id, moduleType, polyphonic, audioContext){
		super(id, moduleType, polyphonic, audioContext);
		this.frequencyJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node.frequency; });
		this.outputJack = new Jack(id, Jack.OUTPUT, this.nodes, function(node) { return node; });
	}

	set Type(value){
		if (!this.types.includes(value)){
			return;
		}
		this.type = value;
		this.nodes.forEach(node => node.type = this.type);
	}

	make(node, keyId){
		node.type = this.type;
		node.start();
		return super.make(node, keyId);
	}
}

class OscillatorKey extends Oscillator {
	constructor(id, polyphonic, audioContext){
		super(id, Module.OSCILLATOR_KEY, polyphonic, audioContext);
	}

	make(keyId){
		let node = new OscillatorNode(this.audioContext);
		return super.make(node, keyId);
	}
}

class OscillatorFixed extends Oscillator {
	frequency = 440;

	constructor(id, polyphonic, audioContext){
		super(id, Module.OSCILLATOR_FIXED, polyphonic, audioContext);
	}

	set Frequency(value){
		if (isNaN(parseFloat(value))){
			return;
		}
		this.frequency = value;
		this.nodes.forEach(node => node.frequency.value = this.frequency);
	}

	make(keyId){
		let node = new OscillatorNode(this.audioContext);
		return super.make(node, keyId);
	}
}
