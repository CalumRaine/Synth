class Oscillator extends SoundModule {
	type = "sine";
	types = ["sine", "square", "sawtooth", "triangle"];
	frequencyJack = null;
	outputJack = null;

	detune = 0;
	detuneJack = null;

	constructor(id, moduleType, polyphonic, audioContext){
		super(id, moduleType, polyphonic, audioContext);
		this.frequencyJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node.frequency; });
		this.detuneJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node.detune; });
		this.outputJack = new Jack(id, Jack.OUTPUT, this.nodes, function(node) { return node; });
	}

	set Type(value){
		if (!this.types.includes(value)){
			return;
		}
		this.type = value;
		this.nodes.forEach(node => node.type = this.type);
	}

	set Detune(value){
		if (isNaN(parseFloat(value))){
			return;
		}
		this.detune = value;
		this.nodes.forEach(node => { node.detune.value = this.detune; node.detune.calumValue = this.detune; })
	}

	make(node, keyId){
		node.type = this.type;
		node.detune.value = this.detune;
		node.detune.calumValue = this.detune;
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
		this.nodes.forEach(node => { node.frequency.value = this.frequency; node.frequency.calumValue = this.frequency; });
	}

	make(keyId){
		let node = new OscillatorNode(this.audioContext);
		node.frequency.value = this.frequency;
		node.frequency.calumValue = this.frequency;
		return super.make(node, keyId);
	}
}
