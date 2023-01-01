class Gain extends SoundModule {
	gain = 1;
	gainJack = null;
	inputJack = null;
	outputJack = null;

	constructor(id, polyphonic, audioContext){
		super(id, Module.GAIN, polyphonic, audioContext);
		this.gainJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node.gain; });
		this.inputJack = new Jack(id, Jack.INPUT, this.nodes, function(node) { return node; });
		this.outputJack = new Jack(id, Jack.OUTPUT, this.nodes, function(node) { return node; });
		if (!this.polyphonic){
			this.make(Keyboard.MONOPHONIC);
		}
	}

	set Gain(value){
		if (isNaN(parseFloat(value))){
			return;
		}
		this.gain = value;
		this.nodes.forEach(node => { node.gain.value = this.gain; node.gain.calumValue = this.gain; });
	}

	make(keyId){
		let node = new GainNode(this.audioContext);
		node.gain.value = this.gain;
		node.gain.calumValue = this.gain;
		return super.make(node, keyId);
	}
}
