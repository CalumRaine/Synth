class Module {
	audioContext = null;
	moduleId = 0;
	moduleType = 0;
	static OSCILLATOR = 0;
	static OSCILLATOR_KEY = 1;
	static OSCILLATOR_FIXED = 2;
	static FILTER = 3;
	static GAIN = 4;
	static SPEAKERS = 5;
	static ENVELOPE = 6;
	static ENVELOPE_RELATIVE = 7;
	static ENVELOPE_ABSOLUTE = 8;

	constructor(id, type, audioContext){
		this.moduleId = id;
		this.moduleType = type;
		this.audioContext = audioContext;
	}

	triggerEvent(value, func){
		let e = new CustomEvent("Synth Event", { detail: { func: func, value: value, moduleId: this.moduleId } } );
		document.dispatchEvent(e);
	}
}

class ControlModule extends Module {
	constructor(id, type, audioContext){
		super(id, type, audioContext);
	}
}

class SoundModule extends Module {
	polyphonic = false;
	nodes = [];

	constructor(id, type, polyphonic, audioContext){
		super(id, type, audioContext);
		this.polyphonic = polyphonic;
	}

	make(node, keyId){
		node.moduleId = this.moduleId;
		node.keyId = keyId;
		this.nodes.push(node);
		return node;
	}
}
