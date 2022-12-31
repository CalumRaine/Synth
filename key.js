class Key {
	static KEY_DOWN = 0;
	static KEY_UP = 1;
	state = 0;
	keyId = 0;
	frequency = 440;
	nodes = [];

	constructor(id, frequency){
		this.keyId = id;
		this.frequency = frequency;

		// Make duplicates of polyphonic modules
		synth.modules.filter(module => module.polyphonic).map(module => module.make(this.keyId));

		// Set frequency of OscillatorKey modules
		for (let module of synth.modules.filter(module => module.moduleType == Module.OSCILLATOR_KEY)){
			let node = module.nodes.find(node => node.keyId == this.keyId);
			node.frequency.value = this.frequency;
			node.frequency.calumValue = this.frequency;
		}

		// Make connections
		synth.cables.forEach(cable => cable.connect(this.keyId));

		// Trigger envelopes
		synth.modules.filter(module => module.moduleType == Module.ENVELOPE_RELATIVE || module.moduleType == Module.ENVELOPE_ABSOLUTE)
			     .forEach(module => module.trigger(this.keyId));
	}

	remove(){
		synth.cables.forEach(cable => cable.disconnect(this.nodes));
		synth.nodes = [];
		return this;
	}
}
