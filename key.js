class Key {
	static KEY_DOWN = 0;
	static KEY_UP = 1;
	state = 0;
	keyId = 0;
	keyCode = 0;
	frequency = 440;
	nodes = [];

	constructor(id, keyCode, frequency){
		this.keyId = id;
		this.keyCode = keyCode;
		this.frequency = frequency;

		// Make duplicates of polyphonic modules
		synth.modules.filter(module => module.hasType(Module.POLYPHONIC)).map(module => module.make(this.keyId));

		// Set frequency of OscillatorKey modules
		for (let module of synth.modules.filter(module => module.hasType(Module.OSCILLATOR_KEY))){
			let node = module.nodes.find(node => node.keyId == this.keyId);
			node.frequency.value = this.frequency;
			node.frequency.calumValue = this.frequency;
		}

		// Make connections
		synth.cables.forEach(cable => cable.connect(this.keyId));

		// Trigger envelopes
		synth.modules.filter(module => module.hasType(Module.ENVELOPE)).forEach(module => module.trigger(this.keyId));
	}

	release(){
		let envelopes = synth.modules.filter(module => module.hasType(Module.ENVELOPE));
		let releaseTime = Math.max(...envelopes.map(envelope => envelope.ReleaseTime));
		envelopes.forEach(envelope => envelope.release(this.keyId));

		let oscillators = synth.modules.filter(module => module.hasType(Module.OSCILLATOR_KEY));
		oscillators.forEach(oscillator => oscillator.release(this.keyId, releaseTime));

		this.state = Key.KEY_UP;
	}
}
